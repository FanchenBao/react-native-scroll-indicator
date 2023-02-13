/* eslint-disable react-native/no-inline-styles */
/**
 * @format
 */
import * as React from 'react';
import {
  Animated,
  FlatList,
  ViewStyle,
  FlatListProps,
  ScrollViewProps,
} from 'react-native';

type PropsT = {
  flatlistProps: ScrollViewProps & FlatListProps<any>;
  position?: string | number;
  horizontal?: boolean;
  persistenScrollbar?: boolean;
  indStyle?: ViewStyle;
  children?: React.ReactNode | React.ReactNode[];
};

/**
 * Compute the position of the indicator given the size of the container it is
 * located, its girth, and the desired position. The goal is to place the
 * center line of the indicator (vertical if the indicator moves in vertical
 * direction, horizontal otherwise) at the desired position. If, by doing so,
 * part of the indicator will be overflowing the container, clamp it such that
 * the indicator is flush with the edge of the container.
 * @param containerSize size of the container orthogonal to the direction of
 * the indicator, i.e., if indicator is vertical, the size will be the width
 * of the container, otherwise height.
 * @param indGirth the width or height of the indicator if it is vertical or
 * horizontal, respectively.
 * @param position desired position of the indicator, as a percentage of the
 * container. e.g. 20 means we want to place a vertical indicator's center line
 * at 20% of the container's width.
 * @returns the absolute position of the indicator as used in the style for
 * top (indicator is horizontal) or left (indicator is vertical)
 */
const getIndPosition = (
  containerSize: number,
  indGirth: number,
  position: number,
) =>
  Math.max(
    0,
    Math.min(
      (position / 100) * containerSize - (indGirth as number) / 2,
      containerSize - (indGirth as number),
    ),
  );

export const FlatListIndicator = (props: PropsT) => {
  const {
    flatlistProps,
    position = 'right',
    horizontal = false,
    persistenScrollbar = false,
    indStyle = {
      backgroundColor: 'grey',
      width: 5,
      borderRadius: 3,
    },
  } = props;

  // total size of the content if rendered
  const [contentSize, setContentSize] = React.useState(1);
  // size of the visible part of the content, i.e., size of the scroll view
  // itself.
  const [visibleSize, setVisibleSize] = React.useState(0);
  // the size orthogonal to visibleSize, for use in computing the position of
  // the indicator
  const [orthSize, setOrthSize] = React.useState(0);

  // height or width of the indicator, if it is vertical or horizontal,
  // respectively. If there is more content than visible on the view, the
  // proportion of indSize to visibleSize is the same as the visibleSize to
  // contentSize. Otherwise, set the indSize the same as visibleSize.
  const indSize =
    contentSize > visibleSize
      ? (visibleSize * visibleSize) / contentSize
      : visibleSize;
  // the amount of distance the indicator needs to travel during scrolling
  // without any shrinking
  const diff = visibleSize > indSize ? visibleSize - indSize : 1;

  // distance that the top or left of the indicator needs to travel in
  // accordance with scrolling
  const d = React.useRef(new Animated.Value(0)).current;
  // the scale that the indicator needs to shrink if scrolling beyond the end
  const sc = React.useRef(new Animated.Value(1)).current;

  // interpolate the distance need to travel by the indicator to translateX or
  // translateY. Note that the max travel distance is diff
  const move = d.interpolate({
    inputRange: [0, diff],
    outputRange: [0, diff],
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

  let locStyle;
  if (horizontal) {
    if (typeof position === 'string' && ['top', 'bottom'].includes(position)) {
      locStyle = {[position]: 0};
    } else if (typeof position === 'number') {
      locStyle = {
        top: getIndPosition(orthSize, indStyle.width as number, position),
      };
    } else {
      throw Error(
        '"position" must be one of "top", "buttom", or a floating number when the scroll view is horizontal',
      );
    }
  } else {
    if (typeof position === 'string' && ['left', 'right'].includes(position)) {
      locStyle = {[position]: 0};
    } else if (typeof position === 'number') {
      locStyle = {
        left: getIndPosition(orthSize, indStyle.width as number, position),
      };
    } else {
      throw Error(
        '"position" must be one of "left", "right", or a floating number when the scroll view is vertical',
      );
    }
  }

  return (
    <>
      {(persistenScrollbar || indSize < visibleSize) && (
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
      )}
      <FlatList
        {...flatlistProps}
        horizontal={horizontal}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w, h) => {
          // total size of the content
          setContentSize(horizontal ? w : h);
        }}
        onLayout={e => {
          // layout of the visible part of the scroll view
          setVisibleSize(
            horizontal
              ? e.nativeEvent.layout.width
              : e.nativeEvent.layout.height,
          );
          setOrthSize(
            horizontal
              ? e.nativeEvent.layout.height
              : e.nativeEvent.layout.width,
          );
        }}
        scrollEventThrottle={16}
        onScroll={e => {
          // obtain contentOffset, which is the distance from the top or left
          // of the content to the top or left of the scroll view.
          // contentOffset gets bigger if user scrolls down or right, otherwise
          // smaller. It is possible for contentOffset to be negative, if user
          // scrolls up or left beyond the edge.
          //
          // indicatorOffset is computed similarly to indSize, in which the
          // proportion of the amount of distance to travel by the indicator to
          // the container size is the same as the proportion of the container
          // size to total size.
          const indicatorOffset =
            ((horizontal
              ? e.nativeEvent.contentOffset.x
              : e.nativeEvent.contentOffset.y) *
              visibleSize) /
            contentSize;
          d.setValue(indicatorOffset);
          /**
           * What we desire is that when the indicator touches the edge, it
           * shrinks in size while maintaining the contact to the edge if user
           * scrolls in the same direction further.
           * If we don't move the indicator, after shrinking, there will be a
           * gap of size
           *
           * (indSize - indSize * sc) / 2
           *
           * between the end of the indicator and the edge of the container.
           * To make the end of the indicator maintain contact to the edge, the
           * indicator must move in the same rate as the gap appears.
           *
           * If we scroll down or right, we have the following relationship
           *
           * indicatorOffset = diff + (indSize - indSize * sc) / 2
           *
           * If we scroll up or left, we have a slightly different relationship
           *
           * indicatorOffset = (indSize - indSize * sc) / 2
           *
           * From these two relationship, we can compute sc based on
           * indicatorOffset.
           */
          sc.setValue(
            indicatorOffset >= 0
              ? (indSize + 2 * diff - 2 * indicatorOffset) / indSize
              : (indSize + 2 * indicatorOffset) / indSize,
          );
        }}
      />
    </>
  );
};
