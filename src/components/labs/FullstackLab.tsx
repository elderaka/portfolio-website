export const FullstackLab = () => {
  return (
    <div className="h-full flex flex-col min-h-[420px]">
      <div className="flex gap-2 mb-4 border-b border-stone-200 pb-2">
        <button className="px-4 py-2 bg-amber-500 text-black font-mono text-[10px] uppercase font-bold">
          Admin Dashboard
        </button>
        <button className="px-4 py-2 bg-stone-200 text-stone-500 font-mono text-[10px] uppercase font-bold hover:bg-stone-300">
          API Layer
        </button>
      </div>
      <div className="flex-1 bg-white border border-stone-300">
        <iframe
          src="/dungeon-governor/dashboard/index.html"
          className="w-full h-full border-0"
          title="Admin Dashboard"
          style={{ minHeight: '560px' }}
        />
      </div>
      
    </div>
  )
}
