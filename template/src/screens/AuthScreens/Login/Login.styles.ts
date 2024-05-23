import {StyleSheet} from 'react-native';
import {ThemeOptions, useTheme} from '../../../contexts/ThemeContext';

export const useStyles = () => {
    const {theme, setTheme} = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === ThemeOptions.dark ? 'black' : 'white',
        },
        logo: {
            height: 60,
            width: 60,
        },
    });
};
