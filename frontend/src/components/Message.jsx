export default function Message({ msg, theme }) {
    const isUser = msg.role === "user";
    const isLight = theme === "light";

    const styles = {
        container: {
            display: "flex",
            justifyContent: isUser ? "flex-end" : "flex-start",
            paddingLeft: isUser ? "15%" : "0",
            paddingRight: isUser ? "0" : "15%",
        },
        bubble: {
            padding: "11px 16px",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isUser
                ? "#f50000"
                : isLight ? "#efefef" : "#1e1e1e",
            color: isUser ? "#fff" : isLight ? "#111" : "#f0f0f0",
            fontSize: "0.97rem",
            lineHeight: "1.65",
            wordBreak: "break-word",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            maxWidth: "100%",
            letterSpacing: "0.1px",
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.bubble}>{msg.text}</div>
        </div>
    );
}