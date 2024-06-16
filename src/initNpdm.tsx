import { init, loadRemote } from '@module-federation/enhanced/runtime';
import urlJoin from 'url-join';
import type { DynamicModuleMap, DynamicPackageSpec, ExtractPropsType, NpdmOptions } from './types.js';
import { getRemoteName } from './getRemoteName.js';


const getPackageAlias = (spec: DynamicPackageSpec): string => {
  return btoa(`${spec.packageName}-${spec.packageVersion}`);
};

/**
 * Initializes Module Federation and returns typed loadDynamicModule method to dynamically load packages
 */
export const initNpdm = <ModuleMap extends DynamicModuleMap>(
  {
    npdmUrl,
    remotes = [],
    ...moduleFederationOptions
  }: NpdmOptions,
  modules: ModuleMap,
) => {
  type ModuleName = keyof ModuleMap;
  type Remote = Parameters<typeof init>[0]['remotes'][number];

  const dynamicRemotesMap = Object.values(modules).reduce((acc, { packageSpec }) => {
    const alias = getPackageAlias(packageSpec);
    acc[alias] = {
      entry: urlJoin(
        npdmUrl,
        packageSpec.packageName,
        packageSpec.packageVersion,
        packageSpec.remoteEntryRelativePath,
      ),
      name: getRemoteName(packageSpec.packageName, packageSpec.packageVersion),
      entryGlobalName: packageSpec.remoteEntryGlobalName,
      type: packageSpec.remoteType,
      alias,
    };
    return acc;
  }, {} as Record<string, Remote>);

  init({
    remotes: [...remotes, ...Object.values(dynamicRemotesMap)],
    ...moduleFederationOptions,
  });

  const loadDynamicModule = async <T extends ModuleName>(moduleName: T) => {
    const { exposedPath, packageSpec } = modules[moduleName];
    const componentPath = urlJoin(getPackageAlias(packageSpec), exposedPath);
    const loadedModule = await loadRemote<ExtractPropsType<ModuleMap[T]>>(componentPath);
    if (loadedModule === null) {
      throw new Error(`Module Federation NPDM: Error loading module "${String(moduleName)}"`);
    }
    return loadedModule;
  };

  return { loadDynamicModule };
};
