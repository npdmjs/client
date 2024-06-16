/**
 * Returns a unique remote name for Module Federation, based on package name and version.
 * Should be used with ModuleFederationPlugin.
 * @param packageName - package name from package.json
 * @param version - version from package.json
 * @returns Module Federation remote name for NPDM
 */
export const getRemoteName = (packageName: string, version: string) => {
  return `${packageName}__${version}`
    .replace('@', '')
    .replace('/', '__')
    .replaceAll(/[.\-+]+/g, '_');
};
