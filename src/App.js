import "./App.css";
import {
  ChakraProvider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tag,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers, utils } from "ethers";
import { Buffer } from "buffer";
import { WalletService } from "@unlock-protocol/unlock-js";
import { Buckets, encrypt } from "@textile/hub";
import { encrypt as ethSigEncrypt } from "eth-sig-util";
import Dashboard from "./components/Dashboard";
import Hero from "./components/Hero";
import { EPERM } from "constants";

function App() {
  const [currentAccount, setCurrentAccount] = useState("0x0000");
  const [chainId, setChainId] = useState();
  const [walletService, setWalletService] = useState();
  const [buckets, setBuckets] = useState();

  const getCurrentAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(ethers.utils.getAddress(accounts[0]));
  };

  useEffect(() => {
    if (window.ethereum && currentAccount) {
      setChainId(window.ethereum.networkVersion);

      window.ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(ethers.utils.getAddress(accounts[0]));
        // window.location.reload();
      });

      window.ethereum.on("chainChanged", (newChainId) => {
        setChainId(newChainId);
        window.location.reload();
      });
    }

    initBucket();
    initWC();
  }, [currentAccount]);

  const config = {
    unlockAddress: "0xedAd98625A255183B68A34c6363F6470BfD2812A",
    provider: "http://127.0.0.1:7545",
    threadID: "bafkzubtwkd4qhlodrzjwvsw6wbfhpugtxbkr33txn7fcqsii233tshi",
    bucketKey: "bafzbeibbklbg5ab4j7kwzk3jvc7h5k644hkdc6f6f26o73qh4g7plqudsm",
    bucketAuth: {
      key: "b3xj7rjlhffdpc42lzz7slden4a",
      secret: "bvyxyvavrpsili77jufjyyffxqba6nc2mhv5gv6y",
    },
  };

  async function initBucket() {
    const buck = await Buckets.withKeyInfo(config.bucketAuth, { debug: true });
    await buck.withThread(config.threadID);

    setBuckets(buck);
    return buck;
  }

  //unlock
  async function initWC() {
    const wc = new WalletService({
      1337: {
        provider: "http://127.0.0.1:7545",
        unlockAddress: config.unlockAddress,
      },
    });
    const ep = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545", {
      chainId: 1337,
    });
    await wc.connect(ep);
    // console.log(wc);
    setWalletService(wc);
    return wc;
  }

  const getPubKeyFromMetamask = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const pubKey = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [window.ethereum.selectedAddress],
    });
    return pubKey;
  };

  const decryptUsingMetamask = async (encryptedStr) => {
    console.log("decryptUsingMetamask", encryptedStr);
    const plainText = await window.ethereum.request({
      method: "eth_decrypt",
      params: [encryptedStr, window.ethereum.selectedAddress],
    });
    return plainText;
  };

  const encryptWithPubKey = async (pubkey, str) => {
    const encryptedData = ethSigEncrypt(
      pubkey,
      { data: str },
      "x25519-xsalsa20-poly1305"
    );
    return encryptedData;
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const hexlifyStr = (str) => {
    return utils.hexlify(Buffer.from(JSON.stringify(str)));
  };

  const testEncryption = async () => {
    const pubkey = await getPubKeyFromMetamask();
    console.log("getPubKeyFromMetamask", pubkey);
    const ed = await encryptWithPubKey(pubkey);
    console.log("encryptWithPubKey", ed);
    const hexStr = hexlifyStr(ed);
    console.log("hexlifyStr", hexStr);
    //put this string in json doc
    await sleep(3000);
    const finalTest = await decryptUsingMetamask(hexStr);
    console.log("decryptUsingMetamask", finalTest);
    // spt(finalTest);
  };

  const encryptBuffer = async (data) => {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encryptionKey = await crypto.subtle.generateKey(
      { name: "AES-CBC", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      encryptionKey,
      data
    );
    return {
      encryptionKey,
      encryptedData,
      iv,
    };
  };

  const fetchPathFromTextile = async (fileName, asString = true) => {
    const files = [];
    const repeater = await buckets.pullPath(
      "bafzbeibbklbg5ab4j7kwzk3jvc7h5k644hkdc6f6f26o73qh4g7plqudsm",
      fileName
    );
    for await (let i of repeater) {
      if (i instanceof Uint8Array) {
        files.push(i);
      }
    }
    let result = mergeUint8Arr(files);
    if (asString) {
      result = new TextDecoder().decode(result);
    }
    return result;
  };

  const mergeUint8Arr = (myArrays) => {
    let length = 0;
    myArrays.forEach((item) => {
      length += item.length;
    });
    let mergedArray = new Uint8Array(length);
    let offset = 0;
    myArrays.forEach((item) => {
      mergedArray.set(item, offset);
      offset += item.length;
    });
    return mergedArray;
  };

  const subscribeToClub = async (lockAddress, pubkey) => {
    const transactionHash = await walletService.purchaseKey(
      {
        lockAddress: lockAddress,
        data: Buffer.from(pubkey),
      },
      (error, hash) => {
        alert("tx", hash);
      }
    );
    alert(`key purchased ${transactionHash}`);
    return transactionHash;
  };

  const uploadToTextile = async (bufferData, name) => {
    const raw = await buckets.pushPath(config.bucketKey, name, {
      path: name,
      content: bufferData,
    });
    return raw;
  };

  const uploadJson = async (jsonDoc, docPath) => {
    const jsonBuffer = Buffer.from(JSON.stringify(jsonDoc));
    const uploadedFile = await uploadToTextile(jsonBuffer, docPath);
    console.log(uploadedFile);
    return uploadedFile;
  };

  const createDocFromMembersList = (members, secretKey) => {
    const finalDoc = {};
    finalDoc["memberAccess"] = {};
    for (let m of members) {
      const memberHash = hexlifyStr(encryptWithPubKey(m.pubkey, secretKey));
      finalDoc["memberAccess"][m.address] = memberHash;
    }
    return finalDoc;
  };

  function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
      var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xf).toString(16));
    }
    return hex.join("");
  }

  const publishPostFlow = async (
    fileObject,
    fileName,
    clubAddress,
    clubName
  ) => {
    const fileBuffer = await fileObject.arrayBuffer();
    const encryptedBuffer = await encryptBuffer(fileBuffer);
    console.log("MATCH FILE LENGTH", encryptedBuffer.encryptedData.byteLength);
    const uploadedStatus = await uploadToTextile(
      encryptedBuffer.encryptedData,
      `${clubName}/${fileName}`
    );
    // const members = await fetchMembers();
    const members = [
      {
        address: "0xDF51b83D026DFcA0F3141e76D2D882e5FB29138f",
        pubkey: "J8d5OaGl/N7jCS0KGtwNCqDWJlmVE/JzcDYAf+47E3w=",
      },
    ];

    const arrayBuffer = await crypto.subtle.exportKey(
      "raw",
      encryptedBuffer.encryptionKey
    );
    const ekeyhex = bytesToHex(new Uint8Array(arrayBuffer));

    const jsonDoc = createDocFromMembersList(members, ekeyhex);
    jsonDoc["iv"] = encryptedBuffer.iv;
    console.log("MATCH HEX", encryptedBuffer.iv);
    jsonDoc["filePath"] = `${clubName}/${fileName}`;
    const jsonDocPath = `${clubName}/${fileName}_md`;
    const file = await uploadJson(jsonDoc, jsonDocPath);
    return file;
    // const PostContract = require("../contracts/hardhat_contracts.json")["1337"][
    //   "localhost"
    // ]["contracts"]["PublicLockPosts"];
    // const contract = new ethers.Contract(
    //   PostContract.address,
    //   PostContract.abi,
    //   signer
    // );
    // const postId = await contract.publishPost(
    //   clubAddress,
    //   `${fileName},${jsonDocPath}`
    // );
    // return postId;
  };

  const createClub = async (
    walletService,
    memberPriceInEth,
    clubName,
    totalMembers
  ) => {
    const lockAddress = await walletService.createLock({
      maxNumberOfKeys: totalMembers,
      name: clubName,
      expirationDuration: 12121311,
      keyPrice: memberPriceInEth,
    });
    return lockAddress;
  };

  function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  const fetchAllClubs = async () => {
    return await graphQLFetcher({
      query: `
          locks(first: 25) {
            id
            name
            price
          }
        `,
    }).then((data) => {
      return data.data.locks;
    });
  };

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
        `,
    }).then((data) => {
      return data.data.posts;
    });
  };

  // const fetchAllClubsOfMember = async (memberAddress) => {
  //   return await graphQLFetcher({
  //     query: `
  //         posts(first: 25, where:{lock: {id: ${clubAddress}}}) {
  //           id
  //           sender
  //           description
  //           filepath
  //           createdAt
  //         }
  //       `,
  //   }).then((data) => {
  //     return data.data.posts;
  //   });
  // };

  const graphQLFetcher = (graphQLParams) => {
    // console.log("GRAPH QL FETCHER", graphQLParams);
    // return fetch(props.subgraphUri, {
    //   method: "post",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(graphQLParams),
    // }).then((response) => response.json());
  };

  const fetchPostFlow = async (clubAddress, clubName) => {
    // const myAddress = await ethereum.request({ method: "eth_requestAccounts" });
    // const PostContract = require("../contracts/hardhat_contracts.json")["1337"][
    //   "localhost"
    // ]["contracts"]["PublicLockPosts"];
    // const contract = new ethers.Contract(
    //   PostContract.address,
    //   PostContract.abi,
    //   signer
    // );
    // const postURI = await contract.lastTokenURI();
    // const jsonDocPath = postURI.split(",")[1];
    // const jsonDocStr = await fetchPathFromTextile(jsonDocPath);
    // const jsonDoc = JSON.parse(jsonDocStr);
    // const strToDecrypt = jsonDoc["memberAccess"][myAddress[0]];
    // const encryptionKeyHex = await decryptUsingMetamask(strToDecrypt);
    // let decryptionKey = new Uint8Array(hexToBytes(encryptionKeyHex)).buffer;
    // decryptionKey = await crypto.subtle.importKey(
    //   "raw",
    //   decryptionKey,
    //   { name: "AES-CBC", length: 256 },
    //   true,
    //   ["encrypt", "decrypt"]
    // );
    // let filesInIPFS = await fetchPathFromTextile(jsonDoc.filePath, false);
    // let fileInIPFS = filesInIPFS;
    // let ivarr = [];
    // for (let i of Object.keys(jsonDoc.iv)) {
    //   ivarr[i] = jsonDoc.iv[i];
    // }
    // const iv = new Uint8Array(ivarr);
    // console.log("MATCH FILE LENGTH", fileInIPFS.byteLength);
    // const fileAsBuffer = await crypto.subtle.decrypt(
    //   {
    //     name: "AES-CBC",
    //     length: 256,
    //     iv: iv,
    //   },
    //   decryptionKey,
    //   fileInIPFS
    // );
    // console.log("DECRYPT", fileAsBuffer);
  };

  return (
    <ChakraProvider>
      <Router>
        {currentAccount === undefined ? (
          window.location.reload()
        ) : window.ethereum === undefined ? (
          <Alert status="warning" justifyContent="center" position="absolute">
            <AlertIcon />
            <AlertTitle mr={2}>Metamask Not Installed!</AlertTitle>
            <AlertDescription>Please Install Metamask.</AlertDescription>
          </Alert>
        ) : (
          <>
            {currentAccount === "0x0000" ? (
              <Alert status="warning" justifyContent="center" position="absolute" variant="subtle">
                <AlertIcon />
                <AlertTitle mr={2}>Wallet Not Connected!</AlertTitle>
                <AlertDescription>
                  <Tag
                    background="rgba(230, 1, 1,0.08)"
                    onClick={() => {
                      getCurrentAccount();
                      testEncryption();
                    }}
                    cursor="pointer"
                  >
                    Connect Wallet
                  </Tag>
                </AlertDescription>
              </Alert>
            ) : chainId === "137" ||
              chainId === "80001" ||
              chainId === "1337" ? null : (
              <Alert status="warning" justifyContent="center">
                <AlertIcon />
                <AlertTitle mr={2}>Network Not Supported!</AlertTitle>
                <AlertDescription>
                  Please Switch to Polygon Testnet or Mainnet.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
        <Route exact path="/">
          <Hero
            subscribeToClub={subscribeToClub}
            createClub={createClub}
            currentAccount={currentAccount}
          />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard
            publishPostFlow={publishPostFlow}
            currentAccount={currentAccount}
          />
        </Route>
        <Route exact path="/:user/files">
          <Dashboard currentAccount={currentAccount} />
        </Route>
        <Route exact path="/clubs">
          <Dashboard
            subscribeToClub={subscribeToClub}
            currentAccount={currentAccount}
          />
        </Route>
      </Router>
    </ChakraProvider>
  );
}

export default App;
