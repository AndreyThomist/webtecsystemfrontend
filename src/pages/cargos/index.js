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

const Cargos = () => {
  const toast = useToast();
  const nameRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchCargos = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}cargos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const cargos = await response.json();
    setCargos(cargos);
  }, []);
  useEffect(() => {
    fetchCargos().then(() => {});
  }, [fetchCargos]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}cargos`, {
      method: "POST",
      body: JSON.stringify({
        name,
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
        title: "Cargo",
        description: "Cargo criado com sucesso",
        status: "success",
        duration: 80000,
        isClosable: true,
      });
    }else{
        toast({
            title: "error",
            duration: 80000,
            isClosable: true,
          });
         return;
    }
    setName(null);
    nameRef.current.value = "";
    await fetchCargos();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(`${baseUrl.baseUrl}cargos/${currentEdit.id}`, {
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
    await fetchCargos();
  };
  const editHandler = (record) => {
    setName(record.name);
    nameRef.current.value = record.name;
    setCurrentEdit(record);
    setEditMode(true);

  };

  const putEdit = async () => {
    const response = await fetch(`${baseUrl.baseUrl}cargos/${currentEdit.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
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
          title: "Cargo",
          description: "Cargo atualizado com sucesso",
          status: "success",
          duration: 80000,
          isClosable: true,
        });
      }else{
          toast({
              title: "error",
              duration: 80000,
              isClosable: true,
            });
            return;
      }
    setName(null);
    nameRef.current.value = null;
    setCurrentEdit(null);
    setEditMode(false);
    await fetchCargos();
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
                    Deletar Cargo
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
              <Heading>Cadastrar Cargos</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Nome do cargo</FormLabel>
                  <Input
                    ref={nameRef}
                    onChange={(e) => {
                      setName(e.target.value);
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
        <DataTable data={cargos} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { Cargos };
