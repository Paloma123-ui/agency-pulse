"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Layout, Zap, MessageSquare, Users, Calendar, User, UserCheck, ArrowRight, Home, ChevronLeft, Video, Coffee, Clock } from 'lucide-react'
import MiniKari from '@/components/MiniKari'

const DEPARTMENTS = ['Creators', 'Thinkers', 'Cuentas', 'Digital']

const TOPICS = [
  { id: 'cultura', label: 'Cultura', icon: Heart },
  { id: 'espacio', label: 'Espacio', icon: Layout },
  { id: 'mejoras', label: 'Mejoras', icon: Zap },
  { id: 'comentarios', label: 'Comentarios', icon: MessageSquare },
  { id: 'ayuda', label: 'Ayuda', icon: Users },
  { id: 'meeting', label: 'Meeting', icon: Calendar },
]

type Step = 'intro' | 'identity' | 'name_input' | 'department' | 'topic' | 'meeting_type' | 'meeting_duration' | 'message' | 'closing'

export default function AgencyPulse() {
  const [step, setStep] = useState<Step>('intro')
  const [history, setHistory] = useState<Step[]>([])
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null)
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [topic, setTopic] = useState('')
  const [meetingType, setMeetingType] = useState('')
  const [meetingDuration, setMeetingDuration] = useState('')
  const [content, setContent] = useState('')

  const navigateTo = (nextStep: Step) => {
    setHistory([...history, step])
    setStep(nextStep)
  }

  const goBack = () => {
    if (history.length > 0) {
      const prevStep = history[history.length - 1]
      setHistory(history.slice(0, -1))
      setStep(prevStep)
    }
  }

  const handleReset = () => {
    setStep('intro')
    setHistory([])
    setIsAnonymous(null)
    setName('')
    setDepartment('')
    setTopic('')
    setMeetingType('')
    setMeetingDuration('')
    setContent('')
  }

  const SplitButton = ({ children, onClick, disabled = false, icon: Icon = null, centered = false }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`liquid-island group ${centered ? 'mx-auto' : 'w-full'} disabled:opacity-30`}
    >
      <div className="liquid-content flex-1">
        {Icon && (
          <div className="icon-square">
            <Icon size={18} className="text-white" />
          </div>
        )}
        <span className="text-base font-medium text-white px-2">{children}</span>
      </div>
      <div className="liquid-arrow">
        <ArrowRight size={20} className="text-white" />
      </div>
    </button>
  )

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAnonymous,
          name: isAnonymous ? 'Anónimo' : name,
          department,
          topic,
          content,
          metadata: {
            meetingType,
            meetingDuration
          }
        })
      })

      if (!response.ok) throw new Error('Error al enviar')
      navigateTo('closing')
    } catch (err) {
      alert('Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#4F46E5]/30 overflow-hidden flex flex-col">
      <div className="vanguard-bg" />
      
      {/* Navigation Bar - ONLY after intro */}
      <AnimatePresence>
        {step !== 'intro' && step !== 'closing' && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-20 px-8 py-8 flex justify-between items-center max-w-lg mx-auto w-full"
          >
            <button 
              onClick={goBack} 
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleReset}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Home size={20} />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 md:px-24 max-w-lg mx-auto py-6">
        <AnimatePresence mode="wait">
          
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }} className="text-center space-y-12">
              <div className="flex justify-center"><MiniKari size="lg" /></div>
              <div className="space-y-6">
                <h1 className="text-2xl font-bold tracking-tight">¡Hola! Soy Mini Kari</h1>
                <p className="text-xl text-white/70 font-light leading-relaxed">
                  Garabato Creative Agency es nuestra casa. Estoy aquí para escucharte y mejorar nuestra cultura juntos.
                </p>
              </div>
              <SplitButton onClick={() => navigateTo('identity')} centered>Comencemos</SplitButton>
            </motion.div>
          )}

          {step === 'identity' && (
            <div key="identity" className="w-full space-y-12">
              <div className="flex flex-col items-center gap-10">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold tracking-tight text-center">¿Qué preferís?</h2>
              </div>
              <div className="grid gap-4">
                <SplitButton icon={User} onClick={() => { setIsAnonymous(true); navigateTo('department'); }}>Anónimo</SplitButton>
                <SplitButton icon={UserCheck} onClick={() => { setIsAnonymous(false); navigateTo('name_input'); }}>Con nombre</SplitButton>
              </div>
            </div>
          )}

          {step === 'name_input' && (
            <div key="name_input" className="w-full space-y-10">
              <div className="flex flex-col items-center gap-8">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold tracking-tight text-center">¿Tu nombre?</h2>
              </div>
              <input 
                autoFocus value={name} onChange={(e) => setName(e.target.value)} 
                placeholder="Escribilo acá..." 
                className="input-glow text-center text-2xl lowercase" 
              />
              <SplitButton onClick={() => navigateTo('department')} disabled={name.length < 2} centered>Continuar</SplitButton>
            </div>
          )}

          {step === 'department' && (
            <div key="department" className="w-full space-y-12">
              <div className="flex flex-col items-center gap-8">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold tracking-tight">¿Área de trabajo?</h2>
              </div>
              <div className="grid gap-3">
                {DEPARTMENTS.map((dept, i) => (
                  <motion.div key={dept} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <SplitButton onClick={() => { setDepartment(dept); navigateTo('topic'); }}>{dept}</SplitButton>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step === 'topic' && (
            <div key="topic" className="w-full space-y-12">
              <div className="flex flex-col items-center gap-8">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold tracking-tight text-center">¿Sobre qué charlamos?</h2>
              </div>
              <div className="grid gap-3">
                {TOPICS.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <SplitButton icon={t.icon} onClick={() => { 
                      setTopic(t.id); 
                      if (t.id === 'meeting') navigateTo('meeting_type');
                      else navigateTo('message');
                    }}>
                      {t.label}
                    </SplitButton>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step === 'meeting_type' && (
            <div key="meeting_type" className="w-full space-y-10">
              <div className="flex flex-col items-center gap-8">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold tracking-tight text-center">¿Tipo de reunión?</h2>
              </div>
              <div className="grid gap-4">
                <SplitButton icon={Video} onClick={() => { setMeetingType('Virtual'); navigateTo('meeting_duration'); }}>Virtual</SplitButton>
                <SplitButton icon={Coffee} onClick={() => { setMeetingType('Presencial'); navigateTo('meeting_duration'); }}>Presencial</SplitButton>
              </div>
            </div>
          )}

          {step === 'meeting_duration' && (
            <div key="meeting_duration" className="w-full space-y-10">
              <div className="flex flex-col items-center gap-8">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold tracking-tight text-center">¿Duración?</h2>
              </div>
              <div className="grid gap-3">
                {['15', '30', '60'].map((d) => (
                  <SplitButton key={d} icon={Clock} onClick={() => { setMeetingDuration(d); navigateTo('message'); }}>{d} min</SplitButton>
                ))}
              </div>
            </div>
          )}

          {step === 'message' && (
            <div key="message" className="w-full space-y-10">
              <div className="flex items-center gap-6">
                <MiniKari size="sm" />
                <h2 className="text-xl font-bold italic tracking-tight">
                  {topic === 'meeting' ? '¿De qué tratamos?' : 'Te escucho...'}
                </h2>
              </div>
              <textarea autoFocus value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribí aquí..." className="input-glow min-h-[250px] resize-none lowercase" />
              <SplitButton onClick={handleSubmit} disabled={content.length < 5} centered>Enviar mensaje</SplitButton>
            </div>
          )}

          {step === 'closing' && (
            <motion.div key="closing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
              <div className="flex justify-center"><MiniKari size="lg" /></div>
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight">¡Enviado! 🎉</h2>
                <div className="text-xl text-white/70 font-light leading-relaxed whitespace-pre-line">
                  {`Kari y Mini Kari ya recibieron tu mensaje.
                  Gracias por ayudarnos a hacer
                  de Garabato la mejor agencia
                  del Paraguay 🇵🇾`}
                </div>
                <div className="flex justify-center pt-6">
                  <div className="text-2xl font-bold text-white tracking-normal opacity-90">
                    Garabato es cultura
                  </div>
                </div>
              </div>
              <SplitButton onClick={handleReset} centered>Finalizar</SplitButton>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-10 flex flex-col items-center">
        <div className="text-white/5 text-[8px] tracking-[0.7em] uppercase font-bold text-center">
          GARABATO CREATIVE AGENCY - PEOPLE FIRST
        </div>
      </footer>
    </div>
  )
}
