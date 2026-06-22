import styles from "./page.module.css";

export default function HomeLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className="skeleton" style={{ width: 280, height: 40, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 200, height: 18 }} />
          </div>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 48, paddingLeft: 54 }}>
          {[1, 2, 3].map((group) => (
            <div key={group}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div className="skeleton" style={{ width: 26, height: 26, borderRadius: "50%" }} />
                <div className="skeleton" style={{ width: 80, height: 24 }} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 16,
                }}
              >
                {[1, 2].map((card) => (
                  <div
                    key={card}
                    className="skeleton"
                    style={{
                      height: 200,
                      borderRadius: 16,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
