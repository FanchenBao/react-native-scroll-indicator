/* eslint-disable react-native/no-inline-styles */
/**
 * @format
 */
import * as React from 'react';
import { ScrollIndicator } from './ScrollIndicator';

import type { FlatListProps, ScrollViewProps, ViewStyle, ScrollView, FlatList } from 'react-native';
import type { FlashList } from '@shopify/flash-list';
import { getDefaultPosition } from './functions';

type ScrollViewPropsT = {
  position?: string | number;
  horizontal?: boolean;
  persistentScrollbar?: boolean;
  indStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  children?: React.ReactNode | React.ReactNode[];
  scrollViewRef?: React.RefObject<ScrollView>;
};

export const ScrollViewIndicator = (props: ScrollViewPropsT) => {
  const {
    position = '',
    horizontal = false,
    persistentScrollbar = false,
    indStyle: { width = 5, ...indStyle } = {},
    containerStyle = {},
    scrollViewProps = {},
    scrollViewRef,
  } = props;

  return (
    <ScrollIndicator
      target="ScrollView"
      targetProps={scrollViewProps}
      horizontal={horizontal}
      position={getDefaultPosition(horizontal, position)}
      persistentScrollbar={persistentScrollbar}
      indStyle={{
        backgroundColor: 'grey',
        width,
        borderRadius: (width as number) / 2,
        ...indStyle,
      }}
      containerStyle={containerStyle}
      scrollViewRef={scrollViewRef}>
      {props.children}
    </ScrollIndicator>
  );
};

type FlatListPropsT = {
  flatListProps: ScrollViewProps & FlatListProps<any>;
  position?: string | number;
  horizontal?: boolean;
  persistentScrollbar?: boolean;
  indStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  flatListRef?: React.RefObject<FlatList>;
};

export const FlatListIndicator = (props: FlatListPropsT) => {
  const {
    flatListProps,
    position = '',
    horizontal = false,
    persistentScrollbar = false,
    indStyle: { width = 5, ...indStyle } = {},
    containerStyle = {},
    flatListRef,
  } = props;

  return (
    <ScrollIndicator
      target="FlatList"
      targetProps={flatListProps}
      horizontal={horizontal}
      position={getDefaultPosition(horizontal, position)}
      persistentScrollbar={persistentScrollbar}
      indStyle={{
        backgroundColor: 'grey',
        width,
        borderRadius: (width as number) / 2,
        ...indStyle,
      }}
      containerStyle={containerStyle}
      flatListRef={flatListRef}
    />
  );
};

type FlashListPropsT<T> = {
  flashListProps: Omit<ScrollViewProps, 'scrollEventThrottle'> & {
    data: Array<T>;
    renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
    estimatedItemSize: number;
    keyExtractor?: (item: T, index: number) => string;
  };
  position?: string | number;
  horizontal?: boolean;
  persistentScrollbar?: boolean;
  indStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  flashListRef?: React.RefObject<FlashList<T>>;
};

export const FlashListIndicator = <T extends any>(props: FlashListPropsT<T>) => {
  const {
    flashListProps,
    position = '',
    horizontal = false,
    persistentScrollbar = false,
    indStyle: { width = 5, ...indStyle } = {},
    containerStyle = {},
    flashListRef,
  } = props;

  return (
    <ScrollIndicator
      target="FlashList"
      targetProps={flashListProps}
      horizontal={horizontal}
      position={getDefaultPosition(horizontal, position)}
      persistentScrollbar={persistentScrollbar}
      indStyle={{
        backgroundColor: 'grey',
        width,
        borderRadius: (width as number) / 2,
        ...indStyle,
      }}
      containerStyle={containerStyle}
      flashListRef={flashListRef}
    />
  );
};
