import { init, loadRemote } from '@module-federation/enhanced/runtime';
import { initNpdm } from '../initNpdm.js';
import { DynamicModule, DynamicPackageSpec, NpdmOptions } from '../types.js';

vi.mock('@module-federation/enhanced/runtime', () => ({
  init: vi.fn(),
  loadRemote: vi.fn(),
}));

const initMock = vi.mocked(init);
const loadRemoteMock = vi.mocked(loadRemote);

describe('initNpdm', () => {
  const testPackageSpec: DynamicPackageSpec = {
    packageName: '@remote/test-package',
    packageVersion: '0.0.1',
    remoteEntryRelativePath: '/npdm/entry.js',
    remoteEntryGlobalName: 'remote-entry-global-name',
    remoteType: 'esm',
  };

  const testPackageAlias = 'QHJlbW90ZS90ZXN0LXBhY2thZ2UtMC4wLjE=';

  const testModule: DynamicModule<number> = {
    exposedPath: '/testModule',
    packageSpec: testPackageSpec,
  };

  afterEach(() => {
    vi.resetAllMocks();
  });


  describe('module federation initialization', () => {
    it('calls init() method with dynamic remotes', () => {
      const npdmOptions: NpdmOptions = {
        name: 'test-app-name',
        npdmUrl: 'https://server.space/npdm-api',
      };
      initNpdm(npdmOptions, {
        testModule,
      });
      expect(initMock).toHaveBeenCalledWith({
        name: 'test-app-name',
        remotes: [{
          entry: 'https://server.space/npdm-api/@remote/test-package/0.0.1/npdm/entry.js',
          name: 'remote__test_package__0_0_1',
          alias: testPackageAlias,
          entryGlobalName: 'remote-entry-global-name',
          type: 'esm',
        }],
      });
    });

    it('passes non-NPDM module federation remotes into the init() method', () => {
      const remote = {
        entry: 'https://server.space/remoteEntry.js',
        name: 'test-package',
        alias: 'my-alias',
        entryGlobalName: 'remote-entry-global-name',
        type: 'esm',
      };
      initNpdm({
        name: 'my-app',
        npdmUrl: 'http://url.com',
        remotes: [remote],
      }, {});
      expect(initMock).toHaveBeenCalledWith({
        name: 'my-app',
        remotes: [remote],
      });
    });

    it('passes other module federation props into the init() method', () => {
      initNpdm({
        name: 'test-app',
        npdmUrl: 'http://url.com',
        shared: {
          react: {
            shareConfig: { requiredVersion: false },
          },
        },
      }, {});
      expect(initMock).toHaveBeenCalledWith({
        name: 'test-app',
        remotes: [],
        shared: {
          react: {
            shareConfig: { requiredVersion: false },
          },
        },
      });
    });
  });

  describe('loadDynamicModule', () => {
    it('calls loadRemote() method with the correspondent import', () => {
      const npdmOptions: NpdmOptions = {
        name: 'test-app-name',
        npdmUrl: 'https://server.space/npdm-api',
      };
      const { loadDynamicModule } = initNpdm(npdmOptions, {
        testModule,
      });
      loadDynamicModule('testModule');
      expect(loadRemoteMock).toHaveBeenCalledWith(`${testPackageAlias}/testModule`);
    });
  });
});
