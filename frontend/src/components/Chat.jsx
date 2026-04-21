import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api/api";
import Message from "./Message";
import InputBox from "./InputBox";

const SUGGESTIONS = [
    "Quais carros estão disponíveis?",
    "Vocês têm SUVs no estoque?",
    "Quero falar com um vendedor.",
    "Tem algum carro até R$ 50.000?",
];

export default function Chat({ theme }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const userId = "user-1";
    const isLight = theme === "light";

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = async (text) => {
        console.log("send chamado com:", text)
        setMessages((m) => [...m, { role: "user", text }]);
        setLoading(true);
        try {
            const res = await sendMessage(text, userId);
            setMessages((m) => [...m, { role: "bot", text: res }]);
        } catch (error){
            console.error("Erro ao enviar mensagem:", error);
            setMessages((m) => [...m, { role: "bot", text: "Erro ao conectar com a IA." }]);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        chat: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        },
        messages: {
            flex: 1,
            overflowY: "auto",
            padding: "24px 10%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            scrollbarWidth: "thin",
            scrollbarColor: isLight ? "#ccc #f5f5f5" : "#333 #0d0d0d",
        },
        welcome: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "40px 24px",
            textAlign: "center",
        },
        logoWrapper: {
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#f50000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            overflow: "hidden",
        },
        logoImg: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        logoFallback: {
            color: "#fff",
            fontSize: "1.4rem",
            fontWeight: 700,
            fontFamily: "'Georgia', serif",
            letterSpacing: "1px",
        },
        welcomeTitle: {
            fontSize: "1.35rem",
            fontWeight: 700,
            color: isLight ? "#111" : "#f0f0f0",
            margin: 0,
            fontFamily: "'Georgia', serif",
        },
        welcomeSub: {
            fontSize: "0.95rem",
            color: isLight ? "#777" : "#888",
            maxWidth: 360,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "'Georgia', serif",
        },
        suggestions: {
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            marginTop: 20,
            maxWidth: 500,
        },
        chip: {
            padding: "9px 18px",
            borderRadius: 20,
            border: isLight ? "1px solid #ddd" : "1px solid #333",
            background: isLight ? "#fff" : "#1a1a1a",
            color: isLight ? "#333" : "#ccc",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "'Georgia', serif",
            transition: "border-color 0.2s, color 0.2s",
        },
        typing: {
            padding: "8px 16px",
            borderRadius: "18px 18px 18px 4px",
            background: isLight ? "#efefef" : "#1e1e1e",
            color: isLight ? "#999" : "#666",
            fontSize: "0.85rem",
            alignSelf: "flex-start",
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
        }
    };

    // Tenta carregar logo da pasta public
    const LogoContent = () => {
        return (
            <div style={styles.logoWrapper}>
                <img
                    src="/canjicaveiculos.jpg"
                    alt="Canjica Veículos"
                    style={styles.logoImg}
                    onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                    }}
                />
                <span style={{ ...styles.logoFallback, display: "none" }}>CA</span>
            </div>
        );
    };

    if (messages.length === 0 && !loading) {
        return (
            <div style={styles.chat}>
                <div style={styles.welcome}>
                    <LogoContent />
                    <p style={styles.welcomeTitle}>Olá! Sou o assistente da Canjica Veículos</p>
                    <p style={styles.welcomeSub}>
                        <p style={styles.welcomeSub}>
                            Posso te ajudar a encontrar o veículo ideal no nosso estoque e conectar você com um de nossos vendedores.
                        </p>
                    </p>
                    <div style={styles.suggestions}>
                        {SUGGESTIONS.map((s) => (
                            <button key={s} style={styles.chip} onClick={() => send(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <InputBox onSend={send} theme={theme} loading={loading} />
            </div>
        );
    }

    return (
        <div style={styles.chat}>
            <div style={styles.messages}>
                {messages.map((msg, i) => (
                    <Message key={i} msg={msg} theme={theme} />
                ))}
                {loading && <div style={styles.typing}>Digitando...</div>}
                <div ref={bottomRef} />
            </div>
            <InputBox onSend={send} theme={theme} loading={loading} />
        </div>
    );
}