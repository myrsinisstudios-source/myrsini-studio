'use client'

export default function WaveSection() {
  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ height: 200, background: '#45B7D1' }}
    >
      <style>{`
        @keyframes wave1 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave3 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes foam {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.6; }
        }
        @keyframes pebble-drift {
          0%, 100% { opacity: 0.55; transform: scaleX(1); }
          50%       { opacity: 0.7;  transform: scaleX(1.04); }
        }
      `}</style>

      {/* ── Sky gradient at top ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #45B7D1 0%, #4ECDC4 55%, #96CEB4 100%)',
        }}
      />

      {/* ── Wave layer 3 (back, slowest, lightest) ── */}
      <div
        className="absolute"
        style={{
          bottom: 52,
          left: 0,
          width: '200%',
          height: 70,
          animation: 'wave3 6s linear infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          style={{ width: '50%', height: '100%', display: 'inline-block' }}
        >
          <path
            d="M0 40 C180 10, 360 70, 540 40 C720 10, 900 70, 1080 40 C1260 10, 1440 55, 1440 40 L1440 70 L0 70 Z"
            fill="#96CEB4"
            fillOpacity="0.45"
          />
        </svg>
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          style={{ width: '50%', height: '100%', display: 'inline-block' }}
        >
          <path
            d="M0 40 C180 10, 360 70, 540 40 C720 10, 900 70, 1080 40 C1260 10, 1440 55, 1440 40 L1440 70 L0 70 Z"
            fill="#96CEB4"
            fillOpacity="0.45"
          />
        </svg>
      </div>

      {/* ── Wave layer 2 (mid, medium speed) ── */}
      <div
        className="absolute"
        style={{
          bottom: 34,
          left: 0,
          width: '200%',
          height: 80,
          animation: 'wave2 4.5s linear infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ width: '50%', height: '100%', display: 'inline-block' }}
        >
          <path
            d="M0 50 C200 15, 400 75, 600 45 C800 15, 1000 72, 1200 42 C1300 28, 1380 55, 1440 50 L1440 80 L0 80 Z"
            fill="#4ECDC4"
            fillOpacity="0.6"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ width: '50%', height: '100%', display: 'inline-block' }}
        >
          <path
            d="M0 50 C200 15, 400 75, 600 45 C800 15, 1000 72, 1200 42 C1300 28, 1380 55, 1440 50 L1440 80 L0 80 Z"
            fill="#4ECDC4"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* ── Wave layer 1 (front, fastest) ── */}
      <div
        className="absolute"
        style={{
          bottom: 18,
          left: 0,
          width: '200%',
          height: 90,
          animation: 'wave1 3.5s linear infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ width: '50%', height: '100%', display: 'inline-block' }}
        >
          <path
            d="M0 55 C160 20, 320 85, 480 52 C640 18, 800 80, 960 50 C1120 18, 1300 78, 1440 55 L1440 90 L0 90 Z"
            fill="#4ECDC4"
            fillOpacity="0.85"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ width: '50%', height: '100%', display: 'inline-block' }}
        >
          <path
            d="M0 55 C160 20, 320 85, 480 52 C640 18, 800 80, 960 50 C1120 18, 1300 78, 1440 55 L1440 90 L0 90 Z"
            fill="#4ECDC4"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {/* ── Foam strip (white opacity animation at wave edge) ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 16,
          height: 8,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
          animation: 'foam 3.5s ease-in-out infinite',
        }}
      />

      {/* ── Sand base ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 22,
          background: 'linear-gradient(to bottom, #e8d5a3 0%, #F4E4C1 60%, #EDD9AA 100%)',
        }}
      />

      {/* ── Wet sand (transition from water to sand) ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 18,
          height: 10,
          background: 'linear-gradient(to bottom, rgba(180,220,210,0.55) 0%, rgba(232,213,163,0.9) 100%)',
        }}
      />

      {/* ── Pebbles (CSS circles on sand) ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 22, animation: 'pebble-drift 5s ease-in-out infinite' }}
      >
        {[
          { left: '4%',   w: 10, h: 7,  op: 0.45, delay: '0s' },
          { left: '9%',   w: 6,  h: 5,  op: 0.35, delay: '0.4s' },
          { left: '15%',  w: 14, h: 9,  op: 0.4,  delay: '0.8s' },
          { left: '21%',  w: 8,  h: 6,  op: 0.3,  delay: '0.2s' },
          { left: '28%',  w: 11, h: 7,  op: 0.45, delay: '1s' },
          { left: '35%',  w: 7,  h: 5,  op: 0.35, delay: '0.6s' },
          { left: '41%',  w: 13, h: 8,  op: 0.4,  delay: '1.2s' },
          { left: '48%',  w: 9,  h: 6,  op: 0.3,  delay: '0.3s' },
          { left: '54%',  w: 16, h: 10, op: 0.45, delay: '0.9s' },
          { left: '61%',  w: 7,  h: 5,  op: 0.35, delay: '0.5s' },
          { left: '67%',  w: 11, h: 7,  op: 0.4,  delay: '1.4s' },
          { left: '73%',  w: 8,  h: 6,  op: 0.3,  delay: '0.1s' },
          { left: '79%',  w: 13, h: 8,  op: 0.45, delay: '0.7s' },
          { left: '85%',  w: 6,  h: 5,  op: 0.35, delay: '1.1s' },
          { left: '91%',  w: 10, h: 7,  op: 0.4,  delay: '0.4s' },
          { left: '96%',  w: 8,  h: 6,  op: 0.3,  delay: '0.8s' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: 3,
              width: p.w,
              height: p.h,
              background: `rgba(160,130,90,${p.op})`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>
    </div>
  )
}
