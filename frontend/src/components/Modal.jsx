// ============================================================
// Modal.jsx
// ============================================================

export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: 12,
        padding: 28, width: "min(600px,95vw)", maxHeight: "90vh",
        overflowY: "auto", position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#c4a832", fontFamily: "'Cinzel', serif", fontSize: 18, margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
