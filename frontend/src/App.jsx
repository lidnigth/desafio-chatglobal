import { useState, useEffect } from "react";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";

const API_URL = "http://localhost:3005/mensagens";

function App() {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMensagens(data));
  }, []);

  const adicionarMensagem = async (autor, conteudo) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ autor, conteudo }),
    });
    const novaMensagem = await res.json();
    setMensagens([...mensagens, novaMensagem]);
  };
  return (
    <div>
      <h1>Chat Global</h1>
      <MessageList mensagens={mensagens} />
      <MessageForm onEnviar={adicionarMensagem} />
    </div>
  );
}

export default App;
