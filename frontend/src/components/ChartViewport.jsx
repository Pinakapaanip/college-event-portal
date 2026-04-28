export default function ChartViewport({ children, className = 'h-[320px]' }) {
  return <div className={`relative w-full overflow-hidden ${className}`}>{children}</div>;
}