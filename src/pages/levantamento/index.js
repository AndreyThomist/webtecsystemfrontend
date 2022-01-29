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
  Textarea,
} from "@chakra-ui/react";
import "./style.css";
import DataTable from "react-data-table-component";
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";

const Levantamentos = () => {
  const toast = useToast();
  const nameRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  ///////
  //user
  //userId
  //cargo
  //cargoId
  //setor
  //setorId
  //levantamentos
  //levantamentoId
  //treinamentos
  //requisitantes
  //requisitanteId
  //supervisores
  //supervisorId
  //rhs
  //rhId
  //objetivos
  //observacoes
  //data_requistante
  //data_supervisor
  //data_rh
  //requisitos

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [cargoId, setCargoId] = useState([]);
  const [setores, setSetores] = useState([]);
  const [setorId, setSetorId] = useState([]);
  const [levantamentos, setLevantamentos] = useState([]);
  const [levantamentoId, setLevantamentoId] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);
  const [requisitantes, setRequisitantes] = useState([]);
  const [requisitanteId, setRequisitanteId] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [supervisorId, setSupervisorId] = useState([]);
  const [rhs, setRhs] = useState([]);
  const [rhId, setRhId] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [observacoes, setObservacoes] = useState([]);
  const [data_requistante, setData_requistante] = useState([]);
  const [data_supervisor, setData_supervisor] = useState([]);
  const [data_rh, setData_rh] = useState([]);
  const [requisitos, setRequisitos] = useState([]);

  const [edit, setEditMode] = useState(false);

  ////
  const [currentEdit, setCurrentEdit] = useState(null);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchLevantamentos = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}levantamentos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const levantamentos = await response.json();
    const responseCargos = await fetch(`${baseUrl.baseUrl}cargos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const cargos = await responseCargos.json();
    const responseSetores = await fetch(`${baseUrl.baseUrl}setores`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const setores = await responseSetores.json();
    const responseTreinamentos = await fetch(`${baseUrl.baseUrl}treinamentos`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const treinamentos = await responseTreinamentos.json();

    const responseUsers = await fetch(`${baseUrl.baseUrl}users`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const users = await responseUsers.json();

    for(let i = 0; i < levantamentos.length; i++){
      for(let j = 0; j < cargos.length; j++){
        if(levantamentos[i].cargoId === cargos[j].id){
          levantamentos[i].cargo = cargos[j].nome;
        }
      }
      for(let j = 0; j < setores.length; j++){
        if(levantamentos[i].setorId === setores[j].id){
          levantamentos[i].setor = setores[j].nome;
        }
      }
    }
    


    setLevantamentos(levantamentos);
    setCargos(cargos);
    setSetores(setores);
    setTreinamentos(treinamentos);
    setUsers(users);
    setRequisitantes(users);
    setSupervisores(users);
    setRhs(users);
  }, []);
  useEffect(() => {
    fetchLevantamentos().then(() => {});
  }, [fetchLevantamentos]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}levantamentos`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        requisitanteId,
        supervisorId,
        rhId,
        objetivos,
        observacoes,
        data_requistante,
        data_supervisor,
        data_rh,
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
        title: "Avaliação",
        description: "Avaliação criada com sucesso",
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
    nameRef.current.value = "";
    await fetchLevantamentos();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(
      `${baseUrl.baseUrl}levantamentos/${currentEdit.id}`,
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
    await fetchLevantamentos();
  };
  const editHandler = (record) => {
    nameRef.current.value = record.name;
    setCurrentEdit(record);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(
      `${baseUrl.baseUrl}levantamentos/${currentEdit.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          userId,
          requisitanteId,
          supervisorId,
          rhId,
          objetivos,
          observacoes,
          data_requistante,
          data_supervisor,
          data_rh,
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
        title: "Avalição",
        description: "Avaliação atualizada com sucesso",
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

    nameRef.current.value = null;
    setCurrentEdit(null);
    setEditMode(false);
    await fetchLevantamentos();
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },

    {
      name: "Nome do Participante",
      selector: (row) => (row.user ? row.user.name : "Não informado"),
    },
    {
      name: "Cargo",
      selector: (row) => (row.cargo ? row.cargo : "Não informado"),
    },
    {
      name: "Setor",
      selector: (row) => (row.setor ? row.setor : "Não informado"),
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
                    Deletar Avaliação
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
              <Heading>Cadastrar Avaliações</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={insertHandler}>
                <FormControl>
                  <FormLabel>Nome do Participante</FormLabel>
                  <Select
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>

                  <FormLabel>Setor</FormLabel>
                  <Select
                    value={setorId}
                    onChange={(e) => {
                      setSetorId(e.target.value);
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
                  <FormLabel>Cargo</FormLabel>
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
                  <FormLabel>Objetivos</FormLabel>
                  <Textarea
                    name="objetivos"
                    value={objetivos}
                    onChange={(e) => setObjetivos(e.target.value)}
                  />
                  <FormLabel>Observações</FormLabel>
                  <Textarea
                    name="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                  <FormLabel>Data do Requistante</FormLabel>
                  <input
                    type="date"
                    name="data_requistante"
                    value={data_requistante}
                    onChange={(e) => setData_requistante(e.target.value)}
                  />
                  <FormLabel>Data do Supervisor</FormLabel>
                  <input
                    type="date"
                    name="data_supervisor"
                    value={data_supervisor}
                    onChange={(e) => setData_supervisor(e.target.value)}
                  />
                  <FormLabel>Data do RH</FormLabel>
                  <input
                    type="date"
                    name="data_rh"
                    value={data_rh}
                    onChange={(e) => setData_rh(e.target.value)}
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

export { Levantamentos };
