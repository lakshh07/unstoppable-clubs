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
import CreateUser from "./CreateClub";
import CreateFile from "./Createfile";

export default function Dashboard({
  publishPostFlow,
  subscribeToClub,
  currentAccount,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avatar, setAvatar] = useState(undefined);
  const [filesAvailable, setFilesAvailable] = useState(false);
  let { user } = useParams();

  useEffect(() => {
    let svg = svgAvatarGenerator(currentAccount, { dataUri: true });
    setAvatar(svg);
  }, [currentAccount, user]);

  const userList = [
    {
      id: "1",
      profileImg:
        "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
      name: "Lindsey James",
      description: "Musician, PM for work inquires or me in your posts",
      amount: "5",
    },
    {
      id: "2",
      profileImg:
        "https://preview.redd.it/ebdrp8c79nk61.jpg?width=640&crop=smart&auto=webp&s=b5a600b4173eba4cf98cef644f320d351ee279c6",
      name: "Soraya Naomi",
      description: "Model",
      amount: "10",
    },
    {
      id: "3",
      profileImg:
        "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
      name: "Lindsey James",
      description: "Musician, PM for work inquires or me in your posts",
      amount: "5",
    },
    {
      id: "4",
      profileImg:
        "https://preview.redd.it/ebdrp8c79nk61.jpg?width=640&crop=smart&auto=webp&s=b5a600b4173eba4cf98cef644f320d351ee279c6",
      name: "Soraya Naomi",
      description: "Model",
      amount: "10",
    },
  ];

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
                {filesAvailable ? (
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
                      Create New File
                    </Button>
                    <CreateFile
                      publishPostFlow={publishPostFlow}
                      isOpen={isOpen}
                      onClose={onClose}
                    />
                  </div>
                ) : null}
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
              Your Files
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
              {userList.map((list, index) => {
                return (
                  <Usercard
                    key={index}
                    clubName={list.name}
                    clubPrice={list.price}
                    subscribeToClub={subscribeToClub}
                  />
                );
              })}
            </div>
          </Route>
          <Route exact path="/clubs">
            {/* {map with array of clubs of members with props} */}
            <div className="cards">
              {userList.map((list, index) => {
                return (
                  <Usercard
                    key={index}
                    clubName={list.name}
                    clubPrice={list.price}
                    subscribeToClub={subscribeToClub}
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
            {filesAvailable ? (
              <div className="cards">
                {/* {map with array of clubs of members with props} */}
                <Files />
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
