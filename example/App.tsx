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
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollViewIndicator} from './src/react-native-scroll-indicator';
import lorem from './src/lorem.json';

const App = () => {
  const [hori, setHori] = React.useState(false);
  const [posi, setPosi] = React.useState<string | number>('right');
  const [indCrazy, setIndCrazy] = React.useState(false);

  const isHoriPosiGood = React.useCallback(
    () =>
      !(hori && typeof posi === 'string' && !['top', 'bottom'].includes(posi)),
    [hori, posi],
  );
  const isVertPosiGood = React.useCallback(
    () =>
      !(!hori && typeof posi === 'string' && !['left', 'right'].includes(posi)),
    [hori, posi],
  );

  React.useEffect(() => {
    if (!isHoriPosiGood()) {
      setPosi('bottom');
    } else if (!isVertPosiGood()) {
      setPosi('right');
    }
  }, [setPosi, isHoriPosiGood, isVertPosiGood]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSubContainer}>
          <TouchableOpacity
            style={[
              styles.majorButton,
              {backgroundColor: hori ? 'white' : 'lightblue'},
            ]}
            onPress={() => setHori(false)}>
            <Text>Vertical</Text>
          </TouchableOpacity>
          <View style={styles.minorButtonContainer}>
            {['left', 'right', 20, 50, 80].map(v => (
              <TouchableOpacity
                style={[
                  styles.minorButton,
                  {
                    backgroundColor:
                      !hori && posi === v ? 'lightblue' : 'white',
                    borderColor: hori ? 'lightgrey' : 'black',
                  },
                ]}
                onPress={() => setPosi(v)}
                disabled={hori}
                key={v}>
                <Text style={{color: hori ? 'lightgrey' : 'black'}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.buttonSubContainer}>
          <TouchableOpacity
            style={[
              styles.majorButton,
              {backgroundColor: hori ? 'lightblue' : 'white'},
            ]}
            onPress={() => setHori(true)}>
            <Text>Horizontal</Text>
          </TouchableOpacity>
          <View style={styles.minorButtonContainer}>
            {['top', 'bottom', 20, 50, 80].map(v => (
              <TouchableOpacity
                style={[
                  styles.minorButton,
                  {
                    backgroundColor: hori && posi === v ? 'lightblue' : 'white',
                    borderColor: hori ? 'black' : 'lightgrey',
                  },
                ]}
                onPress={() => setPosi(v)}
                disabled={!hori}
                key={v}>
                <Text style={{color: hori ? 'black' : 'lightgrey'}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.minorButtonContainer}>
          <TouchableOpacity
            style={[
              styles.majorButton,
              {
                backgroundColor: indCrazy ? 'white' : 'lightblue',
              },
            ]}
            onPress={() => setIndCrazy(false)}>
            <Text>Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.majorButton,
              {
                backgroundColor: indCrazy ? 'lightblue' : 'white',
              },
            ]}
            onPress={() => setIndCrazy(true)}>
            <Text>Crazy</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View
          style={[styles.scrollViewContainer, {height: hori ? '20%' : '100%'}]}>
          {(hori && isHoriPosiGood()) || (!hori && isVertPosiGood()) ? (
            <ScrollViewIndicator
              horizontal={hori}
              position={posi}
              indStyle={
                indCrazy ? styles.indStyleCrazy : styles.indStyleNormal
              }>
              <View style={styles.scrollContent}>
                <Text>{hori ? lorem.text.slice(0, 100) : lorem.text}</Text>
              </View>
            </ScrollViewIndicator>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'blue',
  },
  buttonSubContainer: {
    marginVertical: 10,
  },
  minorButtonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around'
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 30,
  },
  scrollViewContainer: {
    borderWidth: 1,
    borderColor: 'black',
  },
  indStyleNormal: {backgroundColor: 'grey', width: 5, borderRadius: 3},
  indStyleCrazy: {backgroundColor: 'red', width: 60, borderRadius: 50},
  scrollContent: {padding: 10},
  majorButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
    padding: 5,
    width: 100,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  minorButton: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    padding: 5,
    width: 60,
    marginHorizontal: 5,
  },
});

export default App;
