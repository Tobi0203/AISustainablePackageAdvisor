export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-mist border-t-leaf" />
        <p className="mt-3 text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}
