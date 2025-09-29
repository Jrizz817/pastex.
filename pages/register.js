import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const register = async () => {
    if(!username || !password) return setMsg("Digite usuário e senha");
    const res = await fetch("/api/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,password})
    });
    const data = await res.json();
    if(data.success){
      router.push("/");
    }else{
      setMsg(data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Registrar Conta - Pastex</h1>
      <input placeholder="Usuário" className="mb-2 w-64 p-2 rounded" value={username} onChange={e=>setUsername(e.target.value)}/>
      <input type="password" placeholder="Senha" className="mb-2 w-64 p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="bg-green-600 text-white px-4 py-2 rounded mb-2" onClick={register}>Registrar</button>
      <p className="text-red-500">{msg}</p>
      <p>Já tem conta? <a className="text-blue-600 underline cursor-pointer" href="/">Login</a></p>
    </div>
  );
}
