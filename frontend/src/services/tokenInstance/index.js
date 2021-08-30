
import { Contract } from '@ethersproject/contracts'

import { RepUSDTokenABI } from '../../abis/repusdtoken';
import { tokenAddress } from '../../constants/contractAddresses';

const tokenInstance = (account, chainId, library) => {
    if (chainId) {
        return new Contract(tokenAddress, RepUSDTokenABI, library.getSigner(account));
    }
    return null
}

export {
    tokenInstance
}
