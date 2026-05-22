'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type EL = ReturnType<typeof useLanguage>['t']['emergencyLabels']

type StaticItem = { icon: string; number: string; labelKey: keyof EL; noteKey: keyof EL }
type StaticGroup = { key: keyof EL; items: StaticItem[] }

const STATIC_GROUPS: StaticGroup[] = [
  { key: 'national', items: [
    { icon: '🚔', number: '100',                labelKey: 'police',     noteKey: 'nationwide'      },
    { icon: '🚒', number: '199',                labelKey: 'fire',       noteKey: 'nationwide'      },
    { icon: '🚑', number: '166',                labelKey: 'ambulance',  noteKey: 'ambulanceNote'   },
    { icon: '⚓', number: '108',                labelKey: 'coastguard', noteKey: 'seaSOS'          },
  ]},
  { key: 'local', items: [
    { icon: '🏥', number: '+30 24210 94200', labelKey: 'hospital',    noteKey: 'generalHospital' },
    { icon: '👮', number: '+30 24220 22100', labelKey: 'localPolice', noteKey: 'localStation'    },
    { icon: '🩺', number: '+30 24230 54400', labelKey: 'clinic',      noteKey: 'ruralClinic'     },
    { icon: '⚡', number: '10400',           labelKey: 'power',       noteKey: 'powerFaults'     },
  ]},
  { key: 'useful', items: [
    { icon: '🌿', number: '+30 694 457 1280', labelKey: 'studios', noteKey: 'whatsappCall' },
    { icon: '🚕', number: '+30 694 000 0001', labelKey: 'taxi',    noteKey: 'localTaxi'    },
    { icon: '⛽', number: '+30 24230 65000',  labelKey: 'petrol',  noteKey: 'argalasti'    },
    { icon: '🏦', number: '+30 24220 21000',  labelKey: 'bank',    noteKey: 'nearest'      },
  ]},
]

// Map Greek DB category values → translation key
const CAT_KEY: Record<string, keyof EL> = {
  'Εθνική Ανάγκη': 'national',
  'Τοπικά':        'local',
  'Χρήσιμα':       'useful',
}

type DbContact = { id: string; icon: string; label: string; number: string; description: string; category: string; sort_order: number }
type DbGroup   = { category: string; items: { icon: string; label: string; number: string; note: string }[] }

export default function EmergencyGrid({ phone }: { phone?: string }) {
  const { t } = useLanguage()
  const e  = t.emergency
  const el = t.emergencyLabels
  const [dbGroups, setDbGroups] = useState<DbGroup[] | null>(null)

  const studiosPhone = phone ?? '+30 694 457 1280'
  const staticGroups = STATIC_GROUPS.map(g => ({
    ...g,
    items: g.items.map(i => i.labelKey === 'studios' ? { ...i, number: studiosPhone } : i),
  }))

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient()
        .from('emergency_contacts')
        .select('*')
        .order('sort_order')
        .then(({ data }) => {
          if (data && data.length > 0) {
            const byCategory: Record<string, DbContact[]> = {}
            ;(data as DbContact[]).forEach(c => {
              if (!byCategory[c.category]) byCategory[c.category] = []
              byCategory[c.category].push(c)
            })
            setDbGroups(
              Object.entries(byCategory).map(([category, items]) => ({
                category,
                items: items.map(c => ({ icon: c.icon, label: c.label, number: c.number, note: c.description })),
              }))
            )
          }
        })
    })
  }, [])

  return (
    <section className="py-24 bg-deep-wood">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase text-olive mb-3">{e.eyebrow}</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-white mb-3">{e.title}</h2>
          <p className="text-white/40 text-sm">{e.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {dbGroups
            ? dbGroups.map(group => {
                const catKey = CAT_KEY[group.category]
                const heading = catKey ? el[catKey] : group.category
                return (
                  <div key={group.category}>
                    <h3 className="text-xs tracking-widest uppercase text-white/30 mb-4 pb-2 border-b border-white/10">
                      {heading}
                    </h3>
                    <div className="space-y-3">
                      {group.items.map(item => (
                        <ContactCard key={item.label} icon={item.icon} label={item.label} number={item.number} note={item.note} />
                      ))}
                    </div>
                  </div>
                )
              })
            : staticGroups.map(group => (
                <div key={group.key as string}>
                  <h3 className="text-xs tracking-widest uppercase text-white/30 mb-4 pb-2 border-b border-white/10">
                    {el[group.key]}
                  </h3>
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <ContactCard
                        key={item.labelKey as string}
                        icon={item.icon}
                        label={el[item.labelKey]}
                        number={item.number}
                        note={el[item.noteKey]}
                      />
                    ))}
                  </div>
                </div>
              ))
          }
        </div>

        <div className="mt-10 p-5 border border-red-500/30 bg-red-950/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="text-4xl">🆘</span>
          <div>
            <p className="text-white font-medium mb-1">{e.sosTitle}</p>
            <p className="text-white/50 text-sm">
              {e.sosCall}{' '}
              <strong className="text-red-400 font-mono text-lg">112</strong>{' '}
              {e.sosDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactCard({ icon, label, number, note }: { icon: string; label: string; number: string; note: string }) {
  return (
    <a
      href={`tel:${number.replace(/\s/g, '')}`}
      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 transition-all group"
    >
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors truncate">{label}</div>
        <div className="text-white/40 text-xs mt-0.5">{note}</div>
      </div>
      <span className="text-olive font-mono text-sm shrink-0 group-hover:text-white transition-colors">{number}</span>
    </a>
  )
}
