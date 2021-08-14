import React, { useState } from "react";
import { Heading, Box, Center, Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Files({ fileName }) {
  return (
    <div className="cards">
      <div className="cards__item">
        <Center p={4} m={4}>
          <Box
            w={"250px"}
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
                <Flex flexDirection="column">
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
                    fontSize={"sm"}
                    rounded={"full"}
                    bg={"gray.900"}
                    color={"white"}
                    mt={4}
                    // mb={}
                    boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    View
                  </Button>
                </Flex>
              </div>
            </div>
          </Box>
        </Center>
      </div>
    </div>
  );
}
