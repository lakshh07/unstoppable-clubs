import React, { useState } from "react";
import {
  Heading,
  Box,
  Text,
  Stack,
  Button,
  Center,
  Image,
} from "@chakra-ui/react";

const fileList = [
  {
    id: "1",
    name: "New Text Document.txt",
    title: "Tarzan and the Golden Lion",
    description:
      "Tarzan and the Golden Lion is an adventure novel by American writer Edgar Rice Burroughs, the ninth in his series of twenty-four books about the title character Tarzan.",
  },
  {
    id: "2",
    name: "Adventure.pdf",
    title: "The Adventures of Sherlock Holmes",
    description:
      "The Adventures of Sherlock Holmes is a collection of twelve short stories by Arthur Conan Doyle, first published on 14 October 1892.",
  },
];

export default function SocialProfileSimple({ contractProvider }) {
  const [usersArray, setUsersArray] = useState([]);
  const array = [];
  React.useEffect(() => {
    async function init() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const numFiles = await contractProvider.filesNum(account[0]);
      for (var i = 0; i < numFiles.toString(); i++) {
        const usersFile = await contractProvider.files(account[0], i);
        array.push({
          id: usersFile.fileId.toString(),
          title: usersFile.fileTitle,
          description: usersFile.fileDescription,
          name: usersFile.fileName,
        });
      }
      setUsersArray(array);
    }
    // init();
  }, []);

  return (
    <div className="cards">
      {fileList.map((list) => {
        return (
          <div className="cards__item" key={list.id}>
            <Center p={4} m={4}>
              <Box
                w={"270px"}
                // w={"full"}
                bg="whiteAlpha.800"
                boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
                rounded={"md"}
                overflow={"hidden"}
              >
                <div className="container">
                  <Image
                    h={"120px"}
                    w={"full"}
                    src={
                      "https://image.shutterstock.com/image-photo/data-encryption-security-code-on-600w-1391149517.jpg"
                    }
                    objectFit={"cover"}
                  />

                  <div className="container__overlay">
                    <span>{list.name}</span>
                  </div>
                </div>

                <Box p={6}>
                  <Stack spacing={4} align={"center"} mb={6}>
                    <Heading
                      fontSize={"2xl"}
                      textAlign={"center"}
                      fontWeight={500}
                      fontFamily={"body"}
                    >
                      {list.title}
                    </Heading>
                    <Text color={"gray.500"} textAlign={"justify"}>
                      {list.description}
                    </Text>
                  </Stack>
                  <Button
                    w={"full"}
                    mt={5}
                    bg="gray.900"
                    color={"white"}
                    rounded={"md"}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            </Center>
          </div>
        );
      })}
    </div>
  );
}
