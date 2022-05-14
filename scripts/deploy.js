const { ethers } = require('hardhat')
const artifact = require('../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json')


async function main() {
    const signers = ethers.getSigners()
    const deployer = signers[0]
    const Contract = await ethers.getContractFactoryFromArtifact(
        artifact,
        deployer
    )
    const contract = await Contract.deploy(
        { gasLimit: 5000000 }
    )
    
    await contract.deployed()

    console.log(`Contract deployed at address: ${contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });