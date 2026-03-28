import { TopConsumers } from '../dashboard/TopConsumers'

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-card border border-[var(--color-border)] rounded-card hidden md:flex md:flex-col sticky top-20 self-start">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Top Consumers
        </h2>
        <TopConsumers />
      </div>
    </aside>
  )
}
