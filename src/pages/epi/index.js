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
} from "@chakra-ui/react";
import "./style.css";
import DataTable from "react-data-table-component";
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";

const Epi = () => {
  const toast = useToast();
  const nameRef = useRef();
  const caRef = useRef();
  const validityRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);
  const [ca, setSa] = useState(null);
  const [CAs, setCAs] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [validity, setValidity] = useState(null);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchCAs = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}epis`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const CAs = await response.json();
    setCAs(CAs);
  }, []);
  useEffect(() => {
    fetchCAs().then(() => {});
  }, [fetchCAs]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}epis`, {
      method: "POST",
      body: JSON.stringify({
        name,
        ca,
        validity,
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
        title: "EPI",
        description: "EPI criado com sucesso",
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
    nameRef.current.value = "";
    caRef.current.value = "";
    validityRef.current.value = "";
    await fetchCAs();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(`${baseUrl.baseUrl}epis/${currentEdit.id}`, {
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
    await fetchCAs();
  };
  const editHandler = (record) => {
    setName(record.name);
    nameRef.current.value = record.name;
    caRef.current.value = record.ca;
    validityRef.current.value = record.validity.split('T')[0]
    setCurrentEdit(record);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(`${baseUrl.baseUrl}epis/${currentEdit.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        ca,
        validity,
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
        title: "CA",
        description: "CA atualizado com sucesso",
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
    nameRef.current.value = null;
    validityRef.current.value = null;
    caRef.current.value = null;
    setCurrentEdit(null);
    setEditMode(false);
    await fetchCAs();
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Name",
      selector: (row) => row.ca,
    },
    {
      name: "Descrição",
      selector: (row) => row.name,
    },
    {
      name: "Validade",
      selector: (row) => row.validity,
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
              <Heading>Cadastrar EPI</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>CA</FormLabel>
                  <Input
                    type={"number"}
                    ref={caRef}
                    onChange={(e) => {
                      setSa(e.target.value);
                    }}
                    isRequired={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Input
                    ref={nameRef}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    isRequired={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Validade</FormLabel>
                  <Input
                    type={"date"}
                    ref={validityRef}
                    onChange={(e) => {
                      setValidity(e.target.value);
                    }}
                    isRequired={true}
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
        <DataTable data={CAs} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { Epi };
