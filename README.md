# @fanchenbao/react-native-scroll-indicator

A react-native component that offers a customizable scroll indicator for ScrollView and FlatList

## Why do we need another customizable scroll indicator?

If you search for react native scroll indicator on npm, there are more than 10 packages already there. Compared to those, this package has the following advantages:

1. Support both `ScrollView` and `FlatList`
2. Support both vertical and horizontal scrolling
3. Indicator can be customized just like a regular `View` (e.g. color, width, position, etc.)
4. Comprehensive demos
5. The animation logic of the indicator is not complicated and well documented in the source code. You can fork the repo and easily maintain itself. Hint: it does NOT use `PanResponder`.

## Installation

```sh
npm install @fanchenbao/react-native-scroll-indicator
```

## Usage

### ScrollViewIndicator

```js
import * as React from 'react';
import {View, Text} from 'react-native';
import {ScrollViewIndicator} from '@fanchenbao/react-native-scroll-indicator';

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: '30%',
          width: '80%',
          borderWidth: 1,
          borderColor: 'black',
        }}>
        <ScrollViewIndicator indStyle={{backgroundColor: 'green'}}>
          <View>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              rhoncus nisl egestas, auctor mi pulvinar, aliquam metus. Nunc
              porttitor quam molestie tempor laoreet. Sed vitae ex vitae turpis
              convallis accumsan. Fusce consequat quis nisi sed lacinia. Nullam
              quis condimentum tellus. Donec ornare quam sit amet tempor
              imperdiet. Proin condimentum leo quis ipsum pretium ornare
              facilisis eget nunc. Pellentesque orci purus, pellentesque et nisl
              at, varius molestie nisi. Vestibulum ante ipsum primis in faucibus
              orci luctus et ultrices posuere cubilia curae; Nam ante nulla,
              sagittis vitae ante id, dignissim vestibulum ligula. Mauris
              iaculis nisi sed sapien finibus, sed pharetra risus rutrum. Cras
              laoreet mattis egestas. Pellentesque feugiat accumsan ultricies.
              Nullam viverra sapien nec tellus commodo aliquet. Integer faucibus
              quam sed nibh congue, at cursus risus vulputate. Morbi commodo
              mollis tempus.
            </Text>
          </View>
        </ScrollViewIndicator>
      </View>
    </View>
  );
};

export default App;
```

![minimal demo of ScrollViewIndicator]()

### FlatListIndicator

```js
import * as React from 'react';
import {View, Text} from 'react-native';
import {FlatListIndicator} from '@fanchenbao/react-native-scroll-indicator';

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: '10%',
          width: '80%',
          borderWidth: 1,
          borderColor: 'black',
        }}>
        <FlatListIndicator
          flatListProps={{
            ItemSeparatorComponent: () => (
              <View style={{width: 1, backgroundColor: 'blue'}} />
            ),
            data: [
              'Druid',
              'Sorceress',
              'Paladin',
              'Barbarian',
              'Necromancer',
              'Assassin',
              'Amazon',
            ],
            renderItem: ({item}) => (
              <View style={{justifyContent: 'center', padding: 10}}>
                <Text>{item}</Text>
              </View>
            ),
          }}
          horizontal={true}
          position="bottom"
          indStyle={{width: 30}}
        />
      </View>
    </View>
  );
};

export default App;
```

![minimal demo of FlatListIndicator]()

## Comprehensive Examples

![comprehensive examples]()

## Run Comprehensive Examples

Download this repo

```sh
git clone https://github.com/FanchenBao/react-native-scroll-indicator.git
```

Go to the `example` folder and sets up the example app

```sh
npm install
```

Then go to the root folder to run the example app for iOS

```sh
yarn example ios
```

or Android

```sh
yarn example android
```

The example app is running from [`./example/App.tsx`](./example/App.tsx)


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
