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

const Setores = () => {
  const toast = useToast();
  const nameRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);
  const [setores, setsetores] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchSetores = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}setores`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const setores = await response.json();
    setsetores(setores);
  }, []);
  useEffect(() => {
    fetchSetores().then(() => {});
  }, [fetchSetores]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}setores`, {
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
        title: "Setor",
        description: "Setor criado com sucesso",
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
    await fetchSetores();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(`${baseUrl.baseUrl}setores/${currentEdit.id}`, {
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
    await fetchSetores();
  };
  const editHandler = (record) => {
    setName(record.name);
    nameRef.current.value = record.name;
    setCurrentEdit(record);
    setEditMode(true);

  };

  const putEdit = async () => {
    const response = await fetch(`${baseUrl.baseUrl}setores/${currentEdit.id}`, {
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
          title: "Setor",
          description: "Setor atualizado com sucesso",
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
    await fetchSetores();
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
                    Deletar Setor
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
              <Heading>Cadastrar Setor</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Nome do setor</FormLabel>
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
        <DataTable data={setores} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { Setores };
