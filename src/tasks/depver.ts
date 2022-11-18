import { ethers, upgrades } from "hardhat";

import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const deployByName = async function (
    ethers: HardhatRuntimeEnvironment["ethers"],
    contractName: string,
    signer: SignerWithAddress,
    isUpgradable: boolean,
): Promise<any> /*deployed address*/ {
    let contract;
    if (isUpgradable) {
        const contractFactory = await ethers.getContractFactory(contractName);
        contract = await upgrades.deployProxy(contractFactory);
    } else {
        const contractFactory = await ethers.getContractFactory(contractName, signer);
        contract = await contractFactory.deploy();
        await contract.deployed();
    }

    let tx = contract.deployTransaction;
    return { contract, tx };
}

task('depver', 'Deploy and verify the contracts')
    .addFlag('isUpgradable', 'Whether we are deploying upgradable contracts')
    .addParam("signerIndex", "Index of signer, default 4")
    .addParam("contractName", "Name of the contract to be deployed.")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        await hre.run('compile');
        const contractName = args.contractName;
        const signer = (await hre.ethers.getSigners())[parseInt(args.signerIndex)] as SignerWithAddress;
        const { contract, tx } = await deployByName(hre.ethers, args.contractName, signer, args.isUpgradable);
        for (let i = 0; i < 6; i++) {
            console.log(`Block ${i}...`);
            await tx.wait(i);
        }
        console.log(`Done waiting for the confirmation for contract ${contractName} at ${contract.address}`);
        await hre.run("verify:verify", {
            address: contract.address,
        }).catch(e => console.log(`Failure ${e} when verifying ${contractName} at ${contract.address}`));
        console.log(`Done verifying ${contractName} at ${contract.address}`);
    });
