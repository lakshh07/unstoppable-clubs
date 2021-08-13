import React from "react";
import { Box, Flex, Heading, Spinner, Icon, Image } from "@chakra-ui/react";
import lock from "../images/lock.gif";

export default function CreateFile({ transactionLoading }) {
  return (
    <>
      {transactionLoading ? (
        <Box
          zIndex="999"
          position="fixed"
          top="0"
          left="0"
          bg="rgba(0, 0, 0, 0.4)"
          minW="100%"
          minH="100vh"
          overflow="hidden"
        >
          <Flex
            justifyContent="center"
            align="center"
            mb="auto"
            mt="12%"
            alignItems="center"
          >
            <Box
              rounded="md"
              bg="white"
              w="2xl"
              minH="50vh"
              alignItems="center"
            >
              <Flex
                justifyContent="center"
                align="center"
                flexDirection="column"
              >
                <Image mt={5} src={lock} w="20%" h="20%"></Image>
                <Flex mt={5} alignItems="center" justifyContent="space-evenly">
                  <Heading as="h2" p={5}>
                    Encryping Your File on Textile{" "}
                  </Heading>
                  <Spinner></Spinner>
                </Flex>
              </Flex>{" "}
            </Box>
          </Flex>
        </Box>
      ) : null}
    </>
  );
}
