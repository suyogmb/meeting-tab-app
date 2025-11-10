module.exports = (() => {
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            screens: './src/screens',
            components: './src/components',
            navigators: './src/navigators',
            routes: './src/routes',
            contexts: './src/contexts',
            assets: './src/assets',
            hooks: './src/hooks',
            utils: './src/utils',
            appRedux: './src/redux',
            networkConfig: './src/networkConfig',
          },
        },
      ],
      'react-native-worklets/plugin',       
    ],
  };
})();
