#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Get folder name from CLI args
const folderName = process.argv[2];

if (!folderName) {
  console.error('❌ Please provide a folder/component name. Example: generateComponent Account');
  process.exit(1);
}

// ✅ This is the CURRENT folder you're in (e.g., src/screens)
const currentDir = process.env.CURRENT_DIR || process.cwd();

// 🧠 Get the full path like: src/screens/Account
const folderPath = path.join(currentDir, folderName);

// 🧠 Get the base file name like: Account
const fileBaseName = path.basename(folderPath);

// ✅ Create the folder
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, {recursive: true});
  console.log(`📁 Created folder: ${folderPath}`);
}

// Template contents
const styleTemplate = `
import {useTheme} from 'contexts/ThemeContext';
import {StyleSheet} from 'react-native';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
  });
};
`;

const viewModelTemplate = `
import {useTranslation} from 'react-i18next';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useStyles} from './${fileBaseName}.styles';
// Uncomment if using Redux Toolkit:
// import {useDispatch} from 'react-redux';
// import {AppDispatch} from 'redux/app/store';

const useViewModel = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();
  // Uncomment if using Redux Toolkit:
  // const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();

  return {
    styles,
    t,
    navigation,
    // Uncomment if using Redux Toolkit:
    // dispatch,
    isFocused,
  };
};

export default useViewModel;
`;

const componentTemplate = `
import {Text, View} from 'react-native';
import React from 'react';
import useViewModel from './${fileBaseName}.viewmodel';

const ${fileBaseName} = () => {
  const {styles, t, navigation, isFocused} = useViewModel();
  // Uncomment if using Redux Toolkit:
  // const {dispatch} = useViewModel();
  
  return (
    <View style={styles.container}>
      <Text>${fileBaseName}</Text>
    </View>
  );
};

export default ${fileBaseName};
`;

// Write files
fs.writeFileSync(path.join(folderPath, `${fileBaseName}.styles.ts`), styleTemplate.trim());
fs.writeFileSync(path.join(folderPath, `${fileBaseName}.viewmodel.ts`), viewModelTemplate.trim());
fs.writeFileSync(path.join(folderPath, `${fileBaseName}.tsx`), componentTemplate.trim());

console.log(`✅ Created component files for: ${fileBaseName}`);
