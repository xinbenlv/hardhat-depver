import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const deployByName = async function (
    hre: HardhatRuntimeEnvironment,
    contractName: string,
    signer: SignerWithAddress,
    isUpgradable: boolean,
): Promise<any> /*deployed address*/ {
    let contract;
    let ethers = hre.ethers;
    let upgrades = hre.upgrades;
    console.log(`Deploying signer: ${signer.address}`);
    if (isUpgradable) {
        console.log(`Deploying ${contractName} as upgradable`);
        const contractFactory = await ethers.getContractFactory(contractName, signer);
        contract = await upgrades.deployProxy(contractFactory);
        await contract.deployed();
    } else {
        console.log(`Deploying ${contractName} as non-upgradable`);
        const contractFactory = await ethers.getContractFactory(contractName, signer);
        contract = await contractFactory.deploy();
        await contract.deployed();
    }
    let tx = contract.deployTransaction;
    return { contract, tx };
}

task('depver', 'Deploy and verify the contracts')
    .addFlag('upgradable', 'Deploy upgradable contracts')
    .addParam("signerIndex", "Index of signer, default 4")
    .addParam("contractName", "Name of the contract to be deployed.")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        await hre.run('compile');
        const contractName = args.contractName;
        const signer = (await hre.ethers.getSigners())[parseInt(args.signerIndex)] as SignerWithAddress;
        const { contract, tx } = await deployByName(hre, args.contractName, signer, args.upgradable);
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
