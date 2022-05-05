import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Header from "../components/Nav";
import api from "../services/api";
import { useSession, getSession } from 'next-auth/client';
import AccessDenied from '../components/accessDenied';
import Nav from '../components/Nav'

export default function Home() {
  const [session, loading] = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);
  const [clients, setClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
  [
    api.get("/clients").then(({ data }) => {
      setClients(data.data);
    }),
  ];
}, [clients]);
  if (typeof window !== 'undefined' && loading) return null;
  if (!session) { return <AccessDenied />; }
  const isValidFormData = () => {
    if (!name) {
      return useToast({
        title: "Inserire il nome",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!email) {
      return useToast({
        title: "Inserire e-mail!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (clients.some((client) => client.email === email && client._id !== id)) {
      return useToast({
        title: "Questo indirizzo mail è già stato registrato",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if (isValidFormData()) return;
    try {
      setIsLoading(true);
      const { data } = await api.post("/clients", { name, email });
      setClients(clients.concat(data.data));
      setName("");
      setEmail("");
      setIsFormOpen(!isFormOpen);
      useToast({
        title: "Registrato con successo",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (_id) => {
    try {
      await api.delete(`/clients/${_id}`);
      toast({
        title: "Eliminato con successo",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlShowUpdateClient = (client) => {
    setId(client._id);
    setName(client.name);
    setEmail(client.email);
    setIsFormOpen(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();

    if (isValidFormData()) return;

    try {
      setIsLoading(true);
      await api.put(`clients/${id}`, { name, email });
      setName("");
      setEmail("");
      setId(null);
      setIsFormOpen(!isFormOpen);

      useToast({
        title: "Modificato con successo",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //const toast = useToast();

  return (
    <Box>
      <Nav/>
      <Flex align="center" justifyContent="center">
        <Box
          width={800}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          p={20}
          mt="25"
        >
          <Flex justifyContent="flex-end">
            <Button
              colorScheme="green"
              onClick={() => setIsFormOpen(!isFormOpen)}
            >
              {isFormOpen ? "-" : "+"}
            </Button>
          </Flex>

          {isFormOpen ? (
            <VStack
              as="form"
              onSubmit={id ? handleUpdateClient : handleSubmitCreateClient}
            >
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  type="text"
                  placeholder="Inserire nome"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Inserire Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </FormControl>

              <Button
                colorScheme="green"
                type="submit"
                mt={6}
                isLoading={isLoading}
              >
                {id ? "Applica modifiche" : "Registra utente"}
              </Button>
            </VStack>
          ) : null}

          <Table variant="simple" mt={6}>
            <Thead bgColor="teal.500">
              <Tr>
                <Th textColor="white">Nome</Th>
                <Th textColor="white">Email</Th>
                <Th textColor="white">Opzioni</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client, index) => (
                <Tr key={index}>
                  <Td>{client.name}</Td>
                  <Td>{client.email}</Td>
                  <Td justifyContent="space-between">
                    <Flex>
                      <Button
                        size="sm"
                        fontSize="small"
                        colorScheme="yellow"
                        mr="2"
                        onClick={() => handlShowUpdateClient(client)}
                      >
                        Modifica
                      </Button>
                      <Button
                        size="sm"
                        fontSize="small"
                        colorScheme="red"
                        mr="2"
                        onClick={() => handleDeleteClient(client._id)}
                      >
                        Elimina
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );

}

    export async function getServerSideProps(context) {
    const session = await getSession(context)

    if(!session){
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }
    
    return {
      props: { session }
    }
  }
