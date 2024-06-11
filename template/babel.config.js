module.exports = (() => {
    if (false) {
        return {
            presets: ['module:@react-native/babel-preset'],
            plugins: [['transform-remove-console', {exclude: ['error', 'warn', 'log']}]],
        };
    } else {
        return {presets: ['module:@react-native/babel-preset']};
    }
})();
