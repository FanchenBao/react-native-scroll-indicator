/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import * as React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { FlatListIndicator } from '../react-native-scroll-indicator';
// import { FlatListIndicator } from '@fanchenbao/react-native-scroll-indicator';

type PropsT = {
  hori: boolean;
  posi: string | number;
  inverted: boolean;
  indStyle: ViewStyle;
  containerStyle: ViewStyle;
  data: Array<string>;
};

export const DemoFlatListIndicator = (props: PropsT) => {
  const { hori, posi, inverted, indStyle, containerStyle, data } = props;

  return (
    <FlatListIndicator
      flatListProps={{
        ItemSeparatorComponent: () => (
          <View
            style={{
              height: hori ? '100%' : 2,
              width: hori ? 2 : '100%',
              backgroundColor: 'blue',
            }}
          />
        ),
        data: data,
        renderItem: ({ item }) => (
          <View style={{ margin: 10 }}>
            <Text>{item}</Text>
          </View>
        ),
        inverted: inverted,
      }}
      horizontal={hori}
      position={posi}
      indStyle={indStyle}
      containerStyle={containerStyle}
    />
  );
};
