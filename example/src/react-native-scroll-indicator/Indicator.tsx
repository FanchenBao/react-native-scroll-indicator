/* eslint-disable react-native/no-inline-styles */
/**
 * @format
 */
import * as React from 'react';
import {Animated, ViewStyle} from 'react-native';

type PropsT = {
  // distance traveled by the top or left of the indicator relative to the top
  // or left of the visible view
  d: Animated.Value;
  // the amount of scaling on the indicator when the scroll hits the edge
  sc: Animated.Value;
  horizontal: boolean; // whether the indicator is for horizontal or vertical
  indSize: number; // length of the indicator
  // the total amount of distance to travel for the indicator if we start at
  // the beginning and scroll to the end, without moving beyond the edges on
  // both direction
  diff: number;
  inverted: boolean; // FlatList only, whether FlatList is inverted
  // styling of the indicator regarding its location
  locStyle: ViewStyle;
  // styling of the indicator itself, e.g. girth, color, etc.
  indStyle: ViewStyle;
};

export const Indicator = (props: PropsT) => {
  const {d, sc, horizontal, indSize, diff, inverted, locStyle, indStyle} =
    props;

  // interpolate the distance need to travel by the indicator to translateX or
  // translateY. Note that the max travel distance is diff
  const move = d.interpolate({
    inputRange: [0, diff],
    outputRange: inverted ? [diff, 0] : [0, diff],
    extrapolate: 'extend',
  });
  // interpolate the scale need to shrink by the indicator to scaleX or scaleY.
  // Note that the range of shrink scale is from 0 (completely shrunk,
  // invisible) to 1 (no shrink)
  const shrink = sc.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        ...indStyle,
        ...locStyle,
        position: 'absolute',
        height: horizontal ? indStyle.width : indSize,
        width: horizontal ? indSize : indStyle.width,
        transform: horizontal
          ? [{translateX: move}, {scaleX: shrink}]
          : [{translateY: move}, {scaleY: shrink}],
      }}
    />
  );
};
