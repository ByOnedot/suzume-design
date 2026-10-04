import { webpackExternalForSuzume } from 'suzume-cli-dev-utils';
declare let config: {
    entry: string;
    output: {
        path: string;
        filename: string;
        library: string;
        libraryTarget: string;
    };
    mode: string;
    module: {
        rules: {
            test: RegExp;
            loader: string;
            exclude: RegExp;
        }[];
    };
    externals: (typeof webpackExternalForSuzume | {
        react: {
            root: string;
            commonjs2: string;
            commonjs: string;
            amd: string;
        };
        'react-dom': {
            root: string;
            commonjs2: string;
            commonjs: string;
            amd: string;
        };
    })[];
    resolve: {
        modules: string[];
        extensions: string[];
    };
    plugins: any[];
};
export default config;
