#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

const generateComponent = (name: string) => {
  const componentTemplate = `
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ${name}Props {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ${name}: React.FC<${name}Props> = ({ 
  style, 
  textStyle 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>
        {/* Component Content */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  }
});

export default ${name};
  `;

  // Write component file
  fs.writeFileSync(path.join('./src/components', `${name}.tsx`), componentTemplate);

  console.log(`✅ Generated ${name} Component successfully!`);
};

// CLI usage
const [name] = process.argv.slice(2);
generateComponent(name);
