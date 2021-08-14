import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import  { WalletService } from '@unlock-protocol/unlock-js';

import {encrypt as ethSigEncrypt} from 'eth-sig-util';

import { utils } from "ethers";
import { Buffer } from 'buffer';
import React, { useEffect, useState } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList } from "../hooks";
import {  Buckets, encrypt } from '@textile/hub';


/*
1. File encrypt and upload - file object => encryptionKey, encryptionIv, encryptedData 
2. Key encrypt and upload - (key, metadata) =>  textileAddress
3. Publish Post - (name, ipfs url) => postId
4. Fetch all clubs - () => [clubs]
5. Fetch all members of a club - lockAddress => [members(address,pubkey)]
6. Fetch posts of a club - (lockAddress) => [posts]
7. Subscribe to a club - (lockAddress) => keyId
8. Create a new club - (lockName, price, totalMemberships = 100) => lockAddress
9. Fetch all clubs of a member - (address of member) => [clubs]
10. Fetch a file from textile -> (filePath) => Buffer
*/

const config = {
    unlockAddress: '0xEfA9768d29AbE06AD0aa8c632736BEff39A41e1D',
    provider: 'http://127.0.0.1:7545',
    threadID: 'bafkzubtwkd4qhlodrzjwvsw6wbfhpugtxbkr33txn7fcqsii233tshi',
    bucketKey: 'bafzbeibbklbg5ab4j7kwzk3jvc7h5k644hkdc6f6f26o73qh4g7plqudsm',
    bucketAuth :{
        key: 'b3xj7rjlhffdpc42lzz7slden4a',
        secret: 'bvyxyvavrpsili77jufjyyffxqba6nc2mhv5gv6y'
      }

}

 
//buckets textile
async function initBucket(){
    const buck = await Buckets.withKeyInfo(config.bucketAuth, {debug:true})
    await buck.withThread(config.threadID);
    return buck;
  }

//unlock
  async function initWC(){
    const wc = new WalletService({'1337': {provider: 'http://127.0.0.1:7545', unlockAddress: config.unlockAddress}});
    await wc.connect(provider);
    console.log(wc);
    return wc;
  }


  //encrypt file buffer
  const encryptBuffer = async (data) => {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encryptionKey = await crypto.subtle.generateKey({ 'name': 'AES-CBC', 'length': 256 }, true, ['encrypt', 'decrypt']);
    const encryptedData = await crypto.subtle.encrypt({ 'name': 'AES-CBC', iv }, encryptionKey, data)
    return {
      encryptionKey,
      encryptedData,
      iv
    }
  }


  const uploadToTextile = async (bufferData, name) => {
    const raw = await buckets.pushPath(config.bucketKey, name, {
      path: name,
      content: bufferData
    });
    return raw;
  }


//returns a list of files at that path
const fetchPathFromTextile = async (fileName, asString=true) => {
  const files = [];
  const repeater = await buckets.pullPath('bafzbeibbklbg5ab4j7kwzk3jvc7h5k644hkdc6f6f26o73qh4g7plqudsm',fileName);
  for await(let i of repeater) {
    if(i instanceof Uint8Array) {
        files.push(i);
      }
    }
  let result =  mergeUint8Arr(files);
  if(asString) {
    result = new TextDecoder().decode(result);
  }
  return result
}

const mergeUint8Arr = (myArrays) => {
  let length = 0;
  myArrays.forEach(item => {
    length += item.length;
  });
  let mergedArray = new Uint8Array(length);
  let offset = 0;
  myArrays.forEach(item => {
    mergedArray.set(item, offset);
    offset += item.length;
  });
  return mergedArray;
}


  const getPubKeyFromMetamask = async () => {
    await ethereum.request({'method': 'eth_requestAccounts'});
    const pubKey = await ethereum.request({'method': 'eth_getEncryptionPublicKey','params': [ethereum.selectedAddress]});
    return pubKey;
  }

  const encryptWithPubKey = async (pubkey, str) => {
    const encryptedData = ethSigEncrypt(pubkey, {data: str },'x25519-xsalsa20-poly1305');
    return encryptedData;
  }


  const decryptUsingMetamask = async (encryptedStr) => {
    console.log('decryptUsingMetamask', encryptedStr);
    const plainText = await ethereum.request({
        'method':'eth_decrypt',
        'params': [encryptedStr, ethereum.selectedAddress]
    });
    return plainText;
  }

  const createDocFromMembersList = (members, secretKey) => {
    const finalDoc = {};
    finalDoc['memberAccess'] = {};
    for(let m of members) {
      const memberHash = hexlifyStr(encryptWithPubKey(m.pubkey, secretKey));
      finalDoc['memberAccess'][m.address] = memberHash;
    }
    return finalDoc;
}

const hexlifyStr = (str) => {
  return utils.hexlify(Buffer.from(JSON.stringify(str)));
}

const uploadJson = async (jsonDoc, docPath) => {
  const jsonBuffer = Buffer.from(JSON.stringify(jsonDoc));
  const uploadedFile = await uploadToTextile(jsonBuffer, docPath);
  return uploadedFile;
}
  const createClub = async (walletService, memberPriceInEth, clubName, totalMembers) => {
    const lockAddress = await walletService.createLock({maxNumberOfKeys: totalMembers, name: clubName, expirationDuration: 12121311, keyPrice: memberPriceInEth})
    return lockAddress;
  }
  

  const subscribeToClub = async (lockAddress, pubkey) => {
    const transactionHash = await walletService.purchaseKey({
      lockAddress:lockAddress,
      data: Buffer.from(pubkey)
    }, (error, hash) =>{
      alert('tx', hash);
    });
    alert(`key purchased ${transactionHash}`)
    return transactionHash;
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const hexlifyStr = (str) => {
    return utils.hexlify(Buffer.from(JSON.stringify(str)));
  }


    // Convert a hex string to a byte array
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
      var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xF).toString(16));
  }
  return hex.join("");
}


  const fetchAllClubs = async () => {
    return await graphQLFetcher({
      query: `
        locks(first: 25) {
          id
          name
          price
        }
      `
    }).then((data) => {
      return data.data.locks;
    })
  }

  const fetchAllPosts = async (clubAddress) => {
    return await graphQLFetcher({
      query: `
        posts(first: 25, where:{lock: {id: ${clubAddress}}}) {
          id
          sender
          description
          filepath
          createdAt
        }
      `
    }).then((data) => {
      return data.data.posts;
    })
  }

  const fetchAllClubsOfMember = async (memberAddress) => {
    return await graphQLFetcher({
      query: `
        posts(first: 25, where:{lock: {id: ${clubAddress}}}) {
          id
          sender
          description
          filepath
          createdAt
        }
      `
    }).then((data) => {
      return data.data.posts;
    })

  }


  const graphQLFetcher =  (graphQLParams) => {
    console.log('GRAPH QL FETCHER', graphQLParams);
    return fetch(props.subgraphUri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  const testEncryption = async () => {
    const pubkey = await getPubKeyFromMetamask();
    console.log('getPubKeyFromMetamask', pubkey);
    const ed = await encryptWithPubKey(pubkey);
    console.log('encryptWithPubKey', ed);
    const hexStr = hexlifyStr(ed);
    console.log('hexlifyStr', hexStr);
    //put this string in json doc
    await sleep(3000);
    const finalTest = await decryptUsingMetamask(hexStr);
    console.log('decryptUsingMetamask', finalTest);
    // spt(finalTest);
  }

  const testUploadJson = async () => {
    await uploadJson({'key': ['val1','val2', Math.random().toString() ]},'jsondoc');
    await sleep(1000);
    const docs = await fetchPathFromTextile('jsondoc');
    alert(docs[0]);
  }

//fileobject
  const testEncryptedUpload = async (fileToUpload) => {
    const fileBuffer = await fileToUpload.arrayBuffer();
    const encryptedBuffer = await encryptBuffer(fileBuffer);
    const uploadedStatus  = await uploadToTextile(encryptedBuffer.encryptedData,'encryptedFile');
    console.log('HANLDE UPLOAD ENC', uploadedStatus);
    return uploadedStatus;
  }


  const testClubCreation = async () => {
      const la = await createClub("0.01","MyClub " + Math.random(), 100);
      const th = await subscribeToClub(la);
      console.log('ALL DONE', la, th)
    }


    const publishPostFlow = async (fileObject, fileName, clubAddress, clubName) => {
      const fileBuffer = await fileObject.arrayBuffer();
      const encryptedBuffer = await encryptBuffer(fileBuffer);
      console.log('MATCH FILE LENGTH', encryptedBuffer.encryptedData.byteLength)
      const uploadedStatus  = await uploadToTextile(encryptedBuffer.encryptedData,`${clubName}/${fileName}`);
      const members = await fetchMembers();
      
      const arrayBuffer = await crypto.subtle.exportKey("raw",encryptedBuffer.encryptionKey);
      const ekeyhex = bytesToHex(new Uint8Array(arrayBuffer));
      
      const jsonDoc = createDocFromMembersList(members, ekeyhex);
      jsonDoc['iv'] = encryptedBuffer.iv;
      console.log("MATCH HEX", encryptedBuffer.iv);
      jsonDoc['filePath'] = `${clubName}/${fileName}`
      const jsonDocPath = `${clubName}/${fileName}_md`;
      await uploadJson(jsonDoc, jsonDocPath);
  
      const PostContract = require("../contracts/hardhat_contracts.json")['1337']['localhost']['contracts']['PublicLockPosts']
      const contract = new ethers.Contract(PostContract.address, PostContract.abi, signer);
      const postId  = await contract.publishPost(clubAddress, `${fileName},${jsonDocPath}`);
      return postId;
  }


  const fetchPostFlow = async (clubAddress,clubName) => {
    const myAddress = await ethereum.request({'method': 'eth_requestAccounts'});
    const PostContract = require("../contracts/hardhat_contracts.json")['1337']['localhost']['contracts']['PublicLockPosts']
    const contract = new ethers.Contract(PostContract.address, PostContract.abi, signer);
    const postURI = await contract.lastTokenURI();
    const jsonDocPath = postURI.split(',')[1]
    const jsonDocStr = await fetchPathFromTextile(jsonDocPath)
    const jsonDoc = JSON.parse(jsonDocStr);
    const strToDecrypt = jsonDoc['memberAccess'][myAddress[0]];
    const encryptionKeyHex = await decryptUsingMetamask(strToDecrypt);
    let decryptionKey = new Uint8Array(hexToBytes(encryptionKeyHex)).buffer;
    decryptionKey = await crypto.subtle.importKey('raw', decryptionKey, { 'name': 'AES-CBC', 'length': 256 }, true, ['encrypt', 'decrypt']);
    let filesInIPFS = await fetchPathFromTextile(jsonDoc.filePath, false);
    let fileInIPFS = filesInIPFS;
    let ivarr = []
    for(let i of Object.keys(jsonDoc.iv)){ 
      ivarr[i] = jsonDoc.iv[i]
    }
    const iv = new Uint8Array(ivarr);
    console.log('MATCH FILE LENGTH', fileInIPFS.byteLength)
    const fileAsBuffer = await crypto.subtle.decrypt({
      name: "AES-CBC",
      length: 256,
      iv: iv
    }, decryptionKey, fileInIPFS);
    

    console.log('DECRYPT', fileAsBuffer);
    
  }