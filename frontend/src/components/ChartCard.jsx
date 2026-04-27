export default function ChartCard({ title, children, note }) {
  return (
    <section className="portal-panel p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="portal-heading text-lg">{title}</h3>
          {note ? <p className="portal-subtext text-sm">{note}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
