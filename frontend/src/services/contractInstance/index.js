
import { Contract } from '@ethersproject/contracts'

import { RepUSDVaultABI } from '../../abis/repusdvault';
import { contractAddress } from '../../constants/contractAddresses';

const contractInstance = (account, chainId, library) => {
    if (chainId) {
        return new Contract(contractAddress, RepUSDVaultABI, library.getSigner(account));
    }
    return null
}

export {
    contractInstance
}
