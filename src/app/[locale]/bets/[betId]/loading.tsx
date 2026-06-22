export default function BetDetailLoading() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <div className="skeleton" style={{ width: 120, height: 18, marginBottom: 32 }} />
      <div className="skeleton" style={{ height: 500, borderRadius: 24 }} />
    </div>
  );
}
