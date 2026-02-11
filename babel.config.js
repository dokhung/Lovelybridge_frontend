module.exports = {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: { '@': './src' },
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
            },
        ],
        // reanimated 쓸 거면 아래도 필요
        // 'react-native-reanimated/plugin',
    ],
};
