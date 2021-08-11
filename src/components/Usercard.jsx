import {
  Heading,
  Avatar,
  Box,
  Text,
  Stack,
  Button,
  Icon,
  createIcon,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import React, { useState } from "react";
import { Link, Route } from "react-router-dom";
//   import { ethers } from "ethers";

const Arrow = createIcon({
  displayName: "Arrow",
  viewBox: "0 0 72 24",
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});

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
  {
    id: "5",
    profileImg:
      "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
    name: "Lindsey James",
    description: "Musician, PM for work inquires or me in your posts",
    amount: "5",
  },
  {
    id: "6",
    profileImg:
      "https://preview.redd.it/ebdrp8c79nk61.jpg?width=640&crop=smart&auto=webp&s=b5a600b4173eba4cf98cef644f320d351ee279c6",
    name: "Soraya Naomi",
    description: "Model",
    amount: "10",
  },
  {
    id: "7",
    profileImg:
      "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
    name: "Lindsey James",
    description: "Musician, PM for work inquires or me in your posts",
    amount: "5",
  },
  {
    id: "8",
    profileImg:
      "https://preview.redd.it/ebdrp8c79nk61.jpg?width=640&crop=smart&auto=webp&s=b5a600b4173eba4cf98cef644f320d351ee279c6",
    name: "Soraya Naomi",
    description: "Model",
    amount: "10",
  },
];

function SocialProfileSimple({ contractProvider, accountsss }) {
  const [usersArray, setUsersArray] = useState([]);
  const array = [];
  React.useEffect(() => {
    async function init() {
      for (var i = 0; i < accountsss.length; i++) {
        const userList = await contractProvider.creators(i + 1);
        array.push({
          id: userList.creatorId.toString(),
          name: userList.creatorName,
          description: userList.creatorDescription,
          amount: userList.creatorPrice.toString(),
        });
      }
      setUsersArray(array);
    }
    //   init();
  }, [accountsss]);

  return (
    <div className="cards">
      {userList.map((list) => {
        return (
          <div className="cards__item" key={list.id}>
            <Box
              // zIndex="2"
              w={"300px"}
              bg="whiteAlpha.800"
              boxShadow={
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
              }
              rounded={"lg"}
              p={4}
              m={4}
              textAlign={"center"}
            >
              <Avatar
                size={"xl"}
                // src={list.profileImg}/
                icon={<AiOutlineUser fontSize="1.5rem" />}
                alt={"Avatar Alt"}
                mb={4}
                pos={"relative"}
              />
              <Heading fontSize={"2xl"} color="gray.800" fontFamily={"body"}>
                {list.name}
              </Heading>
              <Text textAlign={"center"} color="gray.600" px={3} mt={3}>
                {list.description}
              </Text>
              <Stack
                align={"center"}
                justify={"center"}
                mt={8}
                direction={"row"}
                spacing={4}
              >
                <Route exact path="/">
                  <Text fontSize={"md"} fontFamily={"Caveat"}>
                    Only at 10 Matic/Week
                    {/* Only at {ethers.utils.formatEther(list.amount)} Matic/Week */}
                  </Text>
                  <Button
                    fontSize={"sm"}
                    rounded={"full"}
                    bg={"gray.900"}
                    color={"white"}
                    boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    Subscribe
                  </Button>
                </Route>
                <Route exact path="/users">
                  <Link to={`/${list.name}/files`}>
                    <Button
                      fontSize={"sm"}
                      rounded={"full"}
                      bg={"gray.900"}
                      color={"white"}
                      boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                    >
                      View Files
                    </Button>
                  </Link>
                </Route>
              </Stack>
              <Route exact path="/">
                <Icon
                  as={Arrow}
                  color="gray.600"
                  w={71}
                  right={4}
                  top={"70px"}
                  transform={"rotate(10deg)"}
                />
              </Route>
            </Box>
          </div>
        );
      })}
    </div>
  );
}

export default SocialProfileSimple;
