declare const config: {
    client: {
        testEnvironment: string;
        clearMocks: boolean;
        collectCoverage: boolean;
        collectCoverageFrom: string[];
        coverageDirectory: string;
        coveragePathIgnorePatterns: string[];
        coverageReporters: string[];
        rootDir: string;
        setupFiles: string[];
        moduleFileExtensions: string[];
        snapshotSerializers: string[];
        testPathIgnorePatterns: string[];
        testRegex: string;
        transform: {
            '^.+\\.jsx?$': string;
            '^.+\\.tsx?$': string;
            '.*\\.md$': string;
            '.*\\.(css|less|scss)$': string;
        };
        transformIgnorePatterns: string[];
    };
    node: {
        testEnvironment: string;
        testRegex: string;
        rootDir: string;
        setupFiles: string[];
        moduleFileExtensions: string[];
        snapshotSerializers: string[];
        testPathIgnorePatterns: string[];
        transform: {
            '^.+\\.jsx?$': string;
            '^.+\\.tsx?$': string;
            '.*\\.md$': string;
            '.*\\.(css|less|scss)$': string;
        };
        transformIgnorePatterns: string[];
    };
};
export default config;
