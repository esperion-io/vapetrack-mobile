import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../utils/constants';

const CustomBarChart = ({ data, oldHabitLine, width, height }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value), oldHabitLine);
    const barWidth = (width - SPACING.lg * 2) / data.length;
    const chartHeight = height - 60; // Leave space for labels and tooltip

    return (
        <View style={styles.chartContainer}>
            {/* Tooltip */}
            {hoveredIndex !== null && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>
                        {data[hoveredIndex].puffs} puffs
                    </Text>
                    <Text style={styles.tooltipSubtext}>
                        {data[hoveredIndex].percentage}% of old habit
                    </Text>
                </View>
            )}

            {/* Chart Area */}
            <View style={[styles.chartArea, { height: chartHeight }]}>
                {/* Reference Line (Old Habit) */}
                <View
                    style={[
                        styles.referenceLine,
                        {
                            bottom: (oldHabitLine / maxValue) * chartHeight,
                            width: width - SPACING.lg * 2,
                        },
                    ]}
                >
                    <View style={styles.dashedLine} />
                </View>

                {/* Bars */}
                <View style={styles.barsContainer}>
                    {data.map((item, index) => {
                        const barHeight = (item.value / maxValue) * chartHeight;
                        const isAboveLimit = item.value > oldHabitLine;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.barWrapper, { width: barWidth }]}
                                onPressIn={() => setHoveredIndex(index)}
                                onPressOut={() => setHoveredIndex(null)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: Math.max(barHeight, 4), // Minimum height for visibility
                                            backgroundColor: isAboveLimit ? COLORS.danger : COLORS.success,
                                        },
                                    ]}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* X-Axis Labels */}
            <View style={styles.labelsContainer}>
                {data.map((item, index) => (
                    <View key={index} style={[styles.labelWrapper, { width: barWidth }]}>
                        <Text style={styles.label}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        width: '100%',
    },
    tooltip: {
        backgroundColor: COLORS.bgTertiary,
        borderRadius: RADIUS.sm,
        padding: SPACING.sm,
        marginBottom: SPACING.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    tooltipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    tooltipSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    chartArea: {
        position: 'relative',
        width: '100%',
    },
    referenceLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        zIndex: 1,
    },
    dashedLine: {
        height: 1,
        backgroundColor: COLORS.danger,
        opacity: 0.6,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: '100%',
        paddingHorizontal: SPACING.sm,
    },
    barWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
        paddingHorizontal: 4,
    },
    bar: {
        width: '100%',
        borderRadius: RADIUS.xs || 4,
        minHeight: 4,
    },
    labelsContainer: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
        paddingHorizontal: SPACING.sm,
    },
    labelWrapper: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '400',
    },
});

export default CustomBarChart;
