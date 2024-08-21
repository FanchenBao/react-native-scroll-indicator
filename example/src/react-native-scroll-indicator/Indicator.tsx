/* eslint-disable react-native/no-inline-styles */
/**
 * @format
 */
import * as React from 'react';
import {
  Animated,
  ViewStyle,
  PanResponder,
  FlatList,
  ScrollView,
} from 'react-native';

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

  // The refs for scrollable component. We use these refs to manually scroll
  // the scrollable component when the indicator is dragged
  scrollRefs: {
    FlatList: React.RefObject<FlatList>;
    ScrollView: React.RefObject<ScrollView>;
  };

  contentSize: number; // size of the actual content

  visibleSize: number; // size of the visible portion of the content

  // Coordinate of the view that contains the content and the indicator
  parentPos: {
    pageX: number;
    pageY: number;
    ready: boolean;
  };

  // styling of the indicator regarding its location
  locStyle: ViewStyle;

  // styling of the indicator itself, e.g. girth, color, etc.
  indStyle: ViewStyle;
};

export const Indicator = (props: PropsT) => {
  const {
    d,
    sc,
    horizontal,
    indSize,
    diff,
    inverted,
    scrollRefs,
    contentSize,
    visibleSize,
    parentPos,
    locStyle,
    indStyle,
  } = props;

  // The indicator offset (the distance between the top or left of the
  // indicator to the top or left of the content boundary) the moment when it
  // starts to be dragged. We need this offset to properly compute the
  // indicator offset when it is being dragged.
  const indOffsetOnMove = React.useRef(0);

  // Use ref to make values of the props or any value that might be changed
  // upon refresh available inside animated value callbacks. The values in
  // animated callbacks do not update upon any state update.
  const refs = {
    horizontal: React.useRef(false),
    inverted: React.useRef(false),
    actualIndSize: React.useRef(0),
    diff: React.useRef(0),
    contentSize: React.useRef(0),
    visibleSize: React.useRef(0),
  };
  refs.horizontal.current = horizontal;
  refs.inverted.current = inverted;
  refs.diff.current = diff;
  refs.contentSize.current = contentSize;
  refs.visibleSize.current = visibleSize;

  const pan = React.useRef(new Animated.ValueXY()).current;
  pan.addListener(({ x, y }) => {
    // x and y is the delta x and delta y when the indicator is being dragged.
    // Thus the total amount of indicator offset is the initial offset plus the
    // delta value.
    // Note that we clamp on how much indicator can be dragged. It cannot
    // be dragged beyond the scrollable component
    // Also note that when Flatlist is inverted, so is the delta value, because
    // we want to keep indicatorOffset always positive. It always increases
    // as the top or left (bottom or right) of the indicator moves away from
    // the top or left (bottom or right) of the parent bound.
    const indicatorOffset = Math.min(
      Math.max(
        (refs.horizontal.current
          ? refs.inverted.current
            ? -x
            : x
          : refs.inverted.current
            ? -y
            : y) + indOffsetOnMove.current,
        0,
      ),
      refs.diff.current,
    );
    d.setValue(indicatorOffset);

    // Compute the content offset to manually scroll the scrollable component
    // Note that animated is set to false because the pan itself is an
    // animated value. As y is being changed, there is no need to add further
    // animation. The animation is needed when we supply the end offset to
    // the scrollable component. In the current case, we are not assigning
    // the end offset. Rather, we are assigning the current offset.
    const contentOffset =
      (indicatorOffset * refs.contentSize.current) / refs.visibleSize.current;
    if (scrollRefs.FlatList.current) {
      scrollRefs.FlatList.current.scrollToOffset({
        offset: contentOffset,
        animated: false,
      });
    } else if (scrollRefs.ScrollView.current) {
      scrollRefs.ScrollView.current.scrollTo(
        refs.horizontal.current
          ? {
            x: contentOffset,
            animated: false,
          }
          : {
            y: contentOffset,
            animated: false,
          },
      );
    }
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        // top or left of indicator to the top or left of parent boundary
        const indStartToParentStart = refs.horizontal.current
          ? evt.nativeEvent.pageX - evt.nativeEvent.locationX - parentPos.pageX
          : evt.nativeEvent.pageY - evt.nativeEvent.locationY - parentPos.pageY;
        // If inverted, we need to compute the bottom or right of indicator
        // to the bottom or right of parent boundary
        indOffsetOnMove.current = refs.inverted.current
          ? refs.visibleSize.current -
          indStartToParentStart -
          refs.actualIndSize.current
          : indStartToParentStart;
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y, dx: pan.x }], {
        useNativeDriver: false,
      }),
    }),
  ).current;

  // Use the indicator offset to interpolate the actual travel on x or y
  // coordinate
  // Note that the max travel distance is diff
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
          ? [{ translateX: move }, { scaleX: shrink }]
          : [{ translateY: move }, { scaleY: shrink }],
      }}
      onLayout={e => {
        // The actual size of the indicator is different from the given indSize
        // due to size changes in the parent components
        refs.actualIndSize.current = horizontal
          ? e.nativeEvent.layout.width
          : e.nativeEvent.layout.height;
      }}
      {...panResponder.panHandlers}
    />
  );
};
