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
import { Link } from "react-router-dom";

export default function Files({ fileName, fileDescription, fileTitle }) {
  return (
    <div className="cards">
      <div className="cards__item">
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
                <span>{fileName}</span>
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
                  {fileTitle}
                </Heading>
                <Text color={"gray.500"} textAlign={"justify"}>
                  {fileDescription}
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
    </div>
  );
}
