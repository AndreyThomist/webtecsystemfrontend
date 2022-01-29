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

const Avaliacoes = () => {
  const toast = useToast();
  const nameRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  ///////
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [name, setName] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [cargoId, setCargoId] = useState([]);

  const [setores, setSetores] = useState([]);
  const [setorId, setSetorId] = useState(null);

  const [treinamentos, setTreinamentos] = useState([]);
  //treinamentoId
  //periodo
  //carga
  //userId
  //tipo
  //assunto
  //alcance
  //aplicabilidade
  //tempo
  //desempenho
  //local
  //material
  //organizacao
  //hospedagem
  //evento
  //criticas
  const [treinamentoId, setTreinamentoId] = useState(null);
  const [periodo, setPeriodo] = useState(null);
  const [carga, setCarga] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [assunto, setAssunto] = useState(null);
  const [alcance, setAlcance] = useState(null);
  const [aplicabilidade, setAplicabilidade] = useState(null);
  const [tempo, setTempo] = useState(null);
  const [desempenho, setDesempenho] = useState(null);
  const [local, setLocal] = useState(null);
  const [material, setMaterial] = useState(null);
  const [transporte, setTransporte] = useState(null);
  const [organizacao, setOrganizacao] = useState(null);
  const [hospedagem, setHospedagem] = useState(null);
  const [evento, setEvento] = useState(null);
  const [criticas, setCriticas] = useState(null);
  const [users, setUsers] = useState([]);

  const [edit, setEditMode] = useState(false);

  ////
  const [currentEdit, setCurrentEdit] = useState(null);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const fetchAvaliacoes = useCallback(async () => {
    const response = await fetch(`${baseUrl.baseUrl}avaliacoes`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("@user:credentials")).token
        }`,
      },
    });
    const avaliacoes = await response.json();
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


    setAvaliacoes(avaliacoes);
    setCargos(cargos);
    setSetores(setores);
    setTreinamentos(treinamentos);
    setUsers(users);
  }, []);
  useEffect(() => {
    fetchAvaliacoes().then(() => {});
  }, [fetchAvaliacoes]);

  const insertHandler = async (e) => {
    e.preventDefault();
    if (edit) {
      await putEdit();
      return;
    }
    const response = await fetch(`${baseUrl.baseUrl}avaliacoes`, {
      method: "POST",
      body: JSON.stringify({
        name,
        treinamentoId,
        periodo,
        carga,
        userId,
        tipo,
        assunto,
        alcance,
        aplicabilidade,
        tempo,
        desempenho,
        local,
        material,
        organizacao,
        hospedagem,
        evento,
        criticas,
        transporte,
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
    setName(null);
    nameRef.current.value = "";
    await fetchAvaliacoes();
  };
  const deleteHandler = async () => {
    onClose();
    const response = await fetch(
      `${baseUrl.baseUrl}avaliacoes/${currentEdit.id}`,
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
    await fetchAvaliacoes();
  };
  const editHandler = (record) => {
    setName(record.name);
    nameRef.current.value = record.name;
    setCurrentEdit(record);
    setEditMode(true);
  };

  const putEdit = async () => {
    const response = await fetch(
      `${baseUrl.baseUrl}avaliacoes/${currentEdit.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
          treinamentoId,
          periodo,
          carga,
          userId,
          tipo,
          assunto,
          alcance,
          aplicabilidade,
          tempo,
          desempenho,
          local,
          material,
          organizacao,
          hospedagem,
          evento,
          criticas,
          transporte,
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
    setName(null);
    nameRef.current.value = null;
    setCurrentEdit(null);
    setEditMode(false);
    await fetchAvaliacoes();
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Treinamento",
      selector: (row) => row.treinamento
    },
    {
      name: "Periodo Realização",
      selector: (row) => row.periodo?row.periodo:"Não informado",
    },
    {
      name: "Nome do Participante",
      selector: (row) => row.user?row.user.name:"Não informado",
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo?row.cargo:"Não informado",
    },
    {
      name: "Setor",
      selector: (row) => row.setor?row.setor:"Não informado",
    },
    {
      name: "Tipo",
      selector: (row) => row.tipo?row.tipo:"Não informado",
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
                  <FormLabel>Treinamento</FormLabel>
                  <Select
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
                  ,<FormLabel>Periodo Realização</FormLabel>
                  <Input
                    value={periodo}
                    onChange={(e) => {
                      setPeriodo(e.target.value);
                    }}
                    isRequired={false}
                  />
                  <FormLabel>Carga Horária</FormLabel>
                  <Input
                    value={carga}
                    onChange={(e) => {
                      setCarga(e.target.value);
                    }}
                    isRequired={false}
                  />
                  <FormLabel>Tipo Treinamento</FormLabel>
                  <Select
                    value={tipo}
                    onChange={(e) => {
                      setTipo(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>INTERNO</option>
                    <option value={2}>EXTERNO</option>
                  </Select>
                  <FormLabel>Assunto Abordado</FormLabel>
                  <Select
                    value={assunto}
                    onChange={(e) => {
                      setAssunto(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Alcance dos objetivos</FormLabel>
                  <Select
                    value={alcance}
                    onChange={(e) => {
                      setAlcance(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Aplicabilidade no trabalho atual</FormLabel>
                  <Select
                    value={aplicabilidade}
                    onChange={(e) => {
                      setAplicabilidade(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Tempo de duração do programa</FormLabel>
                  <Select
                    value={tempo}
                    onChange={(e) => {
                      setTempo(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Desempenho dos coordenadores</FormLabel>
                  <Select
                    value={desempenho}
                    onChange={(e) => {
                      setDesempenho(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Local e condições do evento</FormLabel>
                  <Select
                    value={local}
                    onChange={(e) => {
                      setLocal(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Material didático</FormLabel>
                  <Select
                    value={material}
                    onChange={(e) => {
                      setMaterial(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>
                    Organização do evento pela Entidade Externa
                  </FormLabel>
                  <Select
                    value={organizacao}
                    onChange={(e) => {
                      setOrganizacao(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Transporte Utilizado (Quando utilizado)</FormLabel>
                  <Select
                    value={transporte}
                    onChange={(e) => {
                      setTransporte(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Hospedagem (quando utilizada)</FormLabel>
                  <Select
                    value={hospedagem}
                    onChange={(e) => {
                      setHospedagem(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Organização do evento pelo RH</FormLabel>
                  <Select
                    value={evento}
                    onChange={(e) => {
                      setEvento(e.target.value);
                    }}
                  >
                    <option>Selecione uma opção</option>

                    <option value={1}>FRACO</option>
                    <option value={2}>REGULAR</option>
                    <option value={3}>BOM</option>
                    <option value={4}>ÓTIMO</option>
                  </Select>
                  <FormLabel>Críticas e/ou sugestões</FormLabel>
                  <Textarea
                    value={criticas}
                    onChange={(e) => {
                      setCriticas(e.target.value);
                    }}
                    placeholder="Digite suas críticas e/ou sugestões"
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

export { Avaliacoes };
