import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  AlertDialogFooter,
  Textarea,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialog,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./style.css";
import Kalend, { CalendarView } from "kalend"; // import component
import "kalend/dist/styles/index.css"; // import styles
import baseUrl from "../../helpers/baseUrl";
import { useToast } from "@chakra-ui/react";
import DataTable from "react-data-table-component";

const PlanosTreinamentoCalendar = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [treinamentos, setTreinamentos] = useState([]);
  const [users, setUsers] = useState([]);
  const [treinamentoId, setTreinamentoId] = useState("");
  const [instrutorId, setInstrutorId] = useState("");
  const [data_treinamento, setDataTreinamento] = useState("");
  const [inicio, setInicio] = useState("");
  const [termino, setTermino] = useState("");
  const [status, setStatus] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [planos, setPlanos] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null);

  const fetchPlanos = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}planos`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const planos = await response.json();

    const events = planos.map((plano) => {
      return {
        id: plano.id,
        startAt: plano.inicio,
        endAt: plano.termino,
        summary: plano.treinamento.name,
        color: "blue",
        calendarID: "work",
      };
    });
    setEvents(events);
    setPlanos([...planos]);
  }, []);

  const fetchTreinamentos = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}treinamentos`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const treinamentos = await response.json();
    setTreinamentos(treinamentos);
  }, []);

  const fetchUsers = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}users`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const users = await response.json();
    setUsers(users);
  }, []);

  useEffect(() => {
    fetchTreinamentos().then(() => {});

    fetchUsers().then(() => {});

    fetchPlanos().then(() => {});
  }, [fetchTreinamentos, fetchTreinamentos, fetchPlanos]);

  const insertPlanoTreinamentoHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl.baseUrl}planos`, {
      method: "POST",
      body: JSON.stringify({
        treinamentoId,
        justificativa,
        instrutorId,
        data_treinamento,
        status,
        inicio,
        termino,
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
        title: "Plano de treinamento",
        description: "plano de treinamento criado com sucesso",
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
    setTreinamentoId("");
    setInstrutorId("");
    setInicio("");
    setTermino("");
    setJustificativa("");
    setDataTreinamento("");
    setStatus("");
    onClose();
    await fetchPlanos();
  };

  const deleteHandler = async (record) => {
    const response = await fetch(`${baseUrl.baseUrl}planos/${record.id}`, {
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
        title: "Plano de treinamento",
        description: "plano de treinamento deletado com sucesso",
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

    await fetchPlanos();
  };

  const objStatus = {
    1: "Agendado",
    2: "Realizado",
    3: "Reagendado",
    4: "Atrasado",
    5: "Cancelado",
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Instrutor",
      selector: (row) => row.instrutor.name,
    },
    {
      name: "Treinamento",
      selector: (row) => row.treinamento.name,
    },
    {
      name: "inicio",
      selector: (row) => row.inicio,
    },
    {
      name: "termino",
      selector: (row) => row.termino,
    },
    {
      name: "status",
      selector: (row) => objStatus[row.status],
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
              color={"white"}
              margin={"2"}
              bg={"red"}
              onClick={async () => {
                if (window.confirm("Deseja deletar?")) {
                  await deleteHandler(record);
                }
              }}
            >
              Excluir
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={insertPlanoTreinamentoHandler}>
          <ModalContent>
            <ModalHeader>Cadastrar Plano De Treinamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Treinamentos</FormLabel>
                <Select
                  required={true}
                  value={treinamentoId}
                  onChange={(e) => {
                    setTreinamentoId(e.target.value);
                  }}
                >
                  <option>Selecione um treinamento</option>
                  {treinamentos.map((treinamento) => {
                    return (
                      <option key={treinamento.id} value={treinamento.id}>
                        {treinamento.name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Instrutor</FormLabel>
                <Select
                  required={true}
                  value={instrutorId}
                  onChange={(e) => {
                    setInstrutorId(e.target.value);
                  }}
                  mt={2}
                >
                  <option>Selecione um usuário</option>
                  {users.map((user) => {
                    return (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Data do treinamento</FormLabel>
                <Input
                  value={data_treinamento}
                  onChange={(e) => {
                    setDataTreinamento(e.target.value);
                  }}
                  required={true}
                  type={"date"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Inicio</FormLabel>
                <Input
                  value={inicio}
                  onChange={(e) => {
                    setInicio(e.target.value);
                  }}
                  required={true}
                  type={"datetime-local"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Termino</FormLabel>
                <Input
                  value={termino}
                  onChange={(e) => {
                    setTermino(e.target.value);
                  }}
                  required={true}
                  type={"datetime-local"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  required={true}
                >
                  <option>Selecione um status</option>
                  <option value="1">Agendado</option>
                  <option value="2">realizado</option>
                  <option value="3">reagendado</option>
                  <option value="4">Atrasado</option>
                  <option value="5">cancelado</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Justificativa</FormLabel>
                <Textarea
                  value={justificativa}
                  onChange={(e) => {
                    setJustificativa(e.target.value);
                  }}
                  required={true}
                ></Textarea>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type={"submit"}>Cadastrar</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      <Box textAlign="center" my={5}>
        <Heading>Calendário de Planos de treinamento</Heading>
      </Box>
      <div className="calendar">
        <Box my={4} bg={"white"} textAlign="left" height={"1000"}>
          
          <Kalend
            events={events}
            timeFormat={"24"}
            weekDayStart={"Monday"}
            language={"en"}
          ></Kalend>
        </Box>
      </div>
      <Flex flexDirection={"row"} justify={"center"}>
        <Button
          onClick={() => {
            onOpen();
          }}
          bg={"teal.500"}
          color={"white"}
        >
          Adicionar Plano de treinamento
        </Button>
      </Flex>

      <div className="table">
        <DataTable data={planos} columns={columns}></DataTable>
      </div>
    </>
  );
};

export { PlanosTreinamentoCalendar };
