# NovaPlay

## Index

- [NovaPlay](#novaplay)
  - [Index](#index)
  - [Supported Operating Systems](#supported-operating-systems)
  - [Installation](#installation)
    - [Linux](#linux)
      - [Debian, Ubuntu and Derivatives](#debian-ubuntu-and-derivatives)
      - [Other Distributions (TAR.XZ)](#other-distributions-tarxz)
    - [Windows](#windows)
    - [macOS](#macos)
  - [Credits](#credits)

## Supported Operating Systems

- Windows 8+ (might work on Win7 if you have the latest PowerShell but we do not give support for it)
- Linux:
  - Ubuntu 20.04LTS or newer
  - Fedora 33 or newer
  - Arch Linux (Manjaro and Garuda as well)
  - NovaPlay will still work on most distros but we do not give official support for them. So do not open Issues here in these cases, instead, open a Discussion or try our Discord.
- SteamOS (downloading using Discover only)
- macOS 10.15 or higher


### Local Development

This projects uses optional NPM packages.

For internal developers, use:

```bash
yarn setup
yarn start
```

For external developers, use:

```bash
yarn setupWithoutOptional
yarn start
```

#### M1/M2 Mac

If you are using an M1 or M2 Mac and receive the following error message:

```
Error: Cannot find module @rollup/rollup-darwin-arm64. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

Please try the following

```bash
rm -f yarn.lock
rm -rf node_modules
yarn cache clean
yarn setupWithoutOptional
yarn start
```

#### Lavamoat

Please note that at times, the console may alert you to run `yarn allow-scripts auto`. This is from `@lavamoat/allow-scripts` and is due to a dependency adding a new preinstall or postinstall script. After running `yarn allow-scripts auto` and updating the package.json to enable or disable the script, please run `yarn setup` or `yarn setupWithoutOptional` again.

## Credits

### Those Awesome Guys: Gamepad prompts images

- URL: https://thoseawesomeguys.com/prompts/
