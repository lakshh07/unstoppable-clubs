import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import {
  Flex,
  Heading,
  Avatar,
  Text,
  Icon,
  Button,
  useDisclosure,
  Tag,
  TagLabel,
  Box,
} from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { BsFiles } from "react-icons/bs";
import svgAvatarGenerator from "../utils/avatar";
import Usercard from "./Usercard";
import Files from "./Files";
import CreateFile from "./Createfile";
import CreateClub from "./CreateClub";
import { encryptBuffer, hexToBytes, bytesToHex, createDocFromMembersList, decryptUsingMetamask } from '../utils/utils';
import GraphiQL from "graphiql";



export default function Dashboard({
  currentAccount,
  provider,
  signer,
  clubService,
  graphService,
  textileService,
  clubAddress,
  clubName,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avatar, setAvatar] = useState(undefined);
  const [showCC, setShowCC ] = useState(false);
  const [clubPosts, setClubPosts ] = useState([]);
  const [allClubs, setAllClubs ] = useState([]);
  let { user } = useParams();

  useEffect(async () => {
    let svg = svgAvatarGenerator(currentAccount, { dataUri: true });
    setAvatar(svg);
  }, [currentAccount, user]);

  useEffect(async () => {
    if(clubAddress) {
       const clubp = await graphService.fetchPostsForClub(clubAddress);
       setClubPosts(clubp);
    }
  }, [clubAddress])

  useEffect(async () => {
      const clubs = await graphService.fetchAllClubsOfMember(currentAccount);
      setAllClubs(clubs);
  }, [currentAccount]);

  const onCreateClub = async (memberPriceInEth, clubName, totalMembers) => {
    const lockAddress = await clubService.createClub(memberPriceInEth, clubName, totalMembers);
    return lockAddress;
  }

  const publishPostFlow = async (fileObject, fileName) => {
    const fileBuffer = await fileObject.arrayBuffer();
    const encryptedBuffer = await encryptBuffer(fileBuffer);
    
    const uploadedStatus  = await textileService.uploadToTextile(encryptedBuffer.encryptedData,`${clubName}/${fileName}`);
    const members = await graphService.fetchMembersOfClub(clubAddress);
    console.log('UPLOADED TO TEXTIE', uploadedStatus);
    const arrayBuffer = await crypto.subtle.exportKey("raw",encryptedBuffer.encryptionKey);
    const ekeyhex = bytesToHex(new Uint8Array(arrayBuffer));
    
    const jsonDoc = createDocFromMembersList(members, ekeyhex);
    jsonDoc['iv'] = encryptedBuffer.iv;
    console.log("MATCH HEX", encryptedBuffer.iv);
    jsonDoc['filePath'] = `${clubName}/${fileName}`
    const jsonDocPath = `${clubName}/${fileName}_md`;
    const finalPath = await textileService.uploadJson(jsonDoc, jsonDocPath);
    console.log('JSON FILE UPLOAED ', finalPath);
    const postId = await clubService.publishOnChain(clubAddress, fileName, jsonDocPath);
    return postId;
  }

  const fetchPostFlow = async (jsonDocPath) => {

    const jsonDocStr = await textileService.fetchPathFromTextile(jsonDocPath)
    const jsonDoc = JSON.parse(jsonDocStr);
    if(!jsonDoc['memberAccess'][currentAccount])  {
      alert('YOU ARE NOT A MEMBER');
      return false;
    }
    console.log('JSON RECOVERED',jsonDoc);
    const strToDecrypt = jsonDoc['memberAccess'][currentAccount];
    const encryptionKeyHex = await decryptUsingMetamask(strToDecrypt);
    let decryptionKey = new Uint8Array(hexToBytes(encryptionKeyHex)).buffer;
    decryptionKey = await crypto.subtle.importKey('raw', decryptionKey, { 'name': 'AES-CBC', 'length': 256 }, true, ['encrypt', 'decrypt']);
    let filesInIPFS = await textileService.fetchPathFromTextile(jsonDoc.filePath, false);
    let fileInIPFS = filesInIPFS;
    let ivarr = []
    for(let i of Object.keys(jsonDoc.iv)){ 
      ivarr[i] = jsonDoc.iv[i]
    }
    const iv = new Uint8Array(ivarr);
    const fileAsBuffer = await crypto.subtle.decrypt({
      name: "AES-CBC",
      length: 256,
      iv: iv
    }, decryptionKey, fileInIPFS);
    
    return fileAsBuffer;
    
  }

  return (
    <Flex
      h={[null, null, "100vh"]}
      maxW="2000px"
      flexDir={["column", "column", "row"]}
      overflow="hidden"
    >
      {/* Column 1 */}
      <Flex
        className="gradient"
        w={["100%", "100%", "20%", "20%", "20%"]}
        flexDir="column"
        alignItems="center"
        color="#111"
      >
        <Flex
          flexDir="column"
          h={[null, null, "100vh"]}
          justifyContent="space-between"
        >
          <Flex flexDir="column" as="nav">
            <Heading
              mt={50}
              ml={5}
              mb={[25, 50, 100]}
              fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
              alignSelf="center"
              letterSpacing="tight"
            >
              {" "}
              <Link to="/">Unstoppable Clubs.</Link>
            </Heading>

            <Flex
              flexDir={["row", "row", "column", "column", "column"]}
              align={["center", "center", "center", "center", "center"]}
              wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
              justifyContent="center"
            >
              {" "}
              <Route exact path={["/clubs", "/allclubs"]}>
                <Link to="/clubs">
                  <Flex p={10} className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                    <Icon
                      as={FiUsers}
                      display={["none", "none", "flex", "flex", "flex"]}
                      fontSize="2xl"
                      color="gray.700"
                    />
                    <Text
                      display={["flex", "flex", "none", "flex", "flex"]}
                      color="gray.900"
                    >
                      Your Clubs
                    </Text>
                  </Flex>
                </Link>
                <Link to="/allclubs">
                  <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                    <Icon
                      as={FiUsers}
                      display={["none", "none", "flex", "flex", "flex"]}
                      fontSize="2xl"
                      color="gray.700"
                    />

                    <Text
                      display={["flex", "flex", "none", "flex", "flex"]}
                      color="gray.900"
                    >
                      Browse Clubs
                    </Text>
                  </Flex>
                </Link>
              </Route>
              <Route exact path="/dashboard">
                {clubPosts.length > 0 ? (
                  <div>
                    <Button
                      align="center"
                      colorScheme="whiteAlpha"
                      onClick={onOpen}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                    >
                      Create New Post
                    </Button>
                  </div>
                ) : null}
                <CreateFile
                  publishPostFlow={publishPostFlow}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              </Route>
              <Route exact path="/:user/files">
                <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                  <Icon
                    as={BsFiles}
                    display={["none", "none", "flex", "flex", "flex"]}
                    fontSize="2xl"
                    color="gray.700"
                  />
                  <Text
                    display={["flex", "flex", "none", "flex", "flex"]}
                    color="gray.900"
                  >
                    Files
                  </Text>
                </Flex>
              </Route>
            </Flex>
          </Flex>
          <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
            <Avatar
              my={2}
              p={2}
              src={avatar}
              icon={<AiOutlineUser fontSize="1.5rem" />}
            />
            <Tag size="sm" textAlign="center" bg="rgba(255, 255, 255, 0.219)">
              <TagLabel color="white">{`${currentAccount.substr(
                0,
                6
              )}...${currentAccount.substr(-4)}`}</TagLabel>
            </Tag>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        w={["100%", "100%", "95%", "85%"]}
        p="2%"
        flexDir="column"
        overflow="auto"
        minH="100vh"
      >
        <Flex p="0 5px" alignItems="center" justifyContent="space-between">
          <Heading fontWeight="normal" mb={4} letterSpacing="tight">
            <Route exact path="/dashboard">
              {clubName} -  {clubAddress}
            </Route>
            <Route exact path="/clubs">
              Your Clubs
            </Route>
            <Route exact path="/allclubs">
              All Clubs
            </Route>
            <Route exact path="/:user/files">
              {user}'s Files
            </Route>
          </Heading>
        </Flex>
        <Switch>
          <Route exact path="/allclubs">
            <div className="cards">
              {allClubs.map((list, index) => {
                return (
                  <Usercard
                    key={index}
                    clubName={list.name}
                    clubPrice={list.price}
                  />
                );
              })}
            </div>
          </Route>
          <Route exact path="/clubs">
            {/* {map with array of clubs of members with props} */}
            <div className="cards">
              {allClubs.map((list, index) => {
                return (
                  <Usercard
                    key={index}
                    clubName={list.name}
                    clubPrice={list.price}
                  />
                );
              })}
            </div>
          </Route>
          <Route exact path="/:user/files">
            <div className="cards">
              {/* {map with array of clubs of members with props} */}
              <Files />
            </div>
          </Route>
          <Route exact path="/dashboard">
          <div style={{ width: 780, margin: "auto", paddingBottom: 64 }}>
          <div style={{ margin: 32, height: 400, border: "1px solid #888888", textAlign: "left" }}>
            <GraphiQL fetcher={graphService.fetcher} docExplorerOpen query={`{}`} />
          </div>
          </div>
          { !clubAddress ? <Button colorScheme="blue" onClick={() => {
            setShowCC(true);
          }
          }>Create Club</Button>:null}
           <CreateClub isOpen={showCC}
            createClub={onCreateClub}
            onClose={() => { setShowCC(false);}}
           ></CreateClub>

            {clubPosts.length > 0 ? (
              <div className="cards">
                {/* {map with array of clubs of members with props} */}
                {clubPosts.map((cp) => <Files key={cp.filepath} fileName={cp.filepath} filePath={cp.filepath} decryptFile={async () => {
                   return await fetchPostFlow(cp.filepath);
                }}/>)}
              </div>
            ) : (
              <Flex
                justifyContent="center"
                align="center"
                mb="auto"
                mt="7%"
                alignItems="center"
              >
                <Box
                  rounded="md"
                  bg="whitesmoke"
                  w="2xl"
                  minH="40vh"
                  alignItems="center"
                >
                  <Flex
                    justifyContent="center"
                    align="center"
                    flexDirection="column"
                  >
                    <Heading as="h2" p={5} m={7}>
                      Start Uploading Your Content !
                    </Heading>
                    <Button
                      align="center"
                      bg={"gray.900"}
                      color={"white"}
                      onClick={onOpen}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                    >
                      Create New File
                    </Button>
                  </Flex>{" "}
                </Box>
              </Flex>
            )}
          </Route>
        </Switch>
      </Flex>
    </Flex>
  );
}
