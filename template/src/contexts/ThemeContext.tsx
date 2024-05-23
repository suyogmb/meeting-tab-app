import React, {useContext} from 'react';
import {ThemeOptions} from '../types/types';

interface ThemeContextType {
    theme: ThemeOptions;
    setTheme: (key: ThemeOptions) => void;
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

const useTheme = () => {
    return useContext(ThemeContext);
};

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const [theme, setThemeState] = React.useState<ThemeOptions>(ThemeOptions.light);

    const setTheme = (value: ThemeOptions) => {
        setThemeState(value);
    };
    return <ThemeContext.Provider value={{theme: theme, setTheme: setTheme}}>{children}</ThemeContext.Provider>;
};

export {ThemeProvider, ThemeOptions, useTheme};
