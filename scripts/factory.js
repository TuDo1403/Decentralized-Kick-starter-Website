import artifact from '../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json'
import { ethers } from "ethers"
import provider from './provider'

const address = '0xa106059F0324818d3366D3391aC915eE63564D8a'
const abi = artifact.abi

const instance = new ethers.Contract(address, abi, provider)

export default instance
