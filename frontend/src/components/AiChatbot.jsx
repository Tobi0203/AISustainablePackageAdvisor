import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
export default function AiChatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Ask me about sustainable packaging materials, protection, disposal, or trade-offs.",
    },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  if (!user) return null;
  const send = async (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message || sending) return;
    const next = [...messages, { role: "user", content: message }];
    setMessages(next);
    setText("");
    setSending(true);
    try {
      const { data } = await api.post("/ai/chat", {
        message,
        history: next.slice(-8),
      });
      setMessages((x) => [...x, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((x) => [
        ...x,
        {
          role: "assistant",
          content: "I could not answer right now. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        className="btn-primary h-12 w-12 rounded-full p-0 text-xl shadow-glow"
        onClick={() => setOpen(!open)}
        aria-label="Open AI packaging chat"
      >
        ✦
      </button>
      {open && (
        <div className="card absolute bottom-16 right-0 flex h-[460px] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden shadow-glow">
          <div className="bg-forest px-5 py-4 text-white">
            <b>EcoPack AI chat</b>
            <p className="text-xs text-white/70">
              Packaging guidance, on demand
            </p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-5 ${m.role === "user" ? "ml-auto bg-forest text-white" : "bg-mist text-ink"}`}
              >
                {m.content}
              </div>
            ))}
            {sending && <p className="text-xs text-slate-400">Thinking...</p>}
          </div>
          <form className="flex gap-2 border-t p-3" onSubmit={send}>
            <input
              className="input py-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask about packaging..."
            />
            <button className="btn-primary px-3">↑</button>
          </form>
        </div>
      )}
    </div>
  );
}
