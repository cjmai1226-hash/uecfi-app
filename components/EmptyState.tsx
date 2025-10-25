import { createHomeStyles } from '../assets/styles';
import { useTheme } from '../hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const EmptyState = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  return (
    <View style={homeStyles.emptyContainer}>
      <View
        style={[homeStyles.emptyIconContainer, { backgroundColor: colors.backgrounds.editInput }]}>
        <MaterialCommunityIcons name="feather" size={60} color={colors.textMuted} />
      </View>
      <Text style={homeStyles.emptyText}>No Content yet!</Text>
      <Text style={homeStyles.emptySubtext}>Content will appear here when available</Text>
    </View>
  );
};

export default EmptyState;
