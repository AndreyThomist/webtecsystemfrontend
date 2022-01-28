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
  Select,
  Textarea,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialog,
} from "@chakra-ui/react";
import "./style.css";
import DataTable from "react-data-table-component";
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";

const DescricaoCargo = () => {
  const toast = useToast();
  const nameRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(null);
  const [escolaridades, setEscolaridades] = useState([]);
  const [edit, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [setores, setSetores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [setorId, setsetorId] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [escolaridadeId, setEscolaridadeId] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [descricaoCargos, setDescricaoCargos] = useState([]);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchDescricao = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}escolaridades`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const escolaridades = await response.json();
    setEscolaridades(escolaridades);

    const response4 = await fetch(`${baseUrl.baseUrl}descricaocargos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const descriaoCargos = await response4.json();
    setDescricaoCargos(descriaoCargos);

    const response2 = await fetch(`${baseUrl.baseUrl}setores`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const setores = await response2.json();

    setSetores(setores);

    const response3 = await fetch(`${baseUrl.baseUrl}cargos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const cargos = await response3.json();

    setCargos(cargos);
  }, []);
  useEffect(() => {
    fetchDescricao().then(() => {});
  }, [fetchDescricao]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}descricaocargos`, {
      method: "POST",
      body: JSON.stringify({
        cargoId,
        setorId,
        description,
        experience,
        escolaridadeId,
        experience,
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
        title: "Descricao cargo",
        description: "Descricao cargo criado com sucesso",
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
    setDescription('')
    setExperience('')
    setsetorId('')
    setCargoId('')
    setEscolaridadeId('')
    await fetchDescricao();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(
      `${baseUrl.baseUrl}descricaocargos/${currentEdit.id}`,
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
    await fetchDescricao();
  };
  const editHandler = (record) => {
    setDescription(record.description)
    setExperience(record.experience)
    setsetorId(record.setor.id)
    setCargoId(record.cargo.id)
    setEscolaridadeId(record.escolaridade.id)
    setCurrentEdit(record);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(
      `${baseUrl.baseUrl}descricaocargos/${currentEdit.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          cargoId,
          setorId,
          description,
          experience,
          escolaridadeId,
          experience,
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
        title: "Cargo Descrição",
        description: "Cargo Descrição atualizado com sucesso",
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
    setDescription('')
    setExperience('')
    setsetorId('')
    setCargoId('')
    setEscolaridadeId('')
    setEditMode(false);
    await fetchDescricao();
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Setor",
      selector: (row) => row.setor.name,
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo.name,
    },
    {
        name: "Descrição",
        selector: (row) => row.description,
    },
    {
        name: "Experiência",
        selector: (row) => row.experience,
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
                    Deletar Cargo Descrição
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
              <Heading>Cadastrar Descrição cargo</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Setor</FormLabel>
                  <Select
                    value={setorId}
                    onChange={(e) => {
                      setsetorId(e.target.value);
                    }}
                  >
                    <option>Selecione um setor</option>
                    {setores.map((setor) => {
                      return (
                        <option key={setor.id} value={setor.id}>
                          {setor.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Cargos</FormLabel>
                  <Select
                    value={cargoId}
                    onChange={(e) => {
                      setCargoId(e.target.value);
                    }}
                  >
                    <option>Selecione um cargo</option>
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
                  <FormLabel>Escolaridade</FormLabel>
                  <Select
                    value={escolaridadeId}
                    onChange={(e) => {
                      setEscolaridadeId(e.target.value);
                    }}
                  >
                    <option>Selecione uma escolaridade</option>
                    {escolaridades.map((escolaridade) => {
                      return (
                        <option key={escolaridade.id} value={escolaridade.id}>
                          {escolaridade.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  ></Textarea>
                </FormControl>
                <FormControl>
                  <FormLabel>Experiência (em meses)</FormLabel>
                  <Input
                    value={experience}
                    onChange={(e) => {
                      setExperience(e.target.value);
                    }}
                    type={"number"}
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
        <DataTable data={descricaoCargos} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { DescricaoCargo };
