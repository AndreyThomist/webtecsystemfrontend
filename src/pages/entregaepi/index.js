import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  Box,
  SimpleGrid,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialog,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import "./style.css";
import DataTable from "react-data-table-component";
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";

const EntregasEpi = () => {
  const toast = useToast();
  const [EstaAberto, setEstaAberto] = useState(false);
  const [EntregasEpi, setEntregasEpi] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [arm, setArm] = useState(null);
  const [reg, setReg] = useState(null);
  const [epis, setEpis] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [devolution, setDevolution] = useState(null);
  const [epiId, setEpiId] = useState(null);
  const [entregaEpiId, setEntregaEpiId] = useState(null);
  const [epiItems, setEpiItems] = useState([]);

  const finalRef = useRef();

  const onClose2 = () => setEstaAberto(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef();

  function fillUserData(id) {
    const foundedUser = users.find((user) => user.id == id);
    if (foundedUser) {
      setUserData({ ...foundedUser });
    } else {
      setUserData(null);
    }
    console.log(foundedUser);
  }

  const insertEpiItemHandler = async (e) => {
    onClose();
    e.preventDefault();
    const response = await fetch(`${baseUrl.baseUrl}entregaepiitens`, {
      method: "POST",
      body: JSON.stringify({
        delivery,
        devolution,
        epiId: epiId,
        entregaEpiId: entregaEpiId,
      }),
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      toast({
        title: "Entrega de epi item",
        description: "Entrega de epi item criado com sucesso",
        status: "success",
        duration: 80000,
        isClosable: true,
      });
    } else {
      toast({
        title: "error",
        duration: 80000,
        isClosable: true,
      });
      return;
    }
    setDevolution('');
    setDelivery('');
    setEpiId
    ('');
    await fetchEntregasEpi();
  };

  const deleteEpiItemHandler = async (id) => {
    if (window.confirm("Deseja deletar")) {
      onClose();
      const response = await fetch(`${baseUrl.baseUrl}entregaepiitens/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("@user:credentials")).token
          }`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Entrega de epi item",
          description: "Entrega de epi item deletado com sucesso",
          status: "success",
          duration: 80000,
          isClosable: true,
        });
      } else {
        toast({
          title: "error",
          duration: 80000,
          isClosable: true,
        });
        return;
      }
    }

    await fetchEntregasEpi();
  };

  const fetchEntregasEpi = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}entregaepis`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const EntregasEpi = await response.json();
    setEntregasEpi(EntregasEpi);

    const response2 = await fetch(`${baseUrl.baseUrl}users`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const users = await response2.json();

    const response3 = await fetch(`${baseUrl.baseUrl}epis`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const epis = await response3.json();
    setUsers(users);
    setEntregasEpi(EntregasEpi);
    setArm(null);
    setReg(null);
    setUser(null);
    setUserData(null);
    setEpis(epis);
  }, []);
  useEffect(() => {
    fetchEntregasEpi().then(() => {});
  }, [fetchEntregasEpi]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}entregaepis`, {
      method: "POST",
      body: JSON.stringify({
        reg,
        arm,
        userId: user,
      }),
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      toast({
        title: "Entrega de epi",
        description: "Entrega de epi criado com sucesso",
        status: "success",
        duration: 80000,
        isClosable: true,
      });
    } else {
      toast({
        title: "error",
        duration: 80000,
        isClosable: true,
      });
      return;
    }
    setArm(null);
    setReg(null);
    setUser(null);
    setUserData(null);
    await fetchEntregasEpi();
  };
  const deleteHandler = async () => {
    onClose2();
    const response = await fetch(
      `${baseUrl.baseUrl}entregaepis/${currentEdit.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("@user:credentials")).token
          }`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    setCurrentEdit(null);
    await fetchEntregasEpi();
  };
  const editHandler = (record) => {
    console.log(record);
    setCurrentEdit(record);
    setArm(record.arm);
    setUser(record.userId);
    const foundedUser = users.find((user) => user.id === record.user.id);
    setUserData({ ...foundedUser });
    setReg(record.reg);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(
      `${baseUrl.baseUrl}entregaepis/${currentEdit.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          reg,
          arm,
          userId: user,
        }),
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("@user:credentials")).token
          }`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.success) {
      toast({
        title: "Entrega de epi",
        description: "Entrega de epi atualizado com sucesso",
        status: "success",
        duration: 80000,
        isClosable: true,
      });
    } else {
      toast({
        title: "error",
        duration: 80000,
        isClosable: true,
      });
      return;
    }
    setCurrentEdit(null);
    setEditMode(false);
    setArm("");
    setReg("");
    setUser("");
    setUserData(null);
    await fetchEntregasEpi();
  };

  let columns2 = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Data Entrega",
      selector: (row) => row.delivery,
    },
    {
      name: "Data de devolução",
      selector: (row) => row.devolution,
    },
    {
      name: "EPI",
      selector: (row) => row.epiId,
    },
    {
      name: "Data de criação",
      selector: (row) => row.createdAt,
    },
    {
      name: "Ações",
      ceil: (record) => {
          return  <Button
              onClick={async () => {
                await deleteEpiItemHandler(record.id);
              }}
            >
              Deletar
            </Button>
            ;
      },
      name: "Ações",
      cell: (record) => {
        return (
          <>
         <Button
          color={"red"}
              onClick={async () => {
                await deleteEpiItemHandler(record.id);
              }}
            >
              Deletar
            </Button>
          </>
        );
      },
    },
  ];

  const columns = [
    {
      name: "Id",
      selector: (row) => row.user.name,
    },
    {
      name: "Data de criação",
      selector: (row) => row.createdAt,
    },
    {
      name: "REG",
      selector: (row) => row.reg,
    },
    {
      name: "ARM",
      selector: (row) => row.arm,
    },
    {
      name: "Ações",
      cell: (record) => {
        return (
          <>
            <Button
              onClick={() => {
                editHandler(record);
              }}
            >
              Editar
            </Button>
            <Button
              color={"white"}
              margin={"2"}
              bg={"purple"}
              onClick={() => {
                console.log(record.id);
                setEntregaEpiId(record.id);
                const epiItems = EntregasEpi.find(
                  (item) => item.id == record.id
                );
                setEpiItems([...epiItems.entregaEpiItens]);
                onOpen();
              }}
            >
              Entrega
              <Modal
                ref={finalRef}
                size={"full"}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Adicionar Item/Remover Item</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={insertEpiItemHandler}>
                      <FormControl>
                        <FormLabel>Data da entrega</FormLabel>
                        <Input
                          value={delivery}
                          onChange={(e) => {
                            setDelivery(e.target.value);
                          }}
                          type={"date"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Data da devolução</FormLabel>
                        <Input
                          value={devolution}
                          onChange={(e) => {
                            setDevolution(e.target.value);
                          }}
                          type={"date"}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Epi</FormLabel>
                        <Select
                          value={epiId}
                          onChange={(e) => {
                            setEpiId(e.target.value);
                          }}
                        >
                          <option>Selecione um epi</option>
                          {epis.map((epi) => {
                            return (
                              <option key={epi.id} value={epi.id}>
                                {epi.name}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <Button
                        colorScheme={"teal"}
                        width="full"
                        mt={4}
                        type="submit"
                      >
                        Cadastrar
                      </Button>
                    </form>

                    <div className="table">
                      <DataTable data={epiItems} columns={columns2}></DataTable>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Button>
            <Button
              color={"white"}
              margin={"2"}
              bg={"red"}
              onClick={() => {
                setCurrentEdit(record);
                setEstaAberto(true);
              }}
            >
              Excluir
            </Button>
            <AlertDialog
              isOpen={EstaAberto}
              leastDestructiveRef={cancelRef}
              onClose={onClose2}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Deletar Entrega de epi
                  </AlertDialogHeader>

                  <AlertDialogBody>Você tem certeza?</AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose2}>
                      Cancelar
                    </Button>
                    <Button colorScheme="red" onClick={deleteHandler} ml={3}>
                      Deletar
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="container">
        <SimpleGrid columns={2}>
          <Box p={5} borderRadius="lg" bg={"white"}>
            <Box textAlign="center">
              <Heading>Cadastrar Entrega de epi</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Funcionários</FormLabel>
                  <Select
                    value={user}
                    onChange={(e) => {
                      setUser(e.target.value);
                      fillUserData(e.target.value);
                    }}
                  >
                    <option>Selecione um funcionário</option>

                    {users.map((user) => {
                      return (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                {userData != null ? (
                  <FormControl>
                    <FormLabel>Setor</FormLabel>
                    <Input disabled={true} value={userData.setor.name} />
                  </FormControl>
                ) : (
                  ""
                )}
                {userData != null ? (
                  <FormControl>
                    <FormLabel>Cargo</FormLabel>
                    <Input disabled={true} value={userData.cargo.name} />
                  </FormControl>
                ) : (
                  ""
                )}
                <FormControl>
                  <FormLabel>ARM</FormLabel>
                  <Input
                    value={arm}
                    onChange={(e) => {
                      setArm(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>REG</FormLabel>
                  <Input
                    value={reg}
                    onChange={(e) => {
                      setReg(e.target.value);
                    }}
                  />
                </FormControl>
                {!edit ? (
                  <Button
                    colorScheme={"teal"}
                    width="full"
                    mt={4}
                    type="submit"
                  >
                    Cadastrar
                  </Button>
                ) : (
                  <Button
                    colorScheme={"green"}
                    width="full"
                    mt={4}
                    type="submit"
                  >
                    Editar
                  </Button>
                )}
              </form>
            </Box>
          </Box>
        </SimpleGrid>
      </div>
      <div className="table">
        <DataTable data={EntregasEpi} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { EntregasEpi };
