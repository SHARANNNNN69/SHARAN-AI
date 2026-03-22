import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HEX_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 0 L56 16 L56 50 L28 66 L0 50 L0 16Z' fill='none' stroke='rgba(74,125,154,0.06)' stroke-width='0.5'/%3E%3Cpath d='M28 66 L56 82 L56 116 L28 132 L0 116 L0 82Z' fill='none' stroke='rgba(74,125,154,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`;

function TypingDots() {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center", padding:"4px 0" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:"50%",
          background:"rgba(139,196,220,0.5)",
          animation:`tdot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function ChatInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const firstMessage = location.state?.firstMessage || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Generate a unique session ID once per chat session
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  // Send the first message automatically on mount
  useEffect(() => {
    if (firstMessage) sendMessage(firstMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // ── Real API call ─────────────────────────────────────────
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId }),
    });
    const data = await res.json();
    const reply = data.reply;
    // ──────────────────────────────────────────────────────────

    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: reply }]);
  };

  const handleSend = () => {
    const v = input.trim();
    if (!v || isTyping) return;
    sendMessage(v);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

        @keyframes amove { from{transform:translate(0,0) scale(1);} to{transform:translate(60px,40px) scale(1.15);} }
        @keyframes msgIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes tdot  { 0%,80%,100%{transform:scale(0.7);opacity:0.4;} 40%{transform:scale(1);opacity:1;} }
        @keyframes fadeIn{ from{opacity:0;} to{opacity:1;} }

        .chat-root   { cursor:default; }
        .chat-a1     { position:fixed;width:900px;height:500px;top:-200px;left:-200px;background:radial-gradient(ellipse,rgba(74,125,154,0.14) 0%,transparent 70%);animation:amove 18s ease-in-out infinite alternate; }
        .chat-a2     { position:fixed;width:700px;height:400px;bottom:-100px;right:-150px;background:radial-gradient(ellipse,rgba(10,70,110,0.18) 0%,transparent 70%);animation:amove 24s ease-in-out infinite alternate-reverse; }
        .msg-in      { animation:msgIn 0.3s ease both; }
        .chat-input:focus { outline:none; }
        .send-btn:hover  { background:rgba(139,196,220,0.18)!important; border-color:rgba(200,232,245,0.45)!important; }
        .back-btn:hover  { color:rgba(200,232,245,0.9)!important; border-color:rgba(200,232,245,0.3)!important; background:rgba(74,125,154,0.1)!important; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(74,125,154,0.3); border-radius:2px; }
      `}</style>

      <div className="chat-root" style={{ position:"relative", height:"100vh", background:"#060E16", color:"rgba(220,238,248,0.92)", fontFamily:"'Barlow Condensed',sans-serif", display:"flex", flexDirection:"column", overflowX:"hidden" }}>

        {/* Aurora */}
        <div className="chat-a1" /><div className="chat-a2" />

        {/* Hex grid */}
        <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:HEX_BG, backgroundSize:"56px 100px" }} />

        {/* Scanlines */}
        <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(6,14,22,0.1) 2px,rgba(6,14,22,0.1) 4px)" }} />

        {/* ── HEADER ── */}
        <header style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:"1px solid rgba(200,232,245,0.07)", backdropFilter:"blur(12px)", background:"rgba(6,14,22,0.7)", flexShrink:0 }}>
          <button
            className="back-btn"
            onClick={() => navigate("/")}
            style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:"1px solid rgba(200,232,245,0.12)", borderRadius:2, padding:"6px 14px", cursor:"pointer", fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:3, color:"rgba(139,196,220,0.5)", textTransform:"uppercase", transition:"all 0.2s" }}
          >
            <svg style={{ width:12, height:12, stroke:"currentColor", strokeWidth:1.8, fill:"none" }} viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>

          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:6, color:"rgba(200,232,245,0.6)" }}>SHARANNNN</span>

         
        </header>

        {/* ── MESSAGES ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:16, position:"relative", zIndex:1 }}>
          {messages.length === 0 && (
            <div style={{ textAlign:"center", marginTop:"auto", marginBottom:"auto", color:"rgba(139,196,220,0.2)", fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:3, animation:"fadeIn 0.6s ease both" }}>
              AWAITING INPUT
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className="msg-in" style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {/* AI avatar */}
              {msg.role === "ai" && (
                <div style={{ width:30, height:30, borderRadius:2, border:"1px solid rgba(74,125,154,0.4)", display:"flex", alignItems:"center", justifyContent:"center", marginRight:10, flexShrink:0, background:"rgba(74,125,154,0.1)", fontFamily:"'Bebas Neue',sans-serif", fontSize:11, letterSpacing:1, color:"rgba(139,196,220,0.6)" }}>
                  NX
                </div>
              )}

              <div style={{
                maxWidth:"70%",
                padding:"12px 16px",
                borderRadius:2,
                fontSize:15,
                fontWeight:400,
                lineHeight:1.6,
                letterSpacing:0.3,
                ...(msg.role === "user"
                  ? {
                      background:"rgba(74,125,154,0.2)",
                      border:"1px solid rgba(139,196,220,0.18)",
                      color:"rgba(220,238,248,0.92)",
                      borderTopRightRadius:0,
                    }
                  : {
                      background:"rgba(11,30,45,0.8)",
                      border:"1px solid rgba(200,232,245,0.08)",
                      borderLeft:"2px solid rgba(139,196,220,0.3)",
                      color:"rgba(200,232,245,0.8)",
                      borderTopLeftRadius:0,
                    }
                ),
              }}>
                {msg.text}
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div style={{ width:30, height:30, borderRadius:2, border:"1px solid rgba(139,196,220,0.25)", display:"flex", alignItems:"center", justifyContent:"center", marginLeft:10, flexShrink:0, background:"rgba(139,196,220,0.08)", fontFamily:"'Bebas Neue',sans-serif", fontSize:11, letterSpacing:1, color:"rgba(139,196,220,0.5)" }}>
                  YOU
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="msg-in" style={{ display:"flex", justifyContent:"flex-start", alignItems:"center" }}>
              <div style={{ width:30, height:30, borderRadius:2, border:"1px solid rgba(74,125,154,0.4)", display:"flex", alignItems:"center", justifyContent:"center", marginRight:10, flexShrink:0, background:"rgba(74,125,154,0.1)", fontFamily:"'Bebas Neue',sans-serif", fontSize:11, letterSpacing:1, color:"rgba(139,196,220,0.6)" }}>
                NX
              </div>
              <div style={{ padding:"12px 16px", background:"rgba(11,30,45,0.8)", border:"1px solid rgba(200,232,245,0.08)", borderLeft:"2px solid rgba(139,196,220,0.3)", borderRadius:2, borderTopLeftRadius:0 }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── INPUT BAR ── */}
        <div style={{ position:"relative", zIndex:10, padding:"16px 20px 24px", borderTop:"1px solid rgba(200,232,245,0.07)", background:"rgba(6,14,22,0.8)", backdropFilter:"blur(12px)", flexShrink:0 }}>
          <div style={{ maxWidth:760, margin:"0 auto", position:"relative", background:"rgba(14,36,52,0.88)", border: focused ? "1px solid rgba(200,232,245,0.38)" : "1px solid rgba(74,125,154,0.3)", borderRadius:2, backdropFilter:"blur(14px)", overflow:"hidden", transition:"border-color 0.25s,box-shadow 0.25s", boxShadow: focused ? "0 0 0 3px rgba(139,196,220,0.05),inset 0 0 40px rgba(74,125,154,0.04)" : "none" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(200,232,245,0.2),transparent)" }} />
            <svg style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", width:16, height:16, stroke:"#8BC4DC", strokeWidth:1.5, fill:"none", opacity:0.5 }} viewBox="0 0 24 24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={isTyping ? "Nexus is responding…" : "Continue the mission…"}
              disabled={isTyping}
              autoComplete="off"
              style={{ width:"100%", padding:"16px 52px 16px 48px", background:"transparent", border:"none", color:"rgba(220,238,248,0.92)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:400, letterSpacing:0.5 }}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:36, height:36, borderRadius:2, border:"1px solid rgba(139,196,220,0.18)", cursor: isTyping ? "not-allowed" : "pointer", background: input.trim() && !isTyping ? "rgba(74,125,154,0.35)" : "rgba(74,125,154,0.1)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", opacity: isTyping ? 0.4 : 1 }}
            >
              <svg style={{ width:13, height:13, stroke:"#C8E8F5", strokeWidth:1.8, fill:"none" }} viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}