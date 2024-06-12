import { DynamicModule } from './types.js';

/**
 * Connects module to the NPDM with specified version
 */
export const connectModule = <T>(
  { exposedPath, packageSpec }: DynamicModule<T>,
  packageVersion: string,
): DynamicModule<T> => {
  return {
    exposedPath,
    packageSpec: {
      ...packageSpec,
      packageVersion,
    },
  };
};
