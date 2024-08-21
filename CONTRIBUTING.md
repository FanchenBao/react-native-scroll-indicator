# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

Get husky ready

```sh
yarn prepare
```

> While it's possible to use [`npm`](https://github.com/npm/cli), the tooling is built around [`yarn`](https://classic.yarnpkg.com/), so you'll have an easier time if you use `yarn` for development.

All development must take place inside the `example` folder. Thus change your work directory there and run:

```sh
cd example
npm install
```

This will install the dependencies for running the example app. It is **CRUCIAL** to note that the source code is located in `example/src/react-native-scroll-indicator/*`, NOT `./src/*`. Regular development should be conducted while the example app is running, because the app can obtain the component directly from `example/src/react-native-scroll-indicator`. Once development is done, one must return to the root folder and build the package:

```sh
cd ..
yarn build
```

The `yarn build` command copies the source code from `example/src/react-native-scroll-indicator/*` to `./src/*` and build the package.

Before releasing the package, one must test whether the package can be successfully installed and used. To do so, we run the following command under root

```sh
npm pack
```

This packages the compiled code in a `fanchenbao-react-native-scroll-indicator-x.x.x.tgz` file, where `x.x.x` is the version number. Install it in the `example` folder:

```sh
cd example
npm install ../fanchenbao-react-native-scroll-indicator-x.x.x.tgz
```

Then in the example app, we can use custom scroll indicator by importing it directly from `node_modules`:

In file `example/src/demo/DemoFlatListIndicator.tsx`, use

```javascript
// import { FlatListIndicator } from '../react-native-scroll-indicator';
import {FlatListIndicator} from '@fanchenbao/react-native-scroll-indicator';
```

In file `example/src/demo/DemoScrollViewIndicator.tsx`, use

```javascript
// import { ScrollViewIndicator } from '../react-native-scroll-indicator';
import {ScrollViewIndicator} from '@fanchenbao/react-native-scroll-indicator';
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typecheck
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

~~Remember to add tests for your change if possible. Run the unit tests by:~~
No unit test available at the moment

```sh
yarn test
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, do the following:

1. Push the feature branch to github and also set up upstream (`git push -u origin firstname.lastname.some_feature_branch`) and open a pull request
2. Resolve any issues if exist
3. **BEFORE** merging the branch to master, run `yarn release` on the local feature branch. This allows `release-it` to access all the commit history from the previous release and automatically decide on the next version and changelog.
4. After release, merge the pull request to master and squash the commits.

If release on the feature branch is not possible, one can merge the feature branch to master and release from master. HOWEVER, this merge must NOT be squashed. If squashed, `release-it` won't be able to see all the individual commits and will generate incorrect new version and changelog.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn bootstrap`: setup project by installing all dependencies and pods.
- `yarn typecheck`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
