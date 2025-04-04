# Changelog

## [0.5.0] - (Unreleased)

### Added
- **FlashList Support**: Added support for Shopify's FlashList component
  - Created new FlashListIndicator component
  - FlashList ref forwarding for programmatic scrolling control 
  - Example usage in demo app

### Enhanced
- **Ref Forwarding**: Improved the implementation to properly forward refs to all list types
  - ScrollView refs
  - FlatList refs
  - FlashList refs
  - Example of programmatic scrolling methods (scrollTo, scrollToEnd, scrollToOffset)

### Changed
- **Component Architecture**:
  - Refactored ScrollIndicator to use a more modular approach
  - Created a renderScrollableComponent method to handle all list types
  - Updated scroll handling to work consistently across all list types

### Improved
- **Demo App**:
  - Added tabbed interface to switch between list types
  - Added scroll control buttons
  - Improved styling with active states
  - Better demonstration of component capabilities

## Implementation Details

### FlashList Integration

The FlashList integration required several changes:

1. **Type Definitions**:
   ```typescript
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
   ```

2. **ScrollIndicator Updates**:
   - Added FlashList to the target types
   - Added flashListRef to the PropsT interface
   - Updated the rendering logic to handle FlashList

3. **Indicator Component Updates**:
   - Added FlashList to the scrollRefs type
   - Updated scroll handling to check for FlashList refs first

### Ref Forwarding Pattern

The ref forwarding pattern used allows direct access to the underlying components:

```typescript
// Internal refs as fallbacks
const internalScrollRefs = {
  FlatList: React.useRef<FlatList>(null),
  ScrollView: React.useRef<ScrollView>(null),
  FlashList: React.useRef<FlashList<any>>(null),
};

// Use passed refs or fallback to internal ones
const scrollRefs = {
  FlatList: flatListRef || internalScrollRefs.FlatList,
  ScrollView: scrollViewRef || internalScrollRefs.ScrollView,
  FlashList: flashListRef || internalScrollRefs.FlashList,
};
```

This pattern allows:
1. The component to work without passed refs (backward compatibility)
2. External components to access and control scrolling programmatically
3. Consistent APIs across all list types

## Future Improvements

Potential future improvements:
- Reanimated integration for better performance
- TypeScript generic improvements for better type checking
- Additional customization options
- Performance optimizations 