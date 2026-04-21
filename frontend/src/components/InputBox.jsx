import { useState } from "react";

export default function InputBox({ onSend, theme, loading }) {
    const [text, setText] = useState("");

    const handleSend = () => {
        if (!text.trim() || loading) return;
        onSend(text);
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isLight = theme === "light";

    const styles = {
        wrapper: {
            padding: "16px 24px 20px",
            borderTop: isLight ? "1px solid #e0e0e0" : "1px solid #1f1f1f",
            background: isLight ? "#ffffff" : "#111111",
        },
        row: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: isLight ? "#f2f2f2" : "#1a1a1a",
            borderRadius: 16,
            padding: "12px 12px 12px 20px",
            border: isLight ? "1px solid #ddd" : "1px solid #2a2a2a",
        },
        textarea: {
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: isLight ? "#111" : "#f0f0f0",
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: 24,
            maxHeight: 140,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            padding: 0,
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
        },
        button: {
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "none",
            background: loading || !text.trim() ? (isLight ? "#ddd" : "#2a2a2a") : "#f50000",
            color: loading || !text.trim() ? (isLight ? "#aaa" : "#555") : "#fff",
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, color 0.2s",
        },
        hint: {
            marginTop: 8,
            fontSize: "0.72rem",
            color: isLight ? "#bbb" : "#444",
            textAlign: "center",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.3px",
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.row}>
                <textarea
                    style={styles.textarea}
                    value={text}
                    rows={1}
                    onChange={(e) => {
                        setText(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte sobre nossos veículos..."
                    disabled={loading}
                />
                <button style={styles.button} onClick={handleSend} disabled={loading || !text.trim()}>
                    {loading ? "⏳" : "➤"}
                </button>
            </div>
            <p style={styles.hint}>Enter para enviar · Shift+Enter para nova linha</p>
        </div>
    );
}