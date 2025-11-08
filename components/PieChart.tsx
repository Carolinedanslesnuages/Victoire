import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { CategorySpending } from '../utils/analytics';

interface PieChartProps {
  data: CategorySpending[];
  size?: number;
}

/**
 * Simple pie chart component to visualize category spending
 */
export default function PieChart({ data, size = 200 }: PieChartProps) {
  if (data.length === 0) {
    return null;
  }

  const radius = size / 2;
  const center = size / 2;
  
  /**
   * Convert polar coordinates to cartesian
   */
  const polarToCartesian = (angle: number): { x: number; y: number } => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  /**
   * Create SVG path for a pie slice
   */
  const createPieSlicePath = (startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  // Calculate slice angles
  let currentAngle = 0;
  const slices = data.map(item => {
    const sliceAngle = (item.percentage / 100) * 360;
    const slice = {
      path: createPieSlicePath(currentAngle, currentAngle + sliceAngle),
      color: item.color,
    };
    currentAngle += sliceAngle;
    return slice;
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((slice, index) => (
            <Path
              key={index}
              d={slice.path}
              fill={slice.color}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
