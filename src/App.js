import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./helpers/AuthProvider";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import {useNavigate} from 'react-router-dom'
import { Navbar } from "./components/navbar";
import { Cargos } from "./pages/cargos";
import {  Escolaridades } from './pages/escolaridades'
import {   Setores  } from './pages/setores'
import { Epi } from "./pages/epi";
import { Users } from "./pages/users";
import { Treinamentos } from "./pages/treinamentos";
import { EntregasEpi } from "./pages/entregaepi";
import { DescricaoCargo } from "./pages/descricaoCargo";


const App = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const result = auth.checkIfIsLoggedIn();
    if(result){
      console.log('entrou')
      navigate('/')
    }else{
      navigate('/login')
    }
  }, []);

  return (
    <>
    <Navbar />
    <Routes>
      <Route
        path="/"
        element={auth.isLoggedIn ? <Home /> : <Navigate to={"/login"} />}
      ></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/cargos"  element={auth.isLoggedIn ? <Cargos /> : <Navigate to={"/login"} />}></Route>
      <Route path="/escolaridades"  element={auth.isLoggedIn ? <Escolaridades /> : <Navigate to={"/login"} />}></Route>
      <Route path="/setores"  element={auth.isLoggedIn ? <Setores /> : <Navigate to={"/login"} />}></Route>
      <Route path="/epis"  element={auth.isLoggedIn ? <Epi /> : <Navigate to={"/login"} />}></Route>
      <Route path="/users"  element={auth.isLoggedIn ? <Users /> : <Navigate to={"/login"} />}></Route>
      <Route path="/treinamentos"  element={auth.isLoggedIn ? <Treinamentos /> : <Navigate to={"/login"} />}></Route>
      <Route path="/entregasepi"  element={auth.isLoggedIn ? <EntregasEpi /> : <Navigate to={"/login"} />}></Route>
      <Route path="/descricaocargos"  element={auth.isLoggedIn ? <DescricaoCargo /> : <Navigate to={"/login"} />}></Route>
    </Routes>
    </>
  );
};

export default App;
