declare type BaseBabelConfig = {
    filename: string;
    presets: Array<any>;
    plugins: Array<string | Function>;
};
declare const config: BaseBabelConfig;
export default config;
