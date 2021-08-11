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
import { ethers } from "ethers";
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

  return (
    <ChakraProvider>
      <Router>
        {/* {currentAccount === undefined ? (
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
                  onClick={getCurrentAccount}
                  cursor="pointer"
                >
                  Connect Wallet
                </Tag>
              </AlertDescription>
            </Alert>
          ) : chainId === "137" || chainId === "80001" ? null : (
            <Alert status="error" justifyContent="center">
              <AlertIcon />
              <AlertTitle mr={2}>Network Not Supported!</AlertTitle>
              <AlertDescription>
                Please Switch to Polygon Testnet or Mainnet.
              </AlertDescription>
            </Alert>
          )}
        </>
      )} */}
        <Route exact path="/">
          <Hero />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard currentAccount={currentAccount} />
        </Route>
        <Route exact path="/users/files">
          <Dashboard currentAccount={currentAccount} />
        </Route>
        <Route exact path="/users">
          <Dashboard currentAccount={currentAccount} />
        </Route>
      </Router>
    </ChakraProvider>
  );
}

export default App;
