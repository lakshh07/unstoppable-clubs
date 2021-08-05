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
  InputLeftAddon,
  VisuallyHidden,
  useColorModeValue,
  Textarea,
  Avatar,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { ethers } from "ethers";

export default function Signup({ isOpen, onClose, contractSigner }) {
  const toast = useToast();
  const [{ alt, src }, setImg] = useState({
    src: "",
    alt: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    description: "",
    price: "",
  });
  const createUser = async () => {
    const weiPrice = ethers.utils.parseEther(newUser.price);
    const transaction = await contractSigner.create(
      newUser.name,
      newUser.description,
      weiPrice.toString(),
      "asfg"
    );
    const { status } = await transaction.wait();
    {
      status === 1
        ? toast({
            position: "top-right",
            title: "Transaction Successfull!",
            description: `Welcome ${newUser.name}.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        : toast({
            position: "top-right",
            title: "Transaction Failed!",
            description: "Unable to create user account.",
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
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target.files[0]),
        alt: e.target.files[0].name,
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
          <ModalHeader>Create your account</ModalHeader>
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
                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Full Name
                  </FormLabel>
                  <InputGroup size="sm">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      focusBorderColor="gray.700"
                      rounded="md"
                      value={newUser.name}
                      name="name"
                      onChange={updateField}
                    />
                  </InputGroup>
                </FormControl>
                <div>
                  <FormControl mt={1}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      About
                    </FormLabel>
                    <Textarea
                      placeholder="Describe about yourself."
                      mt={1}
                      rows={3}
                      shadow="sm"
                      focusBorderColor="gray.700"
                      fontSize={{ sm: "sm" }}
                      value={newUser.description}
                      name="description"
                      onChange={updateField}
                    />
                  </FormControl>
                </div>
                <FormControl>
                  <InputGroup>
                    <InputLeftAddon children="MATIC" color="gray.500" />
                    <NumberInput min={0} w="100%" focusBorderColor="gray.700">
                      <NumberInputField
                        placeholder="Enter amount"
                        value={newUser.price}
                        name="price"
                        onChange={updateField}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Profile Picture
                  </FormLabel>
                  <Flex alignItems="center" mt={1}>
                    <Avatar
                      boxSize={16}
                      bg="gray.300"
                      src={src}
                      icon={<AiOutlineUser fontSize="1.5rem" />}
                    />
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
                      <span>Upload Image</span>
                      <VisuallyHidden>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/gif, image/jpeg, image/png"
                          onChange={handleImg}
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
              bg="gray.900"
              color={"white"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              mr={3}
              onClick={createUser}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
