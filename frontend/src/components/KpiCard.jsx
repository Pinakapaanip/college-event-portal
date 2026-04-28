export default function KpiCard({ label, value, tone = 'cyan' }) {
  const tones = {
    cyan: 'from-[rgba(11,31,77,0.92)] to-[rgba(19,43,107,0.44)] text-white',
    emerald: 'from-[rgba(212,175,55,0.96)] to-[rgba(230,126,34,0.42)] text-white',
    amber: 'from-[rgba(19,43,107,0.94)] to-[rgba(212,175,55,0.28)] text-white',
    rose: 'from-[rgba(11,31,77,0.94)] to-[rgba(230,126,34,0.48)] text-white',
  };

  return (
    <div className="portal-panel p-5">
      <div className={`mb-4 h-1 rounded-full bg-gradient-to-r ${tones[tone]}`} />
      <p className="portal-subtext text-sm">{label}</p>
      <h3 className="portal-heading mt-2 text-3xl">{value}</h3>
    </div>
  );
}