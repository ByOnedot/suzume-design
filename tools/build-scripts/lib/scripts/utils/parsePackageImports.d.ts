/**
 * Resolve all dependencies of an ES module for a package
 */
export default function parsePackageImports(entryPath: string, packageName: string, result?: string[], parsedFileMap?: {
    [key: string]: boolean;
}): Promise<string[]>;
