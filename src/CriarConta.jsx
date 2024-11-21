import { useState } from 'react';
import './CriarConta.css';
import { db } from './firebase';  // Certifique-se de que o caminho esteja correto
import { collection, setDoc, doc, query, where, getDocs } from 'firebase/firestore';  // Funções do Firestore
import { useNavigate } from 'react-router-dom';  // Usando o React Router para navegação

function CriarConta() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();  // Hook para navegação

  // Função para criar conta
  const handleCriarConta = async () => {
    if (!nome || !email) {
      window.alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Verificar se o email já está cadastrado
      const q = query(collection(db, "usuarios"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        window.alert("Este email já está cadastrado. Tente outro.");
        return;
      }

      // Adicionando os dados do usuário na coleção "usuarios" do Firestore com o email como ID
      await setDoc(doc(db, "usuarios", email), {
        nome: nome,
        email: email,
      });

      // Exibindo um alerta de sucesso
      window.alert("Conta criada com sucesso!");

      // Redirecionar para a página de login após a criação da conta
      navigate('/tarefas');  // Redireciona para a rota "/entrar"

      // Limpando os campos após a criação
      setNome('');
      setEmail('');
    } catch (e) {
      console.error("Erro ao criar conta: ", e);
      window.alert("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <>
      <h1>Criar Conta</h1>
      <hr />
      <div className="card">
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            className='nomeInput'
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input
            className='emailInput'
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="criarcontaBtn"
          onClick={handleCriarConta}
        >
          Criar Conta
        </button>
      </div>
    </>
  );
}

export default CriarConta;