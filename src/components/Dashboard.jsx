import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
} from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { BsFiles } from "react-icons/bs";
import svgAvatarGenerator from "../utils/avatar";
import Usercard from "./Usercard";
import Files from "./Files";
import CreateUser from "./Signup";
import CreateFile from "./Createfile";

export default function Dashboard({ currentAccount }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avatar, setAvatar] = useState(undefined);

  useEffect(() => {
    let svg = svgAvatarGenerator(currentAccount, { dataUri: true });
    setAvatar(svg);
  }, [currentAccount]);

  const userName = "carry";

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
              <Route exact path="/users">
                <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                  <Icon
                    as={FiUsers}
                    display={["none", "none", "flex", "flex", "flex"]}
                    fontSize="2xl"
                    color="gray.700"
                  />
                  <Text
                    display={["flex", "flex", "none", "flex", "flex"]}
                    className="active"
                  >
                    Clubs
                  </Text>
                </Flex>
              </Route>
              <Route exact path="./dashboard">
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
                    isOpen={isOpen}
                    //   contractSigner={contractSigner}
                    onClose={onClose}
                  />
                </div>
              </Route>
              <Route exact path="/users/files">
                <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                  <Icon
                    as={BsFiles}
                    display={["none", "none", "flex", "flex", "flex"]}
                    fontSize="2xl"
                    color="gray.700"
                  />
                  <Text
                    display={["flex", "flex", "none", "flex", "flex"]}
                    className="active"
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
        p="3%"
        flexDir="column"
        overflow="auto"
        minH="100vh"
      >
        <Flex p="0 5px" alignItems="center" justifyContent="space-between">
          <Heading fontWeight="normal" mb={4} letterSpacing="tight">
            <Route exact path="/dashboard">
              Your Files
            </Route>
            <Route exact path="/users">
              Your Clubs
            </Route>
            <Route exact path="/users/files">
              User's Files
            </Route>
          </Heading>
        </Flex>
        <Switch>
          <Route exact path="/users">
            <Usercard />
          </Route>
          <Route exact path="/users/files">
            {/* */}
            <Flex align="flex-start">
              <Files userName={userName} />
            </Flex>
          </Route>
        </Switch>
      </Flex>
    </Flex>
  );
}
