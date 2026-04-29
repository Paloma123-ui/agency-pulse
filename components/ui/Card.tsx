"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function Card({ children, className, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.23, 1, 0.32, 1] // Apple-style ease-out
      }}
      className={cn(
        'glass rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
