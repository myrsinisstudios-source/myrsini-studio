'use client'

type Segment = { label: string; value: number; color: string }

const R = 32
const C = 2 * Math.PI * R

export default function DonutChart({ segments, centerLabel }: { segments: Segment[]; centerLabel?: string }) {
  let accumulated = 0

  return (
    <div className="flex items-center gap-5">
      {/* SVG */}
      <svg viewBox="0 0 100 100" width="100" height="100" style={{ flexShrink: 0 }}>
        {/* Track */}
        <circle cx="50" cy="50" r={R} fill="none" stroke="#F0EBE3" strokeWidth="12" />
        {/* Segments */}
        {segments.map(seg => {
          const dash = (seg.value / 100) * C
          const offset = C / 4 - (accumulated / 100) * C
          accumulated += seg.value
          return (
            <circle
              key={seg.label}
              cx="50" cy="50" r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${C}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          )
        })}
        {/* Center hole */}
        <circle cx="50" cy="50" r="22" fill="white" />
        {/* Center text */}
        {centerLabel && (
          <>
            <text x="50" y="46" textAnchor="middle" fontSize="9" fill="#8B7355" fontWeight="500">{centerLabel}</text>
            <text x="50" y="57" textAnchor="middle" fontSize="7" fill="#B0A090">έσοδα</text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
            <div>
              <p className="text-[11px] font-medium leading-none" style={{ color: '#3A2A1A' }}>{seg.label}</p>
              <p className="text-[10px]" style={{ color: '#A09080' }}>{seg.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
