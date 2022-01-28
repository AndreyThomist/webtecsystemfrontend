import React, { useState, useContext } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { AuthContext } from "../../helpers/AuthProvider";
import { useNavigate } from "react-router-dom";

import "./style.css";

const Login = (props) => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    await auth.loginHandler(email, password);
    navigate("/");
  };

  return (
    <div className="container">
      <SimpleGrid columns={2} spacing={10}>
        <Box p={5} borderRadius="lg" bg={"white"}>
          <Box textAlign="center">
            <Heading>Login</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={login}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  isRequired={true}
                  type="email"
                  placeholder="usuario@test.com"
                />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Password</FormLabel>
                <Input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  isRequired={true}
                  type="password"
                  placeholder="*******"
                />
              </FormControl>
              <Button colorScheme={"teal"} width="full" mt={4} type="submit">
                Log-in
              </Button>
            </form>
          </Box>
        </Box>
      </SimpleGrid>
    </div>
  );
};

export { Login };
