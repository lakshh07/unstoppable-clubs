import React, { useState } from "react";
import { Heading, Box, Center } from "@chakra-ui/react";
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
                <Heading
                  fontSize={"2xl"}
                  textAlign={"center"}
                  fontWeight={500}
                  fontFamily={"body"}
                >
                  {fileName}
                </Heading>
              </div>
            </div>
          </Box>
        </Center>
      </div>
    </div>
  );
}
