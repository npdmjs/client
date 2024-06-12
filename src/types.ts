import type { UserOptions } from '@module-federation/runtime/types';
import type { RemoteEntryType } from '@module-federation/sdk';


type Optional<T, O extends keyof T> = Omit<T, O> & Partial<Pick<T, O>>;

type ModuleFederationOptions = Optional<UserOptions, 'remotes'>;

export type NpdmOptions = ModuleFederationOptions & {
  npdmUrl: string;
};


/**
 * Remote package entry point specification
 */
export type DynamicPackageSpec = {
  /** Name of the NPM package, required to retrieve the assets from it */
  packageName: string; // package name of current package
  /** Current version of the package from which module specification is taken */
  packageVersion: string; // default version of current package
  /** Module Federation's remote name */
  remoteName: string;
  /** The path to the remote entry file for the dynamic module */
  remoteEntryRelativePath: string; // where remote entry is placed
  /** Module Federation's entryGlobalName */
  remoteEntryGlobalName?: string;
  /** Module Federations's RemoteEntryType */
  remoteType?: RemoteEntryType;
};

// @ts-expect-error TProps used to contain props type
export type DynamicModule<
  // eslint-disable-next-line
  TProps = undefined,
> = {
  packageSpec: DynamicPackageSpec;
  exposedPath: string; // alias/path
};


export type DynamicModuleMap = Record<string, DynamicModule>;


export type ExtractPropsType<T> = T extends DynamicModule<infer P> ? P : never;
