import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { usePostHog } from 'posthog-react-native';
import { supabase } from '../utils/supabaseClient';
import { EVENTS } from '../utils/analytics';

const UserContext = createContext();

const DEFAULT_USER = {
    name: 'Guest User',
    email: '',
    onboardedAt: null,
    userType: 'former_smoker', // 'former_smoker' or 'current_vaper'
    cigarettesPerDay: 10,
    cigarettesPerPack: 20,
    packCost: 15,
    dailyPuffGoal: 100, // For current vapers
    currentVape: null,
    vapeDetails: {
        size: 0,
        nicotine: 0,
        type: 'Pod',
        cost: 0
    },
    juiceLevel: 100,
    bottleSize: 2,
    xp: 0,
    isSmokeFree: false,
    smokeFreeStartTime: null
};

export const UserProvider = ({ children }) => {
    const posthog = usePostHog(); // Add PostHog hook
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(DEFAULT_USER);
    const [logs, setLogs] = useState([]);
    const [badges, setBadges] = useState([]);
    const [juicePurchases, setJuicePurchases] = useState([]);
    const [purchasedRewards, setPurchasedRewards] = useState([]);
    const [equippedRewards, setEquippedRewards] = useState({
        icon: null,
        border: null,
        effect: null
    });
    const [lastXPCalculation, setLastXPCalculation] = useState(null);

    const xp = user.xp || 0;

    // Load data from AsyncStorage
    useEffect(() => {
        loadFromStorage();
    }, []);

    const loadFromStorage = async () => {
        try {
            const [
                savedUser,
                savedLogs,
                savedBadges,
                savedJuicePurchases,
                savedPurchasedRewards,
                savedEquippedRewards,
                savedLastXPCalc
            ] = await Promise.all([
                AsyncStorage.getItem('vapetrack_user'),
                AsyncStorage.getItem('vapetrack_logs'),
                AsyncStorage.getItem('vapetrack_badges'),
                AsyncStorage.getItem('vapetrack_juice_purchases'),
                AsyncStorage.getItem('vapetrack_purchased_rewards'),
                AsyncStorage.getItem('vapetrack_equipped_rewards'),
                AsyncStorage.getItem('vapetrack_last_xp_calc')
            ]);

            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedLogs) setLogs(JSON.parse(savedLogs));
            if (savedBadges) setBadges(JSON.parse(savedBadges));
            if (savedJuicePurchases) setJuicePurchases(JSON.parse(savedJuicePurchases));
            if (savedPurchasedRewards) setPurchasedRewards(JSON.parse(savedPurchasedRewards));
            if (savedEquippedRewards) setEquippedRewards(JSON.parse(savedEquippedRewards));
            if (savedLastXPCalc) setLastXPCalculation(savedLastXPCalc);
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    };

    // Supabase Auth & Sync
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) loadUserData(session.user.id);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                loadUserData(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadUserData = async (userId) => {
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const userEmail = currentSession?.user?.email || '';

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profile && profile.data) {
                // Profile exists, load it
                setUser(prev => ({
                    ...prev,
                    ...profile.data,
                    email: userEmail,
                    name: profile.data.name || profile.username || prev.name
                }));
            } else if (profileError && profileError.code === 'PGRST116') {
                // Profile doesn't exist - will be created during signup or first sync
                // Just update email for now, don't create profile yet
                setUser(prev => ({ ...prev, email: userEmail }));
            }

            const { data: remoteLogs, error: logsError } = await supabase
                .from('logs')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: true });

            if (remoteLogs && remoteLogs.length > 0) {
                setLogs(remoteLogs);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const syncUserToSupabase = async (userData, userId = session?.user?.id) => {
        if (!userId) return;
        try {
            // Generate a unique username based on userId to avoid conflicts
            // Use the name if it's valid (3+ chars and safe), otherwise use userId-based username
            let username;
            if (userData.name && userData.name.trim().length >= 3) {
                // Use name with userId suffix to ensure uniqueness
                const safeName = userData.name.trim().replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
                username = `${safeName}_${userId.slice(0, 8)}`;
            } else {
                // Fallback to userId-based username
                username = `user_${userId.slice(0, 12)}`;
            }

            const updates = {
                id: userId,
                username: username,
                email: userData.email,
                data: userData,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
        } catch (error) {
            console.error('Error syncing user:', error);
        }
    };

    const syncLogToSupabase = async (log, enrichedData = {}) => {
        if (!session?.user?.id) return;
        try {
            const getDeviceType = () => {
                return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'mobile';
            };

            const timeSinceLastPuff = logs.length > 0
                ? new Date(log.timestamp) - new Date(logs[logs.length - 1].timestamp)
                : null;

            const logDate = new Date(log.timestamp);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const today = new Date();
            const todayPuffs = logs.filter(l => {
                const d = new Date(l.timestamp);
                return d.toDateString() === today.toDateString();
            }).length + 1;

            const enrichedLog = {
                user_id: session.user.id,
                timestamp: log.timestamp,
                type: enrichedData.type || 'puff',
                vape_name: user.currentVape?.name || null,
                vape_nicotine: user.currentVape?.nicotine || null,
                juice_level_before: enrichedData.juice_level_before || user.juiceLevel,
                juice_level_after: enrichedData.juice_level_after || user.juiceLevel,
                day_of_week: daysOfWeek[logDate.getDay()],
                hour_of_day: logDate.getHours(),
                time_since_last_puff_ms: timeSinceLastPuff,
                user_xp: user.xp || 0,
                daily_puff_count: todayPuffs,
                streak_days: enrichedData.streak_days || 0,
                user_agent: Platform.OS,
                device_type: getDeviceType(),
                metadata: enrichedData.metadata || {}
            };

            const { error } = await supabase.from('logs').insert([enrichedLog]);
            if (error) throw error;
        } catch (error) {
            console.error('Error syncing log:', error);
        }
    };

    // Persist to AsyncStorage
    useEffect(() => {
        AsyncStorage.setItem('vapetrack_user', JSON.stringify(user));
        if (session) syncUserToSupabase(user);
    }, [user, session]);

    useEffect(() => {
        AsyncStorage.setItem('vapetrack_logs', JSON.stringify(logs));
        checkBadges(logs);
        checkDailyXP(logs);
    }, [logs]);

    useEffect(() => {
        AsyncStorage.setItem('vapetrack_badges', JSON.stringify(badges));
    }, [badges]);

    useEffect(() => {
        AsyncStorage.setItem('vapetrack_juice_purchases', JSON.stringify(juicePurchases));
    }, [juicePurchases]);

    useEffect(() => {
        AsyncStorage.setItem('vapetrack_purchased_rewards', JSON.stringify(purchasedRewards));
    }, [purchasedRewards]);

    useEffect(() => {
        AsyncStorage.setItem('vapetrack_equipped_rewards', JSON.stringify(equippedRewards));
    }, [equippedRewards]);

    useEffect(() => {
        if (lastXPCalculation) {
            AsyncStorage.setItem('vapetrack_last_xp_calc', lastXPCalculation);
        }
    }, [lastXPCalculation]);

    const checkDailyXP = (currentLogs) => {
        const now = new Date();
        const today = now.toDateString();

        // Prevent multiple calculations per day
        if (lastXPCalculation === today) return;

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayLogs = currentLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === yesterday.toDateString();
        });

        // Calculate XP based on yesterday's performance
        const PUFFS_PER_ML = 150;
        const ABSORBED_NICOTINE_PER_CIGARETTE = 2;
        const VAPE_ABSORPTION_RATE = 0.5;
        const vapeNicotine = Number(user?.currentVape?.nicotine) || 20;
        const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
        const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;
        const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);

        // Determine baseline based on user type
        const isFormerSmoker = user?.userType !== 'current_vaper';
        const dailyGoalPuffs = isFormerSmoker
            ? (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE
            : (user?.dailyPuffGoal || 100);

        // If 0 logs, percentage is 0 (Perfect day!)
        const percentage = (yesterdayLogs.length / dailyGoalPuffs) * 100;

        if (percentage < 100) {
            const reduction = 100 - percentage;
            const xpEarned = Math.round(reduction * 10);

            // Only update if we earned XP
            if (xpEarned > 0) {
                setUser(prev => ({ ...prev, xp: (prev.xp || 0) + xpEarned }));
            }
        }

        // Mark today as checked so we don't check again until tomorrow
        setLastXPCalculation(today);
    };

    const onboardUser = (data) => {
        setUser(prev => ({
            ...prev,
            ...data,
            onboardedAt: new Date().toISOString(),
        }));

        // Track onboarding completion
        posthog?.capture(EVENTS.ONBOARDING_COMPLETED, {
            user_type: data.userType,
            cigarettes_per_day: data.cigarettesPerDay,
            daily_puff_goal: data.dailyPuffGoal,
        });
    };

    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const addLog = (count = 1) => {
        const timestamp = new Date().toISOString();
        const newLogs = Array(count).fill(null).map(() => ({ timestamp }));

        const todayPuffs = logs.filter(l => {
            const d = new Date(l.timestamp);
            return d.toDateString() === new Date().toDateString();
        }).length + count;

        setLogs(prev => [...prev, ...newLogs]);

        if (session) {
            // Sync all new logs
            newLogs.forEach(log => syncLogToSupabase(log));
        }

        // Track puff logged (aggregate event)
        posthog?.capture(EVENTS.PUFF_LOGGED, {
            vape_type: user.currentVape?.name,
            vape_nicotine: user.currentVape?.nicotine,
            daily_count: todayPuffs,
            is_smoke_free: user.isSmokeFree,
            user_xp: user.xp,
            total_puffs: logs.length + count,
            batch_size: count
        });

        if (user.isSmokeFree) {
            setUser(prev => ({ ...prev, isSmokeFree: false, smokeFreeStartTime: null }));
        }
    };

    const toggleSmokeFree = () => {
        const newState = !user.isSmokeFree;

        // Track cold turkey toggle
        posthog?.capture(
            newState ? EVENTS.COLD_TURKEY_ACTIVATED : EVENTS.COLD_TURKEY_DEACTIVATED,
            {
                previous_state: user.isSmokeFree,
                user_xp: user.xp,
                total_puffs: logs.length
            }
        );

        setUser(prev => ({
            ...prev,
            isSmokeFree: newState,
            smokeFreeStartTime: newState ? new Date().toISOString() : null
        }));
    };

    const updateJuiceLevel = (newLevel) => {
        const diff = user.juiceLevel - newLevel;
        if (diff > 0) {
            const mlUsed = (diff / 100) * user.bottleSize;
            const puffsToAdd = Math.round(mlUsed * 300);

            const newLogs = Array.from({ length: puffsToAdd }, () => ({
                timestamp: new Date().toISOString()
            }));
            setLogs(prev => [...prev, ...newLogs]);

            if (session) {
                newLogs.forEach(log => syncLogToSupabase(log));
            }

            setUser(prev => ({ ...prev, xp: (prev.xp || 0) + (puffsToAdd * 10) }));
        }

        setUser(prev => ({ ...prev, juiceLevel: newLevel }));
    };

    const addJuicePurchase = () => {
        const newPurchase = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            puffsSinceLast: 0
        };

        if (juicePurchases.length > 0) {
            const lastPurchase = juicePurchases[juicePurchases.length - 1];
            const lastPurchaseDate = new Date(lastPurchase.timestamp);
            const puffsSince = logs.filter(log => new Date(log.timestamp) > lastPurchaseDate).length;
            newPurchase.puffsSinceLast = puffsSince;
        } else {
            newPurchase.puffsSinceLast = logs.length;
        }

        setJuicePurchases(prev => [...prev, newPurchase]);

        if (session) {
            syncLogToSupabase(
                { timestamp: newPurchase.timestamp },
                {
                    type: 'juice_purchase',
                    metadata: {
                        puffs_since_last: newPurchase.puffsSinceLast,
                        bottle_size: user.bottleSize,
                        vape_cost: user.currentVape?.cost
                    }
                }
            );
        }
    };

    const checkBadges = (currentLogs) => {
        const newBadges = [];
        if (currentLogs.length >= 1 && !badges.includes('first_step')) newBadges.push('first_step');
        if (currentLogs.length >= 100 && !badges.includes('century_club')) newBadges.push('century_club');
        if (newBadges.length > 0) {
            setBadges(prev => [...prev, ...newBadges]);
        }
    };

    const purchaseReward = (rewardId, cost) => {
        if (user.xp >= cost && !purchasedRewards.includes(rewardId)) {
            setUser(prev => ({ ...prev, xp: prev.xp - cost }));
            setPurchasedRewards(prev => [...prev, rewardId]);

            // Track reward purchase
            posthog?.capture(EVENTS.REWARD_PURCHASED, {
                reward_id: rewardId,
                cost: cost,
                remaining_xp: user.xp - cost
            });

            return true;
        }
        return false;
    };

    const equipReward = (rewardId, category) => {
        if (purchasedRewards.includes(rewardId)) {
            setEquippedRewards(prev => ({
                ...prev,
                [category]: rewardId
            }));
            return true;
        }
        return false;
    };

    const unequipReward = (category) => {
        setEquippedRewards(prev => ({
            ...prev,
            [category]: null
        }));
    };

    const clearData = async () => {
        if (session) {
            await supabase.auth.signOut();
        }
        await AsyncStorage.multiRemove([
            'vapetrack_user',
            'vapetrack_logs',
            'vapetrack_badges',
            'vapetrack_juice_purchases',
            'vapetrack_purchased_rewards',
            'vapetrack_equipped_rewards',
            'vapetrack_last_xp_calc'
        ]);
        setUser(DEFAULT_USER);
        setLogs([]);
        setBadges([]);
        setJuicePurchases([]);
        setPurchasedRewards([]);
        setEquippedRewards({ icon: null, border: null, effect: null });
        setLastXPCalculation(null);
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Track login
        if (data.user) {
            posthog?.capture(EVENTS.USER_LOGGED_IN, {
                email: email,
                user_id: data.user.id
            });

            // Identify user in PostHog
            posthog?.identify(data.user.id, {
                email: email,
                login_date: new Date().toISOString()
            });
        }

        return data;
    };

    const signUp = async (email, password, username) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: username
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // Update local state with the new user info
                const updatedUserData = {
                    ...user,
                    name: username,
                    email: email
                };

                setUser(prev => ({
                    ...prev,
                    name: username,
                    email: email
                }));

                // Track signup
                posthog?.capture(EVENTS.USER_SIGNED_UP, {
                    username: username,
                    email: email,
                    signup_date: new Date().toISOString()
                });

                // Identify user in PostHog
                posthog?.identify(data.user.id, {
                    email: email,
                    name: username,
                    signup_date: new Date().toISOString()
                });

                // Create profile in database (only once)
                await syncUserToSupabase(updatedUserData, data.user.id);
            }

            return data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            // Track logout
            posthog?.capture(EVENTS.USER_LOGGED_OUT);

            // Reset PostHog user
            posthog?.reset();

            // Attempt to sign out from Supabase
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out from Supabase:', error);
        } finally {
            // ALWAYS clear local data and reset state, even if network fails
            try {
                await AsyncStorage.multiRemove([
                    'vapetrack_user',
                    'vapetrack_logs',
                    'vapetrack_badges',
                    'vapetrack_juice_purchases',
                    'vapetrack_purchased_rewards',
                    'vapetrack_equipped_rewards',
                    'vapetrack_last_xp_calc'
                ]);
            } catch (storageError) {
                console.error('Error clearing storage:', storageError);
            }

            // Reset state to default
            setSession(null);
            setUser(DEFAULT_USER);
            setLogs([]);
            setBadges([]);
            setJuicePurchases([]);
            setPurchasedRewards([]);
            setEquippedRewards({ icon: null, border: null, effect: null });
            setLastXPCalculation(null);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            logs,
            badges,
            xp,
            juicePurchases,
            purchasedRewards,
            equippedRewards,
            session,
            loading,
            signIn,
            signUp,
            signOut,
            onboardUser,
            updateUser,
            addLog,
            updateJuiceLevel,
            addJuicePurchase,
            purchaseReward,
            equipReward,
            unequipReward,
            toggleSmokeFree,
            clearData
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
