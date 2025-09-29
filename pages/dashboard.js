import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Dashboard() {
  const [user,setUser]=useState("");
  const [text,setText]=useState("");
  const [pasteId,setPasteId]=useState("");
  const [myPastes,setMyPastes]=useState([]);
  const [searchResult,setSearchResult]=useState("");

  useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    if(!storedUser) window.location.href="/";
    else { setUser(storedUser); loadMyPastes(storedUser);}
  },[]);

  const loadMyPastes=async(username)=>{
    const res=await fetch("/api/pastes");
    const data=await res.json();
    const userPastes = Object.entries(data)
      .filter(([id,p])=>p.user===username)
      .map(([id,p])=>({id,...p}))
      .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    setMyPastes(userPastes);
  };

  const createPaste=async()=>{
    if(!text) return alert("Digite o código pra criar paste");
    const res=await fetch("/api/pastes",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text,user})
    });
    const data=await res.json();
    if(data.id){
      alert(`Paste criado com ID: ${data.id}`);
      setText("");
      loadMyPastes(user);
    }else alert(data.error||"Erro");
  };

  const searchPaste=async()=>{
    if(!pasteId) return alert("Digite ID do paste");
    const res=await fetch(`/api/pastes?id=${pasteId}`);
    const data=await res.json();
    if(data.text) setSearchResult(`User: ${data.user}\nText: ${data.text}`);
    else setSearchResult(data.error||"Não encontrado");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user}/>
      <main className="p-6 space-y-6">
        <section className="bg-white p-4 rounded shadow-lg animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">Criar Novo Paste</h2>
          <textarea rows="4" className="w-full mb-2 p-2 rounded" placeholder="Digite seu texto..." value={text} onChange={e=>setText(e.target.value)}/>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={createPaste}>Criar Paste</button>
        </section>

        <section className="bg-white p-4 rounded shadow-lg animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">Buscar Paste por ID</h2>
          <input className="w-64 mb-2 p-2 rounded" placeholder="ID do paste" value={pasteId} onChange={e=>setPasteId(e.target.value)}/>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={searchPaste}>Buscar</button>
          <pre className="mt-2 bg-gray-100 p-2 rounded">{searchResult}</pre>
        </section>

        <section className="bg-white p-4 rounded shadow-lg animate-fadeIn">
          <h2 className="text-xl font-bold mb-2">Meus Pastes</h2>
          {myPastes.length===0 ? <p>Nenhum paste criado ainda</p> :
          <ul className="space-y-2">
            {myPastes.map(p=>(
              <li key={p.id} className="p-2 border rounded hover:bg-gray-50 transition">
                <strong>ID:</strong> {p.id} | <strong>Criado em:</strong> {new Date(p.created_at).toLocaleString()}
                <p className="mt-1">{p.text}</p>
                <a 
                  href={`/api/pastes?id=${p.id}&raw=true`} 
                  target="_blank" 
                  className="text-blue-600 underline mt-1 inline-block hover:text-blue-800"
                >Ver Raw</a>
              </li>
            ))}
          </ul>
          }
        </section>
      </main>
    </div>
  );
                    }
