import { webpackExternalForSuzume } from 'suzume-cli-dev-utils';
declare let config: {
    mode: string;
    entry: {
        suzume: string;
    };
    output: {
        path: string;
        publicPath: string;
        filename: string;
        library: string;
        libraryTarget: string;
    };
    module: {
        rules: ({
            test: RegExp;
            exclude: RegExp;
            use: {
                loader: string;
                options: {
                    [key: string]: any;
                };
            }[];
            sideEffects?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            exclude: RegExp;
            use: ({
                loader: string;
                options?: undefined;
            } | {
                loader: string;
                options: {
                    modules: {
                        localIdentName: string;
                    };
                } | {
                    modules?: undefined;
                };
            } | {
                loader: string;
                options: {
                    javascriptEnabled: boolean;
                };
            })[];
            sideEffects?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            sideEffects: boolean;
            use: {
                loader: string;
            }[];
            exclude?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            loader: string;
            options: {
                esModule: boolean;
            };
            exclude?: undefined;
            use?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp;
            use: string[];
            exclude?: undefined;
            sideEffects?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            use: ({
                loader: string;
                options?: undefined;
            } | {
                loader: string;
                options: {
                    modules: {
                        localIdentName: string;
                    };
                } | {
                    modules?: undefined;
                };
            } | {
                loader: string;
                options: {
                    javascriptEnabled: boolean;
                };
            })[];
            exclude?: undefined;
            sideEffects?: undefined;
            loader?: undefined;
            options?: undefined;
        })[];
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
    resolveLoader: {
        modules: string[];
    };
    plugins: any[];
};
export default config;
