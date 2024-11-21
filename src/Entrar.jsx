import { useState } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; 

function Entrar() {
    const[email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEntrar = async() => {
        if (!email) {
            window.alert("Por favor, insira um email válido.");
            return;
        }

        try {
            const busca = query(
                collection(db, "usuarios"),
                where("email", "==", email)
            );

            const querySnapshot = await getDocs(busca);

            if (querySnapshot.empty) {
                window.alert("Esse email ainda não foi cadastrado.")
            } else {
                localStorage.setItem('usuarioEmail', email);

                window.alert("Login bem-sucedido.");
                navigate('/tarefas');
            }

            setEmail('');
        } catch (error) {
        console.error("Erro ao fazer login: ", error);
        window.alert("Erro ao fazer login: ", error);
        }
    };

    return (
        <>
            <h1>Entrar</h1>
            <hr></hr>
            <div className="card">
                <div>
                    <label htmlFor="email">Email:</label>
                        <input
                            className="emailInput"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                </div>
                    <button className="entrarBtn" onClick={handleEntrar}> Entrar </button>
            </div>
        </>
    )
}

export default Entrar;
