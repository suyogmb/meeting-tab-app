import {StyleSheet} from 'react-native';
import {ThemeOptions, useTheme} from '../../../contexts/ThemeContext';

export const useStyles = () => {
    const {themeColors} = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.background,
        },
        logo: {
            height: 60,
            width: 60,
        },
    });
};
