/**
 * @format
 */
import * as React from 'react';
import {
  Animated,
  ScrollView,
  FlatList,
  ViewStyle,
  FlatListProps,
  ScrollViewProps,
} from 'react-native';
import {Indicator} from './Indicator';
import {getLocStyle} from './functions';

type PropsT = {
  target: 'ScrollView' | 'FlatList';
  targetProps: ScrollViewProps | (ScrollViewProps & FlatListProps<any>);
  position: string | number; // position of the indicator
  horizontal: boolean; // whether the scrolling direction is horizontal
  persistentScrollbar: boolean; // whether to persist scroll indicator
  indStyle: ViewStyle; // style of the scroll indicator
  children?: React.ReactNode | React.ReactNode[]; // used for ScrollView only
};

export const ScrollIndicator = (props: PropsT) => {
  const {
    target,
    targetProps,
    position,
    horizontal,
    persistentScrollbar,
    indStyle,
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

  return (
    <>
      {(persistentScrollbar || indSize < visibleSize) && (
        <Indicator
          d={d}
          sc={sc}
          horizontal={horizontal}
          indSize={indSize}
          diff={diff}
          inverted={
            'inverted' in targetProps
              ? typeof targetProps.inverted === 'boolean'
                ? targetProps.inverted
                : false
              : false
          }
          locStyle={getLocStyle(
            horizontal,
            position,
            orthSize,
            indStyle.width as number,
          )}
          indStyle={indStyle}
        />
      )}
      {target === 'FlatList' ? (
        <FlatList
          {...(targetProps as ScrollViewProps & FlatListProps<any>)}
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
            /**
             * obtain contentOffset, which is the distance from the top or left
             * of the content to the top or left of the scroll view.
             * contentOffset gets bigger if user scrolls down or right,
             * otherwise smaller. It is possible for contentOffset to be
             * negative, if user scrolls up or left beyond the edge.
             * indicatorOffset is computed similarly to indSize, in which the
             * proportion of the amount of distance to travel by the indicator
             * to the container size is the same as the proportion of the
             * container size to total size.
             */
            const indicatorOffset =
              ((horizontal
                ? e.nativeEvent.contentOffset.x
                : e.nativeEvent.contentOffset.y) *
                visibleSize) /
              contentSize;
            d.setValue(indicatorOffset);
            /**
             * What we desire is that when the indicator touches the edge, it
             * shrinks in size while maintaining the contact to the edge if
             * user scrolls in the same direction further.
             * If we don't move the indicator, after shrinking, there will be a
             * gap of size
             *
             * (indSize - indSize * sc) / 2
             *
             * between the end of the indicator and the edge of the container.
             * To make the end of the indicator maintain contact to the edge,
             * the indicator must move in the same rate as the gap appears.
             *
             * If we scroll down or right, we have the following relationship
             *
             * indicatorOffset = diff + (indSize - indSize * sc) / 2
             *
             * If we scroll up or left, we have a slightly different
             * relationship
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
      ) : (
        // The logic for ScrollView is exactly the same as FlatList
        <ScrollView
          {...(targetProps as ScrollViewProps)}
          horizontal={horizontal}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={(w, h) => {
            setContentSize(horizontal ? w : h);
          }}
          onLayout={e => {
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
            const indicatorOffset =
              ((horizontal
                ? e.nativeEvent.contentOffset.x
                : e.nativeEvent.contentOffset.y) *
                visibleSize) /
              contentSize;
            d.setValue(indicatorOffset);
            sc.setValue(
              indicatorOffset >= 0
                ? (indSize + 2 * diff - 2 * indicatorOffset) / indSize
                : (indSize + 2 * indicatorOffset) / indSize,
            );
          }}>
          {props.children}
        </ScrollView>
      )}
    </>
  );
};
