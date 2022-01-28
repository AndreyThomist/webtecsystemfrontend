import React, { useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { DrawerComponent } from "./drawer";

const Navbar = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => {
    setOpenDrawer(!openDrawer)
  };

  return (
    <>
      <DrawerComponent openDrawer={openDrawer}  />
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={6}
        bg="#00BCD4"
        color="white"
        {...props}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"tighter"}>
            WebTecSystem
          </Heading>
        </Flex>
        {window.location.href.split('/')[3] === 'login' ? null : <Box onClick={handleToggle} >
          <HamburgerIcon />
        </Box>}
        
      </Flex>
    </>
  );
};

export { Navbar };
