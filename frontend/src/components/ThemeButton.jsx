export default function ThemeButton({ theme, setTheme }) {
    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
                padding: "8px 16px",
                background: "#f50000",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
                transition: "background 0.2s",
            }}
        >
            {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}