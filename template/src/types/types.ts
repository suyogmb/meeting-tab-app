interface AppStateType {
  appReducer: {isLogin: boolean};
}

//Enums
enum ThemeOptions {
  'dark' = 'dark',
  'light' = 'light',
}

export type {AppStateType};
export {ThemeOptions};
