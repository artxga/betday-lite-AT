export default function ProfileLoading() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <div
        style={{
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="skeleton" style={{ width: 200, height: 40, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 180, height: 16 }} />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 48 }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
        ))}
      </div>
    </div>
  );
}
