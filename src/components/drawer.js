import React, { useEffect, useContext } from "react";
import {
  Drawer,
  useDisclosure,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  Button,
  MenuItem,
  MenuDivider,
  SimpleGrid,
} from "@chakra-ui/react";
import { AuthContext } from "../helpers/AuthProvider";
import { useNavigate } from "react-router-dom";

const DrawerComponent = (props) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (props.openDrawer) {
      onOpen();
    }
  }, [props.openDrawer]);

  return (
    <>
      <Drawer
        placement={"left"}
        isOpen={isOpen}
        onOverlayClick={() => {
          onClose();
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <SimpleGrid>
              <div className="menu-container">
                <Menu>
                  <MenuButton as={Button} colorScheme="blue">
                    CONFIG
                  </MenuButton>
                  <MenuList>
                    <MenuGroup>
                      <MenuItem
                        onClick={() => {
                          navigate("/users");
                        }}
                      >
                        Usuários
                      </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                  </MenuList>
                </Menu>
              </div>
              <Menu>
                <MenuButton as={Button} colorScheme="blue">
                  Modulo de RH
                </MenuButton>
                <MenuList>
                  <MenuGroup>
                    <MenuItem
                      onClick={() => {
                        navigate("/cargos");
                      }}
                    >
                      CARGO
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/escolaridades");
                      }}
                    >
                      Escolaridade
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/setores");
                      }}
                    >
                      Setor
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/epis");
                      }}
                    >
                      Epi
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/treinamentos");
                      }}
                    >
                      Treinamento/Cursos
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/entregasepi");
                      }}
                    >
                      Entrega de EPI
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/descricaocargos");
                      }}
                    >
                      Descrição de cargos
                    </MenuItem>
                    
                  </MenuGroup>
                  <MenuDivider />
                </MenuList>
              </Menu>
            </SimpleGrid>
          </DrawerBody>
          <Button
            onClick={() => {
              auth.logout();
              onClose();
            }}
            color={"white"}
            backgroundColor={"red"}
          >
            logout
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { DrawerComponent };
