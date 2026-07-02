import { motion } from 'framer-motion'

interface XiaosiAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  talking?: boolean
  className?: string
}

const sizes = { sm: 64, md: 96, lg: 128 }

export default function XiaosiAvatar({ size = 'md', talking = false, className = '' }: XiaosiAvatarProps) {
  const s = sizes[size]

  return (
    <motion.div
      className={`xiaosi-float relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg width={s} height={s} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="60" cy="60" r="56" fill="url(#bgGrad)" />
        <circle cx="60" cy="60" r="56" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Hair */}
        <ellipse cx="60" cy="42" rx="32" ry="28" fill="#2c1810" />
        <path d="M28 45 Q30 25 60 22 Q90 25 92 45" fill="#2c1810" />

        {/* Face */}
        <ellipse cx="60" cy="55" rx="26" ry="28" fill="#fde8d0" />

        {/* Blush */}
        <ellipse cx="42" cy="58" rx="6" ry="3" fill="#ffb4a2" opacity="0.4" />
        <ellipse cx="78" cy="58" rx="6" ry="3" fill="#ffb4a2" opacity="0.4" />

        {/* Eyes */}
        <g className="xiaosi-blink" style={{ transformOrigin: '48px 52px' }}>
          <ellipse cx="48" cy="52" rx="4" ry="5" fill="#2c1810" />
          <circle cx="49" cy="50" r="1.5" fill="white" />
        </g>
        <g className="xiaosi-blink" style={{ transformOrigin: '72px 52px' }}>
          <ellipse cx="72" cy="52" rx="4" ry="5" fill="#2c1810" />
          <circle cx="73" cy="50" r="1.5" fill="white" />
        </g>

        {/* Glasses */}
        <rect x="38" y="46" width="18" height="14" rx="4" stroke="#c41e3a" strokeWidth="1.5" fill="none" />
        <rect x="64" y="46" width="18" height="14" rx="4" stroke="#c41e3a" strokeWidth="1.5" fill="none" />
        <line x1="56" y1="53" x2="64" y2="53" stroke="#c41e3a" strokeWidth="1.5" />

        {/* Mouth */}
        <path
          d={talking ? 'M52 68 Q60 74 68 68' : 'M52 68 Q60 72 68 68'}
          stroke="#c4756a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className={talking ? 'xiaosi-talk' : ''}
          style={{ transformOrigin: '60px 70px' }}
        />

        {/* Body - academic robe */}
        <path d="M35 82 Q60 78 85 82 L88 110 Q60 115 32 110 Z" fill="#c41e3a" />
        <path d="M50 82 L60 90 L70 82" stroke="#d4af37" strokeWidth="1.5" fill="none" />

        {/* Book */}
        <rect x="82" y="85" width="16" height="20" rx="2" fill="#d4af37" />
        <line x1="85" y1="90" x2="95" y2="90" stroke="#fff" strokeWidth="1" />
        <line x1="85" y1="94" x2="93" y2="94" stroke="#fff" strokeWidth="1" />
        <line x1="85" y1="98" x2="95" y2="98" stroke="#fff" strokeWidth="1" />

        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="120" y2="120">
            <stop offset="0%" stopColor="#fff5f5" />
            <stop offset="100%" stopColor="#fee2e2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Name tag */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
        AI学伴·小思
      </div>
    </motion.div>
  )
}
