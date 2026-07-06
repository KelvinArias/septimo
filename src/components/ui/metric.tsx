type MetricProps = {
  label: string;
  value: string;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-md border border-[#e3dfd7] bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a857d]">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
