"use client"

import { useState, useEffect, useRef } from 'react'

const ASSETS = {
  fondo: '/assets/minikari/fondo.png',
  cuerpo: '/assets/minikari/cuerpo.png',
  ojos: '/assets/minikari/ojos.png',
  idle: '/assets/minikari/mini-kari-01.png',
  right: '/assets/minikari/mini-kari-02.png',
  left: '/assets/minikari/mini-kari-03.png',
  up: '/assets/minikari/mini-kari-04.png',
  down: '/assets/minikari/mini-kari-05.png'
}

interface MiniKariProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function MiniKari({ size = 'md' }: MiniKariProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 })
  const [activeDir, setActiveDir] = useState<'idle' | 'right' | 'left' | 'up' | 'down'>('idle')
  const [isBlinking, setIsBlinking] = useState(false)

  const mouseRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const s = size === 'sm' ? 140 : size === 'md' ? 220 : 340
  const radius = size === 'sm' ? 32 : size === 'md' ? 48 : 72

  useEffect(() => {
    Object.values(ASSETS).forEach(src => {
      const img = new Image()
      img.src = src
    })

    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseRef.current = { x: clientX - centerX, y: clientY - centerY }
      }
    }

    window.addEventListener('mousemove', handlePointer)
    window.addEventListener('touchmove', handlePointer)

    let raf: number
    const animate = () => {
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.05 
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.05

      const { x, y } = currentRef.current
      const dist = Math.sqrt(x * x + y * y)
      
      if (dist < 45) {
        setActiveDir('idle')
        setEyePos({ x: (x / 45) * 8, y: (y / 45) * 6 })
      } else {
        const angle = Math.atan2(y, x) * (180 / Math.PI)
        if (angle >= -45 && angle <= 45) setActiveDir('right')
        else if (angle > 135 || angle < -135) setActiveDir('left')
        else if (angle > -135 && angle < -45) setActiveDir('up')
        else if (angle > 45 && angle <= 135) setActiveDir('down')
        setEyePos({ x: (x / dist) * 3, y: (y / dist) * 3 })
      }
      
      raf = requestAnimationFrame(animate)
    }
    animate()

    const blinkInterval = setInterval(() => {
      if (activeDir === 'idle') {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      }
    }, 5000 + Math.random() * 3000)

    return () => {
      window.removeEventListener('mousemove', handlePointer)
      window.removeEventListener('touchmove', handlePointer)
      cancelAnimationFrame(raf)
      clearInterval(blinkInterval)
    }
  }, [activeDir])

  const KariLayer = ({ src, show, blink = false, z = 30 }: any) => (
    <div 
      className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-200 pointer-events-none"
      style={{ 
        backgroundImage: `url(${src})`, 
        opacity: show ? 1 : 0,
        zIndex: z,
        transform: `translate(${eyePos.x}px, ${eyePos.y}px) ${blink && isBlinking ? 'scaleY(0.05)' : 'scaleY(1)'}`,
        transformOrigin: 'center center'
      }}
    />
  )

  return (
    <div 
      ref={containerRef}
      className="relative select-none"
      style={{ 
        width: s, 
        height: s, 
        borderRadius: radius,
        animation: 'vanguard-float 6s ease-in-out infinite' 
      }}
    >
      {/* 1:1 Scale Container - No clipping */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Layer 1: Fondo (Fixed) */}
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat z-10"
          style={{ backgroundImage: `url(${ASSETS.fondo})` }}
        />
        
        {/* Layer 2: Cuerpo (Glow/Breathe Movement) */}
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat z-20"
          style={{ 
            backgroundImage: `url(${ASSETS.cuerpo})`,
            animation: 'vanguard-glow-breath 4s ease-in-out infinite'
          }}
        />
        
        {/* Layer 3+: Eyes / Frames (Tracking) */}
        <KariLayer src={ASSETS.ojos} show={activeDir === 'idle'} blink z={30} />
        <KariLayer src={ASSETS.right} show={activeDir === 'right'} z={31} />
        <KariLayer src={ASSETS.left} show={activeDir === 'left'} z={32} />
        <KariLayer src={ASSETS.up} show={activeDir === 'up'} z={33} />
        <KariLayer src={ASSETS.down} show={activeDir === 'down'} z={34} />
      </div>

      <style jsx>{`
        @keyframes vanguard-glow-breath {
          0%, 100% { 
            transform: scale(1) translateY(0); 
            filter: brightness(0.95) saturate(1); 
            opacity: 0.95;
          }
          50% { 
            transform: scale(1.02) translateY(-2px); 
            filter: brightness(1.1) saturate(1.1); 
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
