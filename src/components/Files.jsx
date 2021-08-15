import React, { useState } from "react";
import {
  Heading,
  Box,
  Center,
  Button,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { Buffer } from "buffer";

export default function Files({ fileName, filePath, decryptFile }) {
  const [decryptedContent, setDecryptedContent] = useState();
  const [fileType, setFileType] = useState("encrypted");
  const onDecryptClicked = async () => {
    const fileBuffer = await decryptFile();
    const fileextention = fileName.slice(-6, -3);
    if (fileextention == "png") {
      const base64image = Buffer.from(fileBuffer).toString("base64");
      setDecryptedContent(base64image);
      setFileType("image");
    } else if (fileextention == "txt") {
      setDecryptedContent(new TextDecoder().decode(fileBuffer));
      setFileType("text");
    } else {
      setFileType("undisplay");
      setDecryptedContent(fileBuffer);
    }
  };
  return (
    <div className="cards">
      <div className="cards__item">
        <Center p={4} m={4}>
          {fileType == "encrypted" ? (
            <Box
              minW={"400px"}
              h={"150px"}
              // w={"full"}
              bg="whiteAlpha.800"
              boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
              rounded={"md"}
              overflow={"hidden"}
            >
              <div className="container">
                <div className="fileImg"></div>
                <div className="container__overlay">
                  <Flex flexDirection="column" alignItems="center">
                    <Heading
                      fontSize={"3xl"}
                      textAlign={"center"}
                      fontWeight={500}
                      fontFamily={"body"}
                      // p={4}
                    >
                      {fileName}
                    </Heading>
                    <Button
                      p={5}
                      fontSize={"sm"}
                      rounded={"full"}
                      bg={"gray.900"}
                      color={"white"}
                      align="center"
                      mt={4}
                      // mb={}
                      boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      onClick={onDecryptClicked}
                    >
                      View
                    </Button>
                  </Flex>
                </div>
              </div>
            </Box>
          ) : (
            <Box
              minW={"400px"}
              h={"150px"}
              // w={"full"}
              bg="whiteAlpha.800"
              boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
              rounded={"md"}
              overflow={"hidden"}
            >
              <Flex flexDirection="column" alignItems="center">
                <Text p={5} mb={2}>
                  {fileName}
                </Text>
                {decryptedContent && fileType == "image" ? (
                  <Image
                    src={`data:image/png;base64,${decryptedContent}`}
                  ></Image>
                ) : null}
                {decryptedContent && fileType == "text" ? (
                  <Text>{decryptedContent}</Text>
                ) : null}
                {decryptedContent && fileType == "undisplay" ? (
                  <Text>{"Not able to display this file"}</Text>
                ) : null}
              </Flex>
            </Box>
          )}
        </Center>
      </div>
    </div>
  );
}
