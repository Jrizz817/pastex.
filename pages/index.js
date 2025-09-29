import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const login = async () => {
    if(!username || !password) return setMsg("Digite usuário e senha");
    const res = await fetch(`/api/users?username=${username}&password=${password}`);
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", username);
      router.push("/dashboard");
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Pastex Login</h1>
      <input placeholder="Usuário" className="mb-2 w-64 p-2 rounded" value={username} onChange={e=>setUsername(e.target.value)}/>
      <input type="password" placeholder="Senha" className="mb-2 w-64 p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-2" onClick={login}>Entrar</button>
      <p className="text-red-500">{msg}</p>
      <p>Não tem conta? <a className="text-blue-600 underline cursor-pointer" href="/register">Registrar</a></p>
    </div>
  );
    }
