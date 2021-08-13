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

function App() {
  const [currentAccount, setCurrentAccount] = useState("0x0000");
  const [chainId, setChainId] = useState();

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
    return buck;
  }

  //unlock
  // async function initWC() {
  //   const wc = new WalletService({
  //     1337: {
  //       provider: "http://127.0.0.1:7545",
  //       unlockAddress: config.unlockAddress,
  //     },
  //   });
  //   await wc.connect(provider);
  //   console.log(wc);
  //   return wc;
  // }

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
      { data: "hello" },
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

  // const encryptBuffer = async (data) => {
  //   const iv = crypto.getRandomValues(new Uint8Array(16));
  //   const encryptionKey = await crypto.subtle.generateKey(
  //     { name: "AES-CBC", length: 256 },
  //     false,
  //     ["encrypt", "decrypt"]
  //   );
  //   const encryptedData = await crypto.subtle.encrypt(
  //     { name: "AES-CBC", iv },
  //     encryptionKey,
  //     data
  //   );
  //   return {
  //     encryptionKey,
  //     encryptedData,
  //     iv,
  //   };
  // };

  // const uploadToTextile = async (bufferData, name) => {
  //   const raw = await buckets.pushPath(config.bucketKey, name, {
  //     path: name,
  //     content: bufferData,
  //   });
  //   return raw;
  // };

  const testEncryptedUpload = async (fileToUpload) => {
    // const fileBuffer = await fileToUpload.arrayBuffer();
    // const encryptedBuffer = await encryptBuffer(fileBuffer);
    // const uploadedStatus = await uploadToTextile(
    //   encryptedBuffer.encryptedData,
    //   "encryptedFile"
    // );
    // console.log("HANLDE UPLOAD ENC", uploadedStatus);
    // return uploadedStatus;
  };

  // const createClub = async (
  //   walletService,
  //   memberPriceInEth,
  //   clubName,
  //   totalMembers
  // ) => {
  //   const lockAddress = await walletService.createLock({
  //     maxNumberOfKeys: totalMembers,
  //     name: clubName,
  //     expirationDuration: 12121311,
  //     keyPrice: memberPriceInEth,
  //   });
  //   return lockAddress;
  // };

  // const subscribeToClub = async (lockAddress) => {
  //   const transactionHash = await walletService.purchaseKey(
  //     {
  //       lockAddress: "0x05d4a6a76111E2A2785657f993681d5cba534E5a",
  //     },
  //     (error, hash) => {
  //       alert("tx", hash);
  //     }
  //   );
  //   alert(`key purchased ${transactionHash}`);
  //   return transactionHash;
  // };

  const testClubCreation = async () => {
    // const la = await createClub("0.01", "MyClub " + Math.random(), 100);
    // const th = await subscribeToClub(la);
    // console.log("ALL DONE", la, th);
  };

  return (
    <ChakraProvider>
      <Router>
        {currentAccount === undefined ? (
          window.location.reload()
        ) : window.ethereum === undefined ? (
          <Alert status="error" justifyContent="center">
            <AlertIcon />
            <AlertTitle mr={2}>Metamask Not Installed!</AlertTitle>
            <AlertDescription>Please Install Metamask.</AlertDescription>
          </Alert>
        ) : (
          <>
            {currentAccount === "0x0000" ? (
              <Alert status="error" justifyContent="center">
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
              <Alert status="error" justifyContent="center">
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
            testClubCreation={testClubCreation}
            currentAccount={currentAccount}
          />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard
            testEncryptedUpload={testEncryptedUpload}
            currentAccount={currentAccount}
          />
        </Route>
        <Route exact path="/:user/files">
          <Dashboard currentAccount={currentAccount} />
        </Route>
        <Route exact path="/clubs">
          <Dashboard currentAccount={currentAccount} />
        </Route>
      </Router>
    </ChakraProvider>
  );
}

export default App;
