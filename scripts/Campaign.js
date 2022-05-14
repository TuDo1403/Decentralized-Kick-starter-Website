import artifact from '../artifacts/contracts/Campaign.sol/Campaign.json'
import provider from './provider'
import { ethers } from 'ethers'

export default (address) => {
    return new ethers.Contract(
        address,
        artifact.abi,
        provider
    )
}
