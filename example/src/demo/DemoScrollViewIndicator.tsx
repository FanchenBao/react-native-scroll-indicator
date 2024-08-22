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
import { ScrollViewIndicator } from '../react-native-scroll-indicator';
// import { ScrollViewIndicator } from '@fanchenbao/react-native-scroll-indicator';

type PropsT = {
  hori: boolean;
  posi: string | number;
  indStyle: ViewStyle;
  containerStyle: ViewStyle;
  text: string;
};

export const DemoScrollViewIndicator = (props: PropsT) => {
  const { hori, posi, indStyle, containerStyle, text } = props;

  return (
    <ScrollViewIndicator
      horizontal={hori}
      position={posi}
      indStyle={indStyle}
      containerStyle={containerStyle}
      scrollViewProps={{
        onLayout: e =>
          console.log(
            `scrollViewProps onLayout: ${JSON.stringify(e.nativeEvent.layout)}`,
          ),
        onScroll: e =>
          console.log(
            `scrollViewProps onScroll: ${JSON.stringify(
              e.nativeEvent.contentOffset,
            )}`,
          ),
      }}>
      <View style={{ padding: 10 }}>
        <Text>{text}</Text>
      </View>
    </ScrollViewIndicator>
  );
};
