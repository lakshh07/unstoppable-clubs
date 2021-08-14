import "../App.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Avatar,
  Flex,
  Tag,
  TagLabel,
  Image,
  Heading,
  Stack,
  HStack,
  SimpleGrid,
  Icon,
  Text,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import svgAvatarGenerator from "../utils/avatar";
import { FcAssistant, FcDonate, FcInTransit } from "react-icons/fc";
import image from "../images/20945479.jpg";
import Usercard from "./Usercard";
import CreateUser from "./CreateClub";

export default function Hero({ subscribeToClub, createClub, currentAccount }) {
  const [avatar, setAvatar] = useState(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    let svg = svgAvatarGenerator(currentAccount, { dataUri: true });
    setAvatar(svg);
  }, [currentAccount]);

  const Feature = ({ icon, title, text }) => {
    return (
      <Stack align="center">
        <Flex
          w={16}
          h={16}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"full"}
          bg={"gray.100"}
          mb={1}
        >
          {icon}
        </Flex>
        <Text fontWeight={600}>{title}</Text>
        <Text color={"gray.600"}>{text}</Text>
      </Stack>
    );
  };
  return (
    <div className="hero">
      <Flex
        h={20}
        w="100%"
        align="center"
        alignItems={"center"}
        pt={10}
        // alignItems="baseline"
        justifyContent={"space-between"}
        pl={40}
        pr={20}
        className="Header"
      >
        <HStack>{/*  FOR LOGO  */}</HStack>
        <div className="headercomp" align="center">
          {/* {if/else between two buttons for club owner and club subscriber} */}
          <Link to="/dashboard">
            <Button colorScheme="blue">Dashboard</Button>
          </Link>
          <Link to="/clubs">
            <Button ml={5} colorScheme="blue">
              Your Clubs
            </Button>
          </Link>
          <Tag
            size="sm"
            zIndex="99"
            pt={1}
            pb={1}
            ml={3}
            mr={2}
            background="rgba(255, 255, 255, 0.1)"
          >
            <TagLabel color="rgba(245,245,245)">
              {`${currentAccount.substr(0, 6)}...${currentAccount.substr(-4)}`}
            </TagLabel>
            <Avatar
              borderStyle="solid"
              borderColor="blue"
              borderWidth="2px"
              padding="1px"
              ml={4}
              size="sm"
              bg="transparent"
              src={avatar}
            />
          </Tag>
        </div>
      </Flex>
      <Flex
        align="center"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "row" }}
        wrap="no-wrap"
        minH="90vh"
        px={20}
        mt={-4}
      >
        <Stack
          spacing={4}
          w={{ base: "80%", md: "40%" }}
          align={["center", "center", "flex-start", "flex-start"]}
        >
          <Heading
            as="h1"
            fontSize="6vw"
            fontWeight="bold"
            color="primary.800"
            textAlign={["center", "center", "left", "left"]}
          >
            Unstoppable Clubs
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="primary.800"
            opacity="0.8"
            fontWeight="normal"
            lineHeight={1.5}
            textAlign={["center", "center", "left", "left"]}
          >
            This is the subheader section where you describe the basic benefits
            of your product
          </Heading>
          <div>
            <Button colorScheme="blue" onClick={onOpen}>
              Join Now
            </Button>
            <CreateUser
              createClub={createClub}
              isOpen={isOpen}
              onClose={onClose}
            />
          </div>
        </Stack>
        <Box
          w={{ base: "90%", sm: "60%", md: "50%" }}
          zIndex="999"
          mb={{ base: 12, md: 0 }}
        >
          <Image
            src={image}
            size="100%"
            rounded="1rem"
            boxShadow={
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
            }
          />
        </Box>
      </Flex>

      <Box p={10} m={10} mt="5% ">
        <Heading
          fontWeight={600}
          align="center"
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          p="20"
        >
          We Are Different
        </Heading>
        <SimpleGrid align="center" columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={<Icon as={FcAssistant} w={10} h={10} />}
            title={"Lifetime Support"}
            text={
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            }
          />
          <Feature
            icon={<Icon as={FcDonate} w={10} h={10} />}
            title={"Unlimited Donations"}
            text={
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            }
          />
          <Feature
            icon={<Icon as={FcInTransit} w={10} h={10} />}
            title={"Instant Delivery"}
            text={
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            }
          />
        </SimpleGrid>
      </Box>

      <Flex align="center" justifyContent="center">
        <Box
          mt="8%"
          maxW="1200px"
          minH="100vh"
          className="gradient"
          rounded="1rem"
          boxShadow={
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
          }
        >
          <Heading
            fontWeight={600}
            align="center"
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
            p="10"
          >
            Clubs
          </Heading>
          <Flex justify-content="center" mr="10px">
            <div className="cards">
              {/* {map with array of all clubs with props} */}
              <Usercard subscribeToClub={subscribeToClub} />
            </div>
          </Flex>
        </Box>
      </Flex>

      <div className="footer">
        <Box p={4} mt="10%" className="foot">
          <Container as={Stack} maxW={"4xl"} py={10}>
            <SimpleGrid
              templateColumns={{ sm: "1fr 1fr", md: "2fr 2fr " }}
              spacing={6}
            >
              <Stack spacing={4}>
                <Box>
                  <Text mt={2} fontSize="2xl" fontWeight="800">
                    Unstoppable
                    <br />
                    Clubs
                  </Text>
                </Box>
              </Stack>
              <Stack align={"flex-start"}>
                <Box>
                  <Text fontSize="20px" fontWeight="600">
                    Created By
                  </Text>
                </Box>
                <Text fontSize="15px">
                  Crypto enthusiasts: Mohit Jandwani & Lakshay Maini
                </Text>
                <Text fontSize="15px">
                  FUD (Fake UI Designer): Priya Jandwani
                </Text>
              </Stack>
            </SimpleGrid>
          </Container>
        </Box>
      </div>
    </div>
  );
}
