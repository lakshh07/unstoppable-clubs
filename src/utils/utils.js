import {encrypt as ethSigEncrypt} from 'eth-sig-util';
import { utils } from "ethers";
import { Buffer } from 'buffer';


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

import config from '../config'

const ethereum = window.ethereum;

 
//buckets textile





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
    const pubKey = await ethereum.request({'method': 'eth_getEncryptionPublicKey','params': [ethereum.selectedAddress]});
    return pubKey;
  }

  const encryptWithPubKey = (pubkey, str) => {
    const encryptedData = ethSigEncrypt(pubkey, {data: str },'x25519-xsalsa20-poly1305');
    console.log('encryptWithPubKey',pubkey, str, encryptedData);
    return encryptedData;
  }


  const decryptUsingMetamask = async (encryptedStr, accountAddress) => {
    if(!accountAddress){
      accountAddress = ethereum.selectedAddress;
    }
    const plainText = await ethereum.request({
        'method':'eth_decrypt',
        'params': [encryptedStr, accountAddress]
    });
    return plainText;
  }

  const createDocFromMembersList = (members, secretKey) => {
    const finalDoc = {};
    finalDoc['memberAccess'] = {};
    for(let m of members) {
      const memberHash = hexlifyStr(encryptWithPubKey(m.pubkey, secretKey));
      console.log('MemberHash after hexlify', memberHash);
      finalDoc['memberAccess'][m.address] = memberHash;
    }
    return finalDoc;
}


  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const hexlifyStr = (jsonObj) => {
    const jsonStr = JSON.stringify(jsonObj);
    const strToHex = Buffer.from(jsonStr);
    const finalHex = utils.hexlify(strToHex);
    return finalHex;
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

  const testUploadJson = async (ts) => {
    await ts.uploadJson({'key': ['val1','val2', Math.random().toString() ]},'jsondoc');
    await sleep(1000);
    const docs = await ts.fetchPathFromTextile('jsondoc');
    alert(docs[0]);
  }

//fileobject
  const testEncryptedUpload = async (ts, fileToUpload) => {
    const fileBuffer = await fileToUpload.arrayBuffer();
    const encryptedBuffer = await encryptBuffer(fileBuffer);
    const uploadedStatus  = await ts.uploadToTextile(encryptedBuffer.encryptedData,'encryptedFile');
    console.log('HANLDE UPLOAD ENC', uploadedStatus);
    return uploadedStatus;
  }


  export {
    getPubKeyFromMetamask, mergeUint8Arr, encryptBuffer, createDocFromMembersList, bytesToHex, decryptUsingMetamask, hexToBytes
  }