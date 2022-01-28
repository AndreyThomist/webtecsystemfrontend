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
  Select,
  AlertDialogContent,
  AlertDialog,
} from "@chakra-ui/react";
import "./style.css";
import DataTable from "react-data-table-component";
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";

const Users = () => {
  const toast = useToast();
  const nameRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [users, setusers] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [setor, setSetor] = useState(null);
  const [cargo, setCargo] = useState(null);
  const [admin, setAdmin] = useState(null);

  const adminRef = useRef();
  const cargoRef = useRef();
  const setorRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchusers = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}users`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const users = await response.json();

    const response2 = await fetch(`${baseUrl.baseUrl}cargos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const cargos = await response2.json();

    const response3 = await fetch(`${baseUrl.baseUrl}setores`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const setores = await response3.json();
    setusers(users);
    setCargos(cargos);
    setSetores(setores);
  }, []);
  useEffect(() => {
    fetchusers().then(() => {});
  }, [fetchusers]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}users`, {
      method: "POST",
      body: JSON.stringify({
        name,
        setorId: setor,
        cargoId: cargo,
        password,
        admin,
        email,
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
        title: "Usuários",
        description: "Usuário criado com sucesso",
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
    setName(null);
    setEmail(null);
    setCargo(null);
    setSetor(null);
    setPassword(null);
    setAdmin(null);
    nameRef.current.value = null;
    emailRef.current.value = null;
    setorRef.current.value = null;
    cargoRef.current.value = null;
    passwordRef.current.value = null;
    adminRef.current.value = null;
    await fetchusers();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(`${baseUrl.baseUrl}users/${currentEdit.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setCurrentEdit(null);
    await fetchusers();
  };
  const editHandler = (record) => {
    setName(record.name);
    setEmail(record.email);
    setCargo(record.cargo == undefined ? "" : record.cargo.id);
    setSetor(record.setor == undefined ? "" : record.setor.id);
    setAdmin(record.admin);
    nameRef.current.value = record.name;
    emailRef.current.value = record.email;
    cargoRef.current.value = record.cargo == undefined ? "" : record.cargo.id;
    setorRef.current.value = record.setor == undefined ? "" : record.setor.id;
    adminRef.current.value = record.admin == true ? 1 : 0;
    setCurrentEdit(record);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(`${baseUrl.baseUrl}users/${currentEdit.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        setorId: setor,
        cargoId: cargo,
        admin,
        password,
        email,
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
        title: "Usuário",
        description: "Usuário atualizado com sucesso",
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
    setName(null);
    setEmail(null);
    setCargo(null);
    setSetor(null);
    setPassword(null);
    setAdmin(null);
    nameRef.current.value = null;
    emailRef.current.value = null;
    setorRef.current.value = null;
    cargoRef.current.value = null;
    adminRef.current.value = null;
    passwordRef.current.value = null;
    setCurrentEdit(null);
    setEditMode(false);
    await fetchusers();
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Admin",
      selector: (row) => (row.admin == true ? 1 : 2),
    },
    {
      name: "Cargo",
      selector: (row) => (row.cargo != undefined ? row.cargo.name : "Nenhum"),
    },
    {
      name: "Setor",
      selector: (row) => (row.setor != undefined ? row.setor.name : "Nenhum"),
    },
    {
      name: "Data de criação",
      selector: (row) => row.createdAt,
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
              bg={"red"}
              onClick={() => {
                setCurrentEdit(record);
                setIsOpen(true);
              }}
            >
              Excluir
            </Button>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Deletar CA
                  </AlertDialogHeader>
                  <AlertDialogBody>Você tem certeza?</AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
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
              <Heading>Cadastrar Usuários</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    ref={nameRef}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    isRequired={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    ref={emailRef}
                    type={"email"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    isRequired={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    ref={passwordRef}
                    type={"password"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>É admin</FormLabel>
                  <Select
                    onChange={(e) => {
                      setAdmin(e.target.value);
                    }}
                    isRequired={true}
                    ref={adminRef}
                  >
                    <option value="0" selected={admin == false}>
                      Não
                    </option>
                    <option value="1" selected={admin == true}>
                      Sim
                    </option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Cargos</FormLabel>
                  <Select
                    onChange={(e) => {
                      setCargo(e.target.value);
                    }}
                    ref={cargoRef}
                  >
                    <option>Selecione o cargo</option>
                    {cargos.map((cargo) => {
                      return (
                        <option key={cargo.id} value={cargo.id}>
                          {cargo.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Setor</FormLabel>
                  <Select
                    onChange={(e) => {
                      setSetor(e.target.value);
                    }}
                    ref={setorRef}
                  >
                    <option>Selecione o setor</option>
                    {setores.map((setor) => {
                      return (
                        <option key={setor.id} value={setor.id}>
                          {setor.name}
                        </option>
                      );
                    })}
                  </Select>
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
        <DataTable data={users} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { Users };
