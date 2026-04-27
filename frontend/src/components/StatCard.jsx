export default function StatCard({ label, value, icon: Icon, tone = 'cyan', trend }) {
  const tones = {
    cyan: 'from-[rgba(11,31,77,0.92)] to-[rgba(19,43,107,0.44)] text-white',
    emerald: 'from-[rgba(212,175,55,0.96)] to-[rgba(230,126,34,0.42)] text-white',
    amber: 'from-[rgba(19,43,107,0.94)] to-[rgba(212,175,55,0.28)] text-white',
    rose: 'from-[rgba(11,31,77,0.94)] to-[rgba(230,126,34,0.48)] text-white',
  };

  return (
    <div className="portal-panel p-5">
      <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3 ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="portal-subtext text-sm">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <h3 className="portal-heading text-3xl">{value}</h3>
        {trend ? <span className="portal-chip px-3 py-1 text-xs">{trend}</span> : null}
      </div>
    </div>
  );
}
