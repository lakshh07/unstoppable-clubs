import hc from '../contracts/hardhat_contracts'
import  { WalletService } from '@unlock-protocol/unlock-js';
import config from '../config'
import { ethers } from 'ethers';
const PostContract = hc['1337']['localhost']['contracts']['PublicLockPosts'];

export default class ClubService {
    constructor(){
        
    }

    async init(mprovider) {
        
        this.postContract = new ethers.Contract(PostContract.address, PostContract.abi, mprovider.getSigner());
        this.walletService = new WalletService({'1337': {provider: 'http://127.0.0.1:7545', unlockAddress: config.unlockAddress},'5777': {provider: 'http://127.0.0.1:7545', unlockAddress: config.unlockAddress}});
        await this.walletService.connect(mprovider);
    }

    async createClub(memberPriceInEth, clubName, totalMembers) {
        const lockAddress = await this.walletService.createLock({maxNumberOfKeys: totalMembers, name: clubName, expirationDuration: 12121311, keyPrice: memberPriceInEth})
        return lockAddress;
    }

   async subscribeToClub(lockAddress, pubkey) {
        const transactionHash = await this.walletService.purchaseKey({
          lockAddress:lockAddress,
          data: Buffer.from(pubkey)
        }, (error, hash) =>{
          alert('tx', hash);
        });
        alert(`key purchased ${transactionHash}`)
        return transactionHash;
      }
    
    async testClubCreation() {
        const la = await this.createClub("0.01","MyClub " + Math.random(), 100);
        const th = await this.subscribeToClub(la);
        console.log('ALL DONE', la, th)
      }

    async publishOnChain(clubAddress, fileName, jsonDocPath) {
      const postId  = await this.postContract.publishPost(clubAddress, `${fileName},${jsonDocPath}`);
      console.log('POST PUBLISHED', postId);
      return postId;
    }

}