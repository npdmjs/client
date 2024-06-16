import { getRemoteName } from '../getRemoteName.js';

describe('getRemoteName', () => {
  it.each([
    {
      name: 'my-package',
      version: '1.0.0',
      expected: 'my_package__1_0_0',
    },
    {
      name: '@scope/my-package',
      version: '1.0.0-beta.1',
      expected: 'scope__my_package__1_0_0_beta_1',
    },
    {
      name: '@scope/my-package.test',
      version: '1.0.0-beta.1+123',
      expected: 'scope__my_package_test__1_0_0_beta_1_123',
    },
  ])('$name $version is converted to $expected', ({ name, version, expected }) => {
    expect(getRemoteName(name, version)).toBe(expected);
  });
});
