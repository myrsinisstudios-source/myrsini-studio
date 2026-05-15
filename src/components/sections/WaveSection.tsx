export default function WaveSection() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 400 }}>
      <video
        src="https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_25fps.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </div>
  )
}
