export default function ScoreGauge() {
  return (
    <div className="relative h-36 w-56">
      <div className="absolute left-1/2 top-3 h-36 w-36 -translate-x-1/2 rotate-45 rounded-full border-[15px] border-slate-700 border-b-transparent border-l-rose-500 border-r-sky-900 border-t-amber-400" />
      <div className="absolute left-1/2 top-[84px] h-2 w-20 origin-left -rotate-[50deg] rounded-full bg-white" />
      <div className="absolute left-1/2 top-[80px] h-4 w-4 -translate-x-1/2 rounded-full bg-white" />
      <span className="absolute left-[106px] top-8 text-xs text-slate-500">50</span>
      <div className="absolute bottom-0 left-4 flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Low
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-teal-600" />
          High
        </span>
      </div>
    </div>
  );
}
