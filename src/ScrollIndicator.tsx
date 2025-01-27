/**
 * @format
 */
import * as React from 'react';
import {
  Animated,
  FlatList,
  ViewStyle,
  FlatListProps,
  ScrollView,
  ScrollViewProps,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Indicator } from './Indicator';
import { getLocStyle } from './functions';

type PropsT = {
  target: 'ScrollView' | 'FlatList';
  targetProps: ScrollViewProps | (ScrollViewProps & FlatListProps<any>);
  position: string | number; // position of the indicator
  horizontal: boolean; // whether the scrolling direction is horizontal
  persistentScrollbar: boolean; // whether to persist scroll indicator
  indStyle: ViewStyle; // style of the scroll indicator
  containerStyle: ViewStyle; // style of the parent container that holds both the indicator and the scrollable component
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
    containerStyle,
  } = props;

  // total size of the content if rendered
  const [contentSize, setContentSize] = React.useState(1);
  // size of the visible part of the content, i.e., size of the scroll view
  // itself.
  const [visibleSize, setVisibleSize] = React.useState(0);
  // the size orthogonal to visibleSize, for use in computing the position of
  // the indicator
  const [orthSize, setOrthSize] = React.useState(0);

  // scroll container refs. Use this to manually scroll the scrollable
  // component when dragging the indicator
  const scrollRefs = {
    FlatList: React.useRef<FlatList>(null),
    ScrollView: React.useRef<ScrollView>(null),
  };

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

  // Remove parentRef since we're not using View wrapper anymore
  const [parentPos, setParentPos] = React.useState({
    pageX: 0,
    pageY: 0,
    ready: false,
  });

  /****************************************************
   * Callbacks shared by both Flatlist and Scrollview
   ****************************************************/
  const configContentSize = (w: number, h: number) => {
    // total size of the content
    setContentSize(horizontal ? w : h);
  };

  const configVisibleSize = (e: LayoutChangeEvent) => {
    // layout of the visible part of the scroll view
    setVisibleSize(
      horizontal ? e.nativeEvent.layout.width : e.nativeEvent.layout.height,
    );
    setOrthSize(
      horizontal ? e.nativeEvent.layout.height : e.nativeEvent.layout.width,
    );
  };

  const configOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    /**
     * obtain contentOffset, which is the distance from the top or left
     * of the content to the top or left of the scroll view.
     * contentOffset gets bigger if user scrolls up or left (i.e.
     * content goes up or left),
     * otherwise smaller. It is possible for contentOffset to be
     * negative, if user scrolls down or right until there is empty
     * space above or to the left of the content.
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
  };

  return (
    <>
      {target === 'FlatList' ? (
        <FlatList
          {...(targetProps as ScrollViewProps & FlatListProps<any>)}
          ref={scrollRefs.FlatList}
          horizontal={horizontal}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={configContentSize}
          style={containerStyle}
          onLayout={(e: LayoutChangeEvent) => {
            configVisibleSize(e);
            const { x, y } = e.nativeEvent.layout;
            setParentPos({
              pageX: x,
              pageY: y,
              ready: true,
            });
            if ('onLayout' in targetProps && typeof targetProps.onLayout === 'function') {
              targetProps.onLayout(e);
            }
          }}
          scrollEventThrottle={16}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            configOnScroll(e);
            if ('onScroll' in targetProps && typeof targetProps.onScroll === 'function') {
              targetProps.onScroll(e);
            }
          }}
        />
      ) : (
        <ScrollView
          {...(targetProps as ScrollViewProps)}
          ref={scrollRefs.ScrollView}
          horizontal={horizontal}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={configContentSize}
          style={containerStyle}
          onLayout={(e: LayoutChangeEvent) => {
            configVisibleSize(e);
            const { x, y } = e.nativeEvent.layout;
            setParentPos({
              pageX: x,
              pageY: y,
              ready: true,
            });
            if ('onLayout' in targetProps && typeof targetProps.onLayout === 'function') {
              targetProps.onLayout(e);
            }
          }}
          scrollEventThrottle={16}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            configOnScroll(e);
            if ('onScroll' in targetProps && typeof targetProps.onScroll === 'function') {
              targetProps.onScroll(e);
            }
          }}>
          {props.children}
        </ScrollView>
      )}
      {(persistentScrollbar || indSize < visibleSize) && parentPos.ready && (
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
          scrollRefs={scrollRefs}
          contentSize={contentSize}
          visibleSize={visibleSize}
          parentPos={parentPos}
          locStyle={getLocStyle(
            horizontal,
            position,
            orthSize,
            indStyle.width as number,
          )}
          indStyle={indStyle}
        />
      )}
    </>
  );
};
