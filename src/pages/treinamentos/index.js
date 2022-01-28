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
} from "@chakra-ui/react";
import "./style.css";
import DataTable from "react-data-table-component";
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";

const Treinamentos = () => {
  const toast = useToast();
  const nameRef = useRef();
  const mesesRef = useRef();
  const mandoryRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);
  const [treinamentos, settreinamentos] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [meses, setMeses] = useState(null);
  const [mandatory, setMandatory] = useState(null);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchtreinamentos = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}treinamentos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const treinamentos = await response.json();
    settreinamentos(treinamentos);
  }, []);
  useEffect(() => {
    fetchtreinamentos().then(() => {});
  }, [fetchtreinamentos]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}treinamentos`, {
      method: "POST",
      body: JSON.stringify({
        name,
        validity: meses,
        mandatory: mandatory,
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
        title: "Treinamento",
        description: "Treinamento criado com sucesso",
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
    setMandatory(null)
    setMeses(null)
    nameRef.current.value = "";
    mesesRef.current.value = "";
    mandoryRef.current.value = "";
    await fetchtreinamentos();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(
      `${baseUrl.baseUrl}treinamentos/${currentEdit.id}`,
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
    await fetchtreinamentos();
  };
  const editHandler = (record) => {
    setName(record.name);
    setMeses(record.validity);
    setMandatory(record.mandatory == true ? 1 : 0);
    nameRef.current.value = record.name;
    mesesRef.current.value = record.validity;
    mandoryRef.current.value = record.mandatory == true ? 1 : 0;
    setCurrentEdit(record);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(
      `${baseUrl.baseUrl}treinamentos/${currentEdit.id}`,
      {
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
      }
    );
    const data = await response.json();
    if (data.success) {
      toast({
        title: "Treinamento",
        description: "Treinamento atualizado com sucesso",
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
    mesesRef.current.value = "";
    mandoryRef.current.value = "";
    setCurrentEdit(null);
    setEditMode(false);
    await fetchtreinamentos();
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
      name: "Tempo de curso(meses)",
      selector: (row) => row.validity,
    },
    {
      name: "Obrigatório",
      selector: (row) => (row.mandatory == true ? "Sim" : "Não"),
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
                    Deletar Treinamento
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
              <Heading>Cadastrar Treinamento</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Nome do Treinamento</FormLabel>
                  <Input
                    ref={nameRef}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    isRequired={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tempo em meses</FormLabel>
                  <Input
                    type={"number"}
                    ref={mesesRef}
                    onChange={(e) => {
                      setMeses(e.target.value);
                    }}
                    isRequired={true}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Obrigatório</FormLabel>
                  <Select
                    ref={mandoryRef}
                    onChange={(e) => {
                      setMandatory(e.target.value);
                    }}
                  >
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
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
        <DataTable data={treinamentos} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { Treinamentos };
