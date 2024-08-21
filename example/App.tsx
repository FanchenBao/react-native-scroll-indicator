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
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import lorem from './src/lorem.json';
import { DemoScrollViewIndicator } from './src/demo/DemoScrollViewIndicator';
import { DemoFlatListIndicator } from './src/demo/DemoFlatListIndicator';

const App = () => {
  const [hori, setHori] = React.useState(false);
  const [posi, setPosi] = React.useState<string | number>('right');
  const [ind, setInd] = React.useState('Normal');
  const [comp, setComp] = React.useState('ScrollView');
  const [inverted, setInverted] = React.useState(false);

  const posiTypesHori = ['left', 'right', 20, 50, 80];
  const posiTypeVert = ['top', 'bottom', 20, 50, 80];
  const indTypes = ['Normal', 'Crazy'];
  const compTypes = ['ScrollView', 'FlatList'];

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonSubContainer, { flexDirection: 'row' }]}>
          {compTypes.map(v => (
            <TouchableOpacity
              style={[
                styles.majorButton,
                {
                  backgroundColor: v === comp ? 'lightblue' : 'white',
                },
              ]}
              onPress={() => setComp(v)}
              key={v}>
              <Text>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonSubContainer}>
          <TouchableOpacity
            style={[
              styles.majorButton,
              { backgroundColor: hori ? 'white' : 'lightblue' },
            ]}
            onPress={() => {
              setHori(false);
              setPosi('');
            }}>
            <Text>Vertical</Text>
          </TouchableOpacity>
          <View style={styles.minorButtonContainer}>
            {posiTypesHori.map(v => (
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
                <Text style={{ color: hori ? 'lightgrey' : 'black' }}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.buttonSubContainer}>
          <TouchableOpacity
            style={[
              styles.majorButton,
              { backgroundColor: hori ? 'lightblue' : 'white' },
            ]}
            onPress={() => {
              setHori(true);
              setPosi('');
            }}>
            <Text>Horizontal</Text>
          </TouchableOpacity>
          <View style={styles.minorButtonContainer}>
            {posiTypeVert.map(v => (
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
                <Text style={{ color: hori ? 'black' : 'lightgrey' }}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[styles.buttonSubContainer, { flexDirection: 'row' }]}>
          {indTypes.map(v => (
            <TouchableOpacity
              style={[
                styles.majorButton,
                {
                  backgroundColor: v === ind ? 'lightblue' : 'white',
                },
              ]}
              onPress={() => setInd(v)}
              key={v}>
              <Text>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonSubContainer}>
          <TouchableOpacity
            style={[
              styles.majorButton,
              {
                backgroundColor:
                  comp === 'ScrollView'
                    ? 'white'
                    : inverted
                      ? 'lightblue'
                      : 'white',
                borderColor:
                  comp === 'ScrollView'
                    ? 'lightgrey'
                    : styles.majorButton.borderColor,
              },
            ]}
            disabled={comp === 'ScrollView'}
            onPress={() => setInverted(!inverted)}>
            <Text
              style={{ color: comp === 'ScrollView' ? 'lightgrey' : 'black' }}>
              Inverted
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View
          style={[styles.scrollViewContainer, { height: hori ? '20%' : '100%' }]}>
          {comp === 'ScrollView' ? (
            <DemoScrollViewIndicator
              hori={hori}
              posi={posi}
              indStyle={
                ind === 'Crazy' ? styles.indStyleCrazy : styles.indStyleNormal
              }
              text={hori ? lorem.text.slice(0, 100) : lorem.text}
            />
          ) : (
            <DemoFlatListIndicator
              hori={hori}
              posi={posi}
              inverted={inverted}
              indStyle={
                ind === 'Crazy' ? styles.indStyleCrazy : styles.indStyleNormal
              }
              data={lorem.text.slice(0, hori ? 100 : 800).split('.')}
            />
          )}
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
    flex: 0.8,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  buttonSubContainer: {
    marginVertical: 10,
  },
  minorButtonContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    height: 300,
    marginHorizontal: 30,
    marginVertical: 30,
  },
  scrollViewContainer: {
    borderWidth: 1,
    borderColor: 'black',
  },
  indStyleNormal: { backgroundColor: 'grey', width: 5 },
  indStyleCrazy: { backgroundColor: 'red', width: 40 },
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
