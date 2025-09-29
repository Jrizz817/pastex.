import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const register = async () => {
    if (!username || !password) return setMsg("Digite usuário e senha");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/");
      } else {
        setMsg(data.error);
      }
    } catch (err) {
      setMsg("Erro no servidor. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Registrar Conta</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
        />
        <button
          onClick={register}
          className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition-all"
        >
          Registrar
        </button>
        {msg && <p className="text-red-500 mt-2">{msg}</p>}
        <p className="mt-4 text-center text-gray-600">
          Já tem conta? <a href="/" className="text-purple-600 underline">Login</a>
        </p>
      </div>
    </div>
  );
        }
