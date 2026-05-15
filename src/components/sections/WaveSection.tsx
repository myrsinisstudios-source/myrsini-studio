import Image from 'next/image'

export default function WaveSection() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 400 }}>
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
        alt="Ήρεμη παραλία με κύμα"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  )
}
