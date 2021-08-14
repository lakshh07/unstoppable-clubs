import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  chakra,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VisuallyHidden,
  useColorModeValue,
  Textarea,
  Badge,
  Icon,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillFileAdd } from "react-icons/ai";
import Checker from "./Checker";

export default function CreateFile({ isOpen, onClose, publishPostFlow }) {
  const toast = useToast();
  const [transactionLoading, setTransactionLoading] = useState(false);

  const [{ name, file }, setFile] = useState({
    name: <Icon as={AiFillFileAdd} />,
    file: "",
  });
  const [newFile, setNewFile] = useState({
    title: "",
    description: "",
  });

  const changeLoading = () => {
    setTransactionLoading(true);
  };

  const createFile = async () => {
    changeLoading();
    const uploadStatus = await publishPostFlow(
      file,
      name,
      "0xDF51b83D026DFcA0F3141e76D2D882e5FB29138f",
      "Sandy"
    );
    if (uploadStatus) {
      setTransactionLoading(false);
      toast({
        position: "top-right",
        title: "Transaction Successfull!",
        description: `New File is uploaded`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setTransactionLoading(false);
      toast({
        position: "top-right",
        title: "Transaction Failed!",
        description: "Unable to create file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setNewFile({ title: "", description: "" });
    setFile({ name: <Icon as={AiFillFileAdd} />, file: "" });
    // setInterval(() => {
    //   window.location.reload();
    // }, 5000);
  };

  const updateField = (e) => {
    setNewFile({
      ...newFile,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFile({
        file: e.target.files[0],
        name: e.target.files[0].name,
      });
    }
  };
  return (
    <>
      <Checker transactionLoading={transactionLoading} />
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload New File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            <chakra.form
              shadow="base"
              rounded={[null, "md"]}
              overflow={{ sm: "hidden" }}
            >
              <Stack
                px={3}
                py={5}
                bg={useColorModeValue("white", "gray.700")}
                spacing={6}
                p={{ sm: 6 }}
              >
                <FormControl isRequired>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Name
                  </FormLabel>
                  <InputGroup size="sm">
                    <Input
                      type="text"
                      isRequired={true}
                      placeholder="Title of your creation"
                      focusBorderColor="gray.700"
                      rounded="md"
                      name="title"
                      value={newFile.title}
                      onChange={updateField}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Content File
                  </FormLabel>
                  <Flex alignItems="center" mt={1}>
                    <Badge m={0}>{name}</Badge>
                    <chakra.label
                      cursor="pointer"
                      rounded="md"
                      fontSize="md"
                      ml={5}
                      size="sm"
                      fontWeight="medium"
                      color={useColorModeValue("brand.600", "brand.200")}
                      pos="relative"
                      _hover={{
                        color: useColorModeValue("brand.400", "brand.300"),
                      }}
                    >
                      <span>Upload a file</span>
                      <VisuallyHidden>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="*"
                          onChange={handleFile}
                        />
                      </VisuallyHidden>
                    </chakra.label>
                  </Flex>
                </FormControl>
              </Stack>
            </chakra.form>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={(event) => {
                onClose();
                createFile();
              }}
              bg="blue.900"
              color={"white"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              mr={3}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
