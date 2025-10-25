import { Animated } from 'react-native';

// Visual height of the header (approx). Adjust if design changes.
export const HEADER_HEIGHT = 64;

// Shared animated value for vertical scroll offset
const scrollY = new Animated.Value(0);

// Clamp the scroll between 0 and HEADER_HEIGHT
const clamped = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

// Translate header up as we scroll down
export const headerTranslateY = clamped.interpolate({
  inputRange: [0, HEADER_HEIGHT],
  outputRange: [0, -HEADER_HEIGHT],
  extrapolate: 'clamp',
});

// Consumers attach this to their ScrollView/FlatList onScroll
export const createHeaderOnScroll = () =>
  Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
  });
