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
// import { ethers } from "ethers";

export default function Signup({ createClub, isOpen, onClose }) {
  const toast = useToast();
  const [{ alt, src }, setImg] = useState({
    src: "",
    alt: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    description: "",
    price: "",
    totalMembers: 100
  });
  const onCreateClicked = async () => {
    const la = await createClub(newUser.price, newUser.name, newUser.totalMembers);
    console.log(la);
    {
      la
        ? toast({
            position: "top-right",
            title: "Transaction Successfull!",
            description: `${newUser.name} created with address ${la}`,
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
    setNewUser({ name: "", description: "", price: "" });
    setImg({ src: "", alt: "" });
    // setInterval(() => {
    //   window.location.reload();
    // }, 5000);
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
                    Club Name
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
                  <InputGroup>
                    <InputLeftAddon children="Total Members" color="gray.500" />
                    <NumberInput min={0} w="100%" focusBorderColor="gray.700">
                      <NumberInputField
                        placeholder="total members allowed"
                        value={newUser.totalMembers}
                        name="totalMembers"
                        onChange={updateField}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
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
              mr={3}
              onClick={async (event) => {

                await onCreateClicked();
                onClose();

              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
