import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const QUOTES = [
  "I am inevitable… so go on, what's your problem?",
  "Genius, billionaire, problem-solver… now talk.",
  "Dormammu, I've come to bargain… you, start explaining.",
  "I can do this all day… but don't make me.",
  "Bring me Thanos… or at least a decent question.",
  "We have a Hulk… what do you have?",
  "Before we get started… does anyone want to leave?",
  "You're burdened with a question… let's hear it.",
  "I'm always angry… especially at bad questions.",
  "Part of the journey is the end… so start talking.",
  "Whatever it takes… just make it make sense.",
  "You should have gone for the head… instead, explain.",
  "I choose to run toward my problems… you?",
  "With great power comes great responsibility… so ask wisely.",
  "I don't like bullies… especially lazy thinking.",
];

const HEX_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 0 L56 16 L56 50 L28 66 L0 50 L0 16Z' fill='none' stroke='rgba(74,125,154,0.06)' stroke-width='0.5'/%3E%3Cpath d='M28 66 L56 82 L56 116 L28 132 L0 116 L0 82Z' fill='none' stroke='rgba(74,125,154,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`;

export default function NexusAI() {
  const navigate = useNavigate();
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [time, setTime] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSend = () => {
    const v = input.trim();
    if (!v) return;
    // Pass the first message as state to ChatInterface
    navigate("/chat", { state: { firstMessage: v } });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
        @keyframes amove { from{transform:translate(0,0) scale(1);} to{transform:translate(60px,40px) scale(1.15);} }
        @keyframes ap    { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        .nexus-root   { cursor:crosshair; }
        .nexus-a1     { position:absolute;width:900px;height:500px;top:-200px;left:-200px;background:radial-gradient(ellipse,rgba(74,125,154,0.16) 0%,transparent 70%);animation:amove 18s ease-in-out infinite alternate; }
        .nexus-a2     { position:absolute;width:700px;height:400px;bottom:-100px;right:-150px;background:radial-gradient(ellipse,rgba(10,70,110,0.2) 0%,transparent 70%);animation:amove 24s ease-in-out infinite alternate-reverse; }
        .nexus-a3     { position:absolute;width:500px;height:300px;top:40%;left:30%;background:radial-gradient(ellipse,rgba(200,232,245,0.04) 0%,transparent 70%);animation:amove 14s ease-in-out infinite alternate; }
        .nexus-quote  { animation:ap 0.8s ease 0.1s both; }
        .nexus-search { animation:ap 0.8s ease 0.4s both; }
        .nexus-clock  { animation:ap 1s ease 1s both; }
        .nexus-sbtn:hover { background:rgba(139,196,220,0.18)!important; border-color:rgba(200,232,245,0.45)!important; transform:translateY(-50%) scale(1.06)!important; }
      `}</style>

      <div className="nexus-root" style={{ position:"relative", minHeight:"100vh", background:"#060E16", color:"rgba(220,238,248,0.92)", fontFamily:"'Barlow Condensed',sans-serif", overflowX:"hidden" }}>

        {/* Aurora */}
        <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden" }}>
          <div className="nexus-a1" /><div className="nexus-a2" /><div className="nexus-a3" />
        </div>

        {/* Hex grid */}
        <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:HEX_BG, backgroundSize:"56px 100px" }} />

        {/* Scanlines */}
        <div style={{ position:"fixed", inset:0, zIndex:1, pointerEvents:"none", background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(6,14,22,0.12) 2px,rgba(6,14,22,0.12) 4px)" }} />

        {/* Corner brackets */}
        {[
          { top:20, left:20,   borderTop:"1px solid rgba(200,232,245,0.35)", borderLeft:"1px solid rgba(200,232,245,0.35)" },
          { top:20, right:20,  borderTop:"1px solid rgba(200,232,245,0.35)", borderRight:"1px solid rgba(200,232,245,0.35)" },
          { bottom:20, left:20,  borderBottom:"1px solid rgba(200,232,245,0.35)", borderLeft:"1px solid rgba(200,232,245,0.35)" },
          { bottom:20, right:20, borderBottom:"1px solid rgba(200,232,245,0.35)", borderRight:"1px solid rgba(200,232,245,0.35)" },
        ].map((s, i) => (
          <div key={i} style={{ position:"fixed", width:44, height:44, pointerEvents:"none", zIndex:3, ...s }} />
        ))}

        {/* Main */}
        <main style={{ position:"relative", zIndex:2, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px 70px", gap:28 }}>

          {/* Quote */}
          <div className="nexus-quote" style={{ textAlign:"center", maxWidth:820, padding:"0 16px" }}>
            <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(32px,5.5vw,72px)", letterSpacing:3, lineHeight:1.1, color:"rgba(220,238,248,0.92)" }}>
              "{quote}"
            </p>
          </div>

          {/* Search */}
          <div className="nexus-search" style={{ width:"100%", maxWidth:660 }}>
            <div style={{ position:"relative", background:"rgba(14,36,52,0.88)", border: focused ? "1px solid rgba(200,232,245,0.38)" : "1px solid rgba(74,125,154,0.3)", borderRadius:2, backdropFilter:"blur(14px)", overflow:"hidden", boxShadow: focused ? "0 0 0 3px rgba(139,196,220,0.05),inset 0 0 40px rgba(74,125,154,0.04)" : "none", transition:"border-color 0.25s,box-shadow 0.25s" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(200,232,245,0.25),transparent)" }} />
              <svg style={{ position:"absolute", left:20, top:"50%", transform:"translateY(-50%)", width:17, height:17, stroke:"#8BC4DC", strokeWidth:1.5, fill:"none", opacity:0.65 }} viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="What do you need, agent…"
                autoComplete="off"
                style={{ width:"100%", padding:"18px 54px 18px 52px", background:"transparent", border:"none", outline:"none", color:"rgba(220,238,248,0.92)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:400, letterSpacing:0.5 }}
              />
              <button className="nexus-sbtn" onClick={handleSend} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:38, height:38, borderRadius:2, border:"1px solid rgba(139,196,220,0.18)", cursor:"pointer", background:"rgba(74,125,154,0.2)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s,border-color 0.2s,transform 0.15s" }}>
                <svg style={{ width:14, height:14, stroke:"#C8E8F5", strokeWidth:1.8, fill:"none" }} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Clock */}
        <div className="nexus-clock" style={{ position:"fixed", bottom:24, left:0, right:0, textAlign:"center", zIndex:4, fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:4, color:"rgba(139,196,220,0.25)" }}>
          {time}
        </div>
      </div>
    </>
  );
}