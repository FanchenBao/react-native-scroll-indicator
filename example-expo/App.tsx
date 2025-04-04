import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Button, 
  TouchableOpacity, 
  TextInput,
  Keyboard 
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ScrollViewIndicator, FlatListIndicator, FlashListIndicator } from './src/components/scroll-indicator';
import { StatusBar } from 'expo-status-bar';

const generateData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i}`,
    title: `Item ${i}`,
    content: `This is the content for item ${i}. Adding some more text to make it scrollable.`
  }));
};

// Theme colors for each tab
const THEME_COLORS = {
  scrollview: {
    primary: '#E53935', // Red
    light: '#FFCDD2',
    dark: '#B71C1C',
    text: '#FFFFFF',
  },
  flatlist: {
    primary: '#43A047', // Green
    light: '#C8E6C9',
    dark: '#1B5E20',
    text: '#FFFFFF',
  },
  flashlist: {
    primary: '#1E88E5', // Blue
    light: '#BBDEFB',
    dark: '#0D47A1',
    text: '#FFFFFF',
  }
};

export default function App() {
  const [tab, setTab] = useState<'scrollview' | 'flatlist' | 'flashlist'>('scrollview');
  const [itemCount, setItemCount] = useState<string>('30');
  const [data, setData] = useState(generateData(30));
  const [actualCount, setActualCount] = useState(30);
  const debounceTimerRef = useRef<number | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  const flashListRef = useRef<FlashList<typeof data[0]>>(null);

  // Get current theme color based on active tab
  const currentTheme = THEME_COLORS[tab];

  // Update data when item count changes (with debounce)
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer to update data after a short delay
    debounceTimerRef.current = setTimeout(() => {
      // Parse input to number (default to 30 if invalid)
      const count = parseInt(itemCount, 10);
      const validCount = isNaN(count) || count <= 0 ? 30 : Math.min(count, 1000);
      
      // Update the actual count display
      setActualCount(validCount);
      
      // Update the data with the new count
      setData(generateData(validCount));
    }, 500) as unknown as number; // Cast for compatibility with both web and React Native

    // Cleanup function
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [itemCount]);

  // Scroll functions
  const scrollToTop = () => {
    if (tab === 'scrollview') {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else if (tab === 'flatlist') {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } else {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const scrollToBottom = () => {
    if (tab === 'scrollview') {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else if (tab === 'flatlist') {
      flatListRef.current?.scrollToEnd({ animated: true });
    } else {
      flashListRef.current?.scrollToEnd({ animated: true });
    }
  };

  // Handle item count input
  const handleItemCountChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setItemCount(numericText);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.light }]}>
      <StatusBar style="auto" />
      
      <Text style={[styles.title, { color: currentTheme.dark }]}>Scroll Indicator Demo</Text>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            tab === 'scrollview' ? { backgroundColor: THEME_COLORS.scrollview.primary } : { backgroundColor: '#f0f0f0' }
          ]} 
          onPress={() => setTab('scrollview')}
        >
          <Text style={[
            styles.tabText, 
            tab === 'scrollview' ? { color: '#fff' } : { color: '#333' }
          ]}>ScrollView</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            tab === 'flatlist' ? { backgroundColor: THEME_COLORS.flatlist.primary } : { backgroundColor: '#f0f0f0' }
          ]} 
          onPress={() => setTab('flatlist')}
        >
          <Text style={[
            styles.tabText, 
            tab === 'flatlist' ? { color: '#fff' } : { color: '#333' }
          ]}>FlatList</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            tab === 'flashlist' ? { backgroundColor: THEME_COLORS.flashlist.primary } : { backgroundColor: '#f0f0f0' }
          ]} 
          onPress={() => setTab('flashlist')}
        >
          <Text style={[
            styles.tabText, 
            tab === 'flashlist' ? { color: '#fff' } : { color: '#333' }
          ]}>FlashList</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.controlsContainer}>
        <View style={styles.scrollButtons}>
          <Button 
            title="Scroll to Top" 
            onPress={scrollToTop} 
            color={currentTheme.primary}
          />
          <Button 
            title="Scroll to Bottom" 
            onPress={scrollToBottom} 
            color={currentTheme.primary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: currentTheme.dark }]}>Number of items:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                { borderColor: currentTheme.primary }
              ]}
              value={itemCount}
              onChangeText={handleItemCountChange}
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={4} // Reasonable max to prevent performance issues
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={[styles.countLabel, { color: currentTheme.dark }]}>
              Showing {actualCount} items
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {tab === 'scrollview' ? (
          <ScrollViewIndicator
            scrollViewRef={scrollViewRef}
            position="right"
            indStyle={{ backgroundColor: currentTheme.primary, width: 5 }}
            containerStyle={styles.scrollContainer}
            persistentScrollbar={true}
          >
            <View style={styles.items}>
              {data.map(item => (
                <View key={item.id} style={[styles.item, { borderBottomColor: currentTheme.light }]}>
                  <Text style={[styles.itemTitle, { color: currentTheme.dark }]}>{item.title}</Text>
                  <Text>{item.content}</Text>
                </View>
              ))}
            </View>
          </ScrollViewIndicator>
        ) : tab === 'flatlist' ? (
          <FlatListIndicator
            flatListRef={flatListRef}
            position="right"
            indStyle={{ backgroundColor: currentTheme.primary, width: 5 }}
            containerStyle={styles.scrollContainer}
            persistentScrollbar={true}
            flatListProps={{
              data,
              keyExtractor: (item) => item.id,
              renderItem: ({ item }) => (
                <View style={[styles.item, { borderBottomColor: currentTheme.light }]}>
                  <Text style={[styles.itemTitle, { color: currentTheme.dark }]}>{item.title}</Text>
                  <Text>{item.content}</Text>
                </View>
              )
            }}
          />
        ) : (
          <FlashListIndicator
            flashListRef={flashListRef}
            position="right"
            indStyle={{ backgroundColor: currentTheme.primary, width: 5 }}
            containerStyle={styles.scrollContainer}
            persistentScrollbar={true}
            flashListProps={{
              data,
              keyExtractor: (item) => item.id,
              estimatedItemSize: 80,
              renderItem: ({ item }) => (
                <View style={[styles.item, { borderBottomColor: currentTheme.light }]}>
                  <Text style={[styles.itemTitle, { color: currentTheme.dark }]}>{item.title}</Text>
                  <Text>{item.content}</Text>
                </View>
              )
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  controlsContainer: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  scrollButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 16,
    marginRight: 12,
    fontWeight: '500',
  },
  inputWrapper: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  countLabel: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  items: {
    padding: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
