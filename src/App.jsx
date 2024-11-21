import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import CriarConta from './CriarConta';
import Entrar from './Entrar';
import Tarefas from './Tarefas';

function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/criar-conta" element={<CriarConta />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path='/tarefas' element={<Tarefas />} />
        </Routes>
    </Router>
    </>
  )
}



function Inicio() {
  return(
    <div>
      <h1>Lista de Tarefas</h1>
      <hr></hr>
      <Link to="/tarefas">
        <button className='tarefasBtn'>Ver Tarefas</button>
      </Link>
      <Link to="/criar-conta">
        <button className='criarcontaBtn'>Cadastrar Usuário</button>
      </Link>
      
    </div>
  )
}

export default App

