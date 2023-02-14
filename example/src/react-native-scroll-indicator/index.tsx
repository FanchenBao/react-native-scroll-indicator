/**
 * @format
 */
import * as React from 'react';
import {ScrollIndicator} from './ScrollIndicator';

import type {FlatListProps, ScrollViewProps, ViewStyle} from 'react-native';

type ScrollViewPropsT = {
  position?: string | number;
  horizontal?: boolean;
  persistenScrollbar?: boolean;
  indStyle?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  children?: React.ReactNode | React.ReactNode[];
};

export const ScrollViewIndicator = (props: ScrollViewPropsT) => {
  const {
    position = 'right',
    horizontal = false,
    persistenScrollbar = false,
    indStyle = {
      backgroundColor: 'grey',
      width: 5,
      borderRadius: 3,
    },
    scrollViewProps = {},
  } = props;

  return (
    <ScrollIndicator
      target="ScrollView"
      targetProps={scrollViewProps}
      horizontal={horizontal}
      position={position}
      persistenScrollbar={persistenScrollbar}
      indStyle={indStyle}>
      {props.children}
    </ScrollIndicator>
  );
};

type FlatListPropsT = {
  flatListProps: ScrollViewProps & FlatListProps<any>;
  position?: string | number;
  horizontal?: boolean;
  persistenScrollbar?: boolean;
  indStyle?: ViewStyle;
};

export const FlatListIndicator = (props: FlatListPropsT) => {
  const {
    flatListProps,
    position = 'right',
    horizontal = false,
    persistenScrollbar = false,
    indStyle = {
      backgroundColor: 'grey',
      width: 5,
      borderRadius: 3,
    },
  } = props;

  return (
    <ScrollIndicator
      target="FlatList"
      targetProps={flatListProps}
      horizontal={horizontal}
      position={position}
      persistenScrollbar={persistenScrollbar}
      indStyle={indStyle}
    />
  );
};
