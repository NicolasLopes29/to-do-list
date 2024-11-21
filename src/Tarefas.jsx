import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import './App.css'
import Modal from 'react-modal';


Modal.setAppElement('#root');

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState('');
  const [usuario, setUsuario] = useState('');
  const [prioridade, setPrioridade] = useState('média');
  const [status, setStatus] = useState('Não Iniciada');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTarefas = async () => {
    const tarefasCollectionRef = collection(db, 'tarefas');
    const querySnapshot = await getDocs(tarefasCollectionRef);
    const tarefasData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTarefas(tarefasData);
  };

  const fetchUsuarios = async () => {
    const usuariosCollectionRef = collection(db, 'usuarios');
    const querySnapshot = await getDocs(usuariosCollectionRef);
    const usuariosData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsuarios(usuariosData);
  };

  useEffect(() => {
    fetchTarefas();
    fetchUsuarios();
  }, []);

  const adicionarTarefa = async (event) => {
    event.preventDefault();

    const tarefaData = {
      descricao: descricao,
      setor: setor,
      usuario: usuario,
      prioridade: prioridade,
      status: status,
    };

    if (editingTaskId) {
      const tarefaRef = doc(db, 'tarefas', editingTaskId);
      await updateDoc(tarefaRef, tarefaData);
    } else {
      await addDoc(collection(db, 'tarefas'), tarefaData);
    }

    fetchTarefas();
    closeModal();
  };

  const deletarTarefa = async (taskId) => {
    const tarefaRef = doc(db, 'tarefas', taskId);
    await deleteDoc(tarefaRef);
    fetchTarefas();
  };

  const openModal = (task = null) => {
    if (task) {
      setDescricao(task.descricao);
      setSetor(task.setor);
      setUsuario(task.usuario);
      setPrioridade(task.prioridade);
      setStatus(task.status);
      setEditingTaskId(task.id);
    } else {
      setDescricao('');
      setSetor('');
      setUsuario('');
      setPrioridade('média');
      setStatus('Não Iniciada');
      setEditingTaskId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDescricao('');
    setSetor('');
    setUsuario('');
    setPrioridade('média');
    setStatus('Não Iniciada');
    setEditingTaskId(null);
  };

  return (
    <>
      <nav>
        <h1>Tarefas</h1>
      </nav>
      <hr />
      <button className='addtarefaBtn' onClick={() => openModal()}>➕ㅤAdicionar Tarefa</button>

      <Modal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={editingTaskId ? "Editar Tarefa" : "Adicionar Tarefa"}
      >
        <h2>{editingTaskId ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h2>
        <form onSubmit={adicionarTarefa}>
          <label>
            Descrição:
            <input
              className='descricaoInput'
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </label>
          <label>
            Setor:
            <input
              type="text"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              required
            />
          </label>
          <label>
            Usuário:
            <select
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prioridade:
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              required
            >
              <option value="alta">Alta</option>
              <option value="média">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </label>
          <label>
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Não Iniciada">Não Iniciada</option>
              <option value="Em Produção">Em Produção</option>
              <option value="Concluída">Concluída</option>
            </select>
          </label>
          <br></br>
          <button type="submit">{editingTaskId ? 'Salvar' : 'Adicionar'}</button>
          <button type="button" onClick={closeModal}>Cancelar</button>
        </form>
      </Modal>

      <div className="task-columns">
        <div className="task-column">
          <h2>Não Iniciadas</h2>
          <ul>
            {tarefas.filter(tarefa => tarefa.status === 'Não Iniciada').map(tarefa => (
              <li key={tarefa.id}>
                <b>{tarefa.descricao} </b> <br/>
                {tarefa.setor && `Setor: ${tarefa.setor}`}<br/>
                {tarefa.usuario && `Usuário: ${usuarios.find(user => user.id === tarefa.usuario)?.nome}`}<br/>
                {tarefa.prioridade && ` Prioridade: ${tarefa.prioridade}`}<br/>
                <button onClick={() => openModal(tarefa)}>Editar ✏️</button>
                <button onClick={() => deletarTarefa(tarefa.id)}>Deletar 🗑️</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="task-column">
          <h2>Em Produção</h2>
          <ul>
            {tarefas.filter(tarefa => tarefa.status === 'Em Produção').map(tarefa => (
              <li key={tarefa.id}>
                <b>{tarefa.descricao} </b> <br/>
                {tarefa.setor && `Setor: ${tarefa.setor}`}<br/>
                {tarefa.usuario && `Usuário: ${usuarios.find(user => user.id === tarefa.usuario)?.nome}`}<br/>
                {tarefa.prioridade && ` Prioridade: ${tarefa.prioridade}`}<br/>
                <button onClick={() => openModal(tarefa)}>Editar ✏️</button>
                <button onClick={() => deletarTarefa(tarefa.id)}>Deletar 🗑️</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="task-column">
          <h2>Concluídas</h2>
          <ul>
            {tarefas.filter(tarefa => tarefa.status === 'Concluída').map(tarefa => (
              <li key={tarefa.id}>
                <b>{tarefa.descricao} </b> <br/>
                {tarefa.setor && `Setor: ${tarefa.setor}`}<br/>
                {tarefa.usuario && `Usuário: ${usuarios.find(user => user.id === tarefa.usuario)?.nome}`}<br/>
                {tarefa.prioridade && ` Prioridade: ${tarefa.prioridade}`}<br/>
                <button onClick={() => openModal(tarefa)}>Editar ✏️</button>
                <button onClick={() => deletarTarefa(tarefa.id)}>Deletar 🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Tarefas;