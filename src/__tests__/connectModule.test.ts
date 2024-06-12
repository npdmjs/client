import { connectModule } from '../connectModule.js';
import type { DynamicModule, DynamicPackageSpec } from '../types.js';

describe('connectModule', () => {
  it('returns the same module with the version set', () => {
    const testPackageSpec: DynamicPackageSpec = {
      packageName: '@remote/test-package',
      packageVersion: '0.0.1',
      remoteEntryRelativePath: '/npdm/entry.js',
      remoteName: 'test-package',
    };

    const testModule: DynamicModule<number> = {
      exposedPath: '/testModule',
      packageSpec: testPackageSpec,
    };

    const actual = connectModule(testModule, '0.0.2');

    expect(actual).toEqual({
      exposedPath: '/testModule',
      packageSpec: {
        packageName: '@remote/test-package',
        packageVersion: '0.0.2',
        remoteEntryRelativePath: '/npdm/entry.js',
        remoteName: 'test-package',
      },
    });
  });
});