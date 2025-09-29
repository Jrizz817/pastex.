import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const login = async () => {
    if (!username || !password) return setMsg("Digite usuário e senha");

    try {
      const res = await fetch(`/api/users?username=${username}&password=${password}`);
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", username);
        router.push("/dashboard");
      } else {
        setMsg(data.error);
      }
    } catch (err) {
      setMsg("Erro no servidor. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Pastex Login</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={login}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-all"
        >
          Entrar
        </button>
        {msg && <p className="text-red-500 mt-2">{msg}</p>}
        <p className="mt-4 text-center text-gray-600">
          Não tem conta? <a href="/register" className="text-blue-600 underline">Registrar</a>
        </p>
      </div>
    </div>
  );
            }
