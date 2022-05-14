import { ethers } from "ethers";

let provider
if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum)
} else {
  provider = new ethers.providers.InfuraProvider(
    'kovan',
    '0487aaafaa0c4c6eba2e13ffbbc9d894'
  )
}

export default provider