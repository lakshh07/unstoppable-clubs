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
} from "@chakra-ui/react";
import { AiFillFileAdd } from "react-icons/ai";

export default function CreateFile({ isOpen, onClose, contractSigner }) {
  const toast = useToast();
  const [{ name, file }, setFile] = useState({
    name: <Icon as={AiFillFileAdd} />,
    file: "",
  });
  const [newFile, setNewFile] = useState({
    title: "",
    description: "",
  });

  const createFile = async () => {
    const transaction = await contractSigner.upload(
      // newFile.name,
      "txt",
      newFile.description,
      newFile.title,
      "asfg"
    );
    const { status } = await transaction.wait();
    {
      status === 1
        ? toast({
            position: "top-right",
            title: "Transaction Successfull!",
            description: `New File is uploaded`,
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        : toast({
            position: "top-right",
            title: "Transaction Failed!",
            description: "Unable to create file.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
    }
    setInterval(() => {
      window.location.reload();
    }, 5000);
  };

  const updateField = (e) => {
    setNewFile({
      ...newFile,
      [e.target.name]: e.target.value,
    });
  };
  console.log(newFile.title);

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
              // method="POST"
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
                    Title
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
                <div>
                  <FormControl id="email" mt={1}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Description
                    </FormLabel>
                    <Textarea
                      placeholder="Describe what your piece is (max 250 characters)"
                      mt={1}
                      rows={3}
                      shadow="sm"
                      name="description"
                      focusBorderColor="gray.700"
                      fontSize={{ sm: "sm" }}
                      value={newFile.description}
                      onChange={updateField}
                    />
                  </FormControl>
                </div>
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
              bg="blue.900"
              color={"white"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={createFile}
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
