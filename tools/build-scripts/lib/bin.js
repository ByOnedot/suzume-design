#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const suzume_dev_utils_1 = require("../vendor/dev-utils");
const showConfig_1 = __importDefault(require("./config/showConfig"));
const component_1 = __importDefault(require("./scripts/build/component"));
const docgen_1 = __importDefault(require("./scripts/docgen"));
const icon_1 = __importDefault(require("./scripts/build/icon"));
const test_1 = require("./scripts/test");
const { version } = require('../package.json');
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
    throw err;
});
const subCommandList = [
    'dev:component',
    'build:component',
    'build:component:css',
    'build:component:dist',
    'build:component:es',
    'build:component:cjs',
    'build:icon',
    'docgen',
    'test',
    'test:client',
    'test:node',
    'show:config',
];
commander_1.default
    .version(version)
    .name('suzume-build')
    .usage('command [options]')
    .arguments('<cmd>')
    .action((cmd) => {
    if (subCommandList.indexOf(cmd) === -1) {
        suzume_dev_utils_1.print.error('[suzume-build]', 'Invalid command...');
        commander_1.default.help();
    }
});
commander_1.default
    .command('dev:component')
    .description('build components with watch mode')
    .action(() => {
    component_1.default.dev();
});
commander_1.default
    .command('build:component')
    .description('build all these sources: es, cjs, dist, icon and css')
    .action(() => {
    component_1.default.build();
});
commander_1.default.command('build:component:css').action(() => {
    component_1.default.buildCSS();
});
commander_1.default.command('build:component:dist').action(() => {
    component_1.default.buildUMD();
});
commander_1.default.command('build:component:es').action(() => {
    component_1.default.buildES();
});
commander_1.default.command('build:component:cjs').action(() => {
    component_1.default.buildCJS();
});
commander_1.default.command('build:icon').action(() => {
    (0, icon_1.default)();
});
commander_1.default
    .command('docgen')
    .description('generate document of component. e.g. suzume-build docgen --components Alert,Affix,Button')
    .option('-c, --components [names]', 'component name(s) joined by comma(,)')
    .action(({ components }) => {
    (0, docgen_1.default)(typeof components === 'string' ? components.split(',') : null);
});
commander_1.default
    .command('test')
    .description('A command which contains test:client and test:node, any option you entered will be passed to Jest. e.g. suzume-build test --updateSnapshot')
    .allowUnknownOption()
    .action(() => {
    (0, test_1.testClient)();
    (0, test_1.testNode)();
});
commander_1.default
    .command('test:client')
    .description('Any option you entered will be passed to Jest. e.g. suzume-build test:client --updateSnapshot')
    .allowUnknownOption()
    .action(() => {
    (0, test_1.testClient)();
});
commander_1.default
    .command('test:node')
    .description('Any option you entered will be passed to Jest. e.g. suzume-build test:node --bail')
    .allowUnknownOption()
    .action(() => {
    (0, test_1.testNode)();
});
commander_1.default
    .command('show:config <configType>')
    .description('Show your current config for suzume-build. Valid type: babel|style|webpack.component|webpack.icon|jest|docgen')
    .action((type) => {
    (0, showConfig_1.default)(type);
});
commander_1.default.parse(process.argv);
