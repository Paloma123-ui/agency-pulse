"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  disabled,
  type = 'button'
}: ButtonProps) {
  const variants = {
    primary: 'apple-button-primary',
    secondary: 'apple-button-secondary',
    ghost: 'hover:bg-[var(--muted)] text-[var(--foreground)] apple-button'
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(variants[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
    >
      {children}
    </motion.button>
  )
}
