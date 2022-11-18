# hardhat-depver Plugin

A handy hardhat plugin to deploy *and* verify source code via command-line

## Installation

```bash
npm install hardhat-depver
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-depver");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-depver";
```


## Required plugins

- `@nomiclabs/hardhat-ethers`

## Tasks

This plugin adds the `depver` task to Hardhat:

```
output of `npx hardhat help depver`
```

Usage:

```sh
npx hardhat depver --network goerli --signer-index 2 --contract-name <ContractName>
```

## Configuration

See configurating `hardhat-etherscan`

## Usage

```sh
npx hardhat depver --network goerli --signer-index 2 --contract-name <ContractName>
```

### Examples

See a few examples in [ERCRef](https://github.com/ercref/ercref-contracts/blob/bfe09ef629c53dc738b4097cf97326f0e913bd55/ERCs/eip-5298/package.json#L26)

## Contributing

### Publish

We use [`np`](https://www.npmjs.com/package/np) for publishing. You shall be able to run the following

```sh
npx np
```
