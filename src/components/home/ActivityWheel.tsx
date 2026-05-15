'use client'

import { useState } from 'react'

const activities = [
  { id: 1, name: 'Μονοπάτι Χόρτου', icon: '🥾', category: 'hiking', duration: '60 λεπτά', distance: '4.5 χλμ', difficulty: 'Εύκολο', color: '#4a5d45' },
  { id: 2, name: 'Κολύμβηση', icon: '🏊', category: 'sea', duration: 'Όλη μέρα', distance: null, difficulty: 'Εύκολο', color: '#2C6E8A' },
  { id: 3, name: 'Kayak', icon: '🚣', category: 'sea', duration: '2 ώρες', distance: '8 χλμ', difficulty: 'Μέτριο', color: '#1a5276' },
  { id: 4, name: 'Μηλιές', icon: '🌲', category: 'hiking', duration: '3 ώρες', distance: '10 χλμ', difficulty: 'Μέτριο', color: '#2d6a4f' },
  { id: 5, name: 'Τρίκερι', icon: '⛵', category: 'culture', duration: '4 ώρες', distance: null, difficulty: 'Εύκολο', color: '#5d4037' },
  { id: 6, name: 'Τοπικές Γεύσεις', icon: '🍴', category: 'food', duration: 'Βράδυ', distance: null, difficulty: 'Εύκολο', color: '#6d4c41' },
]

export default function ActivityWheel() {
  const [selected, setSelected] = useState<number | null>(null)

  const selectedActivity = activities.find(a => a.id === selected)

  return (
    <section id="activities" className="bg-[#F9F7F2] py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-light tracking-[-0.02em] text-[#2C1B0E] mb-4 text-center">
          Δραστηριότητες
        </h2>
        <p className="text-center text-[#2C1B0E]/50 text-sm mb-16">
          Εξερευνήστε το Πήλιο
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => setSelected(selected === activity.id ? null : activity.id)}
              className={`p-6 text-left transition-all border ${
                selected === activity.id
                  ? 'border-[#4a5d45] bg-[#4a5d45] text-white'
                  : 'border-gray-200 bg-white hover:border-[#4a5d45]'
              }`}
            >
              <span className="text-3xl mb-3 block">{activity.icon}</span>
              <p className={`font-medium text-sm ${selected === activity.id ? 'text-white' : 'text-[#2C1B0E]'}`}>
                {activity.name}
              </p>
              <p className={`text-xs mt-1 ${selected === activity.id ? 'text-white/70' : 'text-gray-500'}`}>
                {activity.duration}
              </p>
            </button>
          ))}
        </div>

        {selectedActivity && (
          <div className="bg-white border border-[#4a5d45] p-8 max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{selectedActivity.icon}</span>
              <div>
                <h3 className="text-xl font-light text-[#2C1B0E]">{selectedActivity.name}</h3>
                <span className="text-xs text-[#4a5d45] uppercase tracking-wider">{selectedActivity.difficulty}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Διάρκεια</p>
                <p className="text-sm font-medium text-[#2C1B0E]">{selectedActivity.duration}</p>
              </div>
              {selectedActivity.distance && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Απόσταση</p>
                  <p className="text-sm font-medium text-[#2C1B0E]">{selectedActivity.distance}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
