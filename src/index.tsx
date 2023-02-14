/* eslint-disable react-native/no-inline-styles */
/**
 * @format
 */
import * as React from 'react';
import {ScrollIndicator} from './ScrollIndicator';

import type {FlatListProps, ScrollViewProps, ViewStyle} from 'react-native';
import {getDefaultPosition} from './functions';

type ScrollViewPropsT = {
  position?: string | number;
  horizontal?: boolean;
  persistentScrollbar?: boolean;
  indStyle?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  children?: React.ReactNode | React.ReactNode[];
};

export const ScrollViewIndicator = (props: ScrollViewPropsT) => {
  const {
    position = '',
    horizontal = false,
    persistentScrollbar = false,
    indStyle = {},
    scrollViewProps = {},
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
        width: 5,
        borderRadius: 3,
        ...indStyle,
      }}>
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
};

export const FlatListIndicator = (props: FlatListPropsT) => {
  const {
    flatListProps,
    position = '',
    horizontal = false,
    persistentScrollbar = false,
    indStyle = {},
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
        width: 5,
        borderRadius: 3,
        ...indStyle,
      }}
    />
  );
};
