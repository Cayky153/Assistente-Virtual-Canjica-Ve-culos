import { useState } from "react";
import Chat from "./components/Chat";
import ThemeButton from "./components/ThemeButton";


export default function App() {
    const [theme, setTheme] = useState("light");

    const styles = {
        app: {
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            background: theme === "light" ? "#f5f5f5" : "#0d0d0d",
            color: theme === "light" ? "#111" : "#f0f0f0",
            transition: "background 0.3s, color 0.3s",
            fontFamily: "'Segoe UI', sans-serif",
            overflow: "hidden",
        },
        header: {
            padding: "14px 24px",
            borderBottom: theme === "light" ? "1px solid #ddd" : "1px solid #222",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: theme === "light" ? "#ffffff" : "#111111",
            boxShadow: theme === "light"
                ? "0 1px 6px rgba(0,0,0,0.06)"
                : "0 1px 6px rgba(0,0,0,0.4)",
        },
        title: {
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: theme === "light" ? "#111" : "#ffffff",  // branco no dark
        }
    };

    return (
        <div style={styles.app}>
            <header style={styles.header}>
                <h2 style={styles.title}>Canjica Veículos</h2>
                <ThemeButton theme={theme} setTheme={setTheme} />
            </header>
            <Chat theme={theme} />
        </div>
    );
}