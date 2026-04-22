'use client'

// Singleton AudioContext to prevent creating multiple contexts
let audioCtx: AudioContext | null = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

export function playClick() {
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)
  
  gain.gain.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.start()
  osc.stop(ctx.currentTime + 0.1)
}

export function playSuccessChime() {
  const ctx = getAudioContext()
  if (!ctx) return

  const frequencies = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
  
  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = freq
    
    const startTime = ctx.currentTime + index * 0.1
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(startTime)
    osc.stop(startTime + 1.5)
  })
}

let humOsc: OscillatorNode | null = null
let humGain: GainNode | null = null

export function startHum() {
  const ctx = getAudioContext()
  if (!ctx || humOsc) return

  humOsc = ctx.createOscillator()
  humGain = ctx.createGain()
  
  humOsc.type = 'triangle'
  humOsc.frequency.setValueAtTime(60, ctx.currentTime) // Low 60Hz hum
  
  humGain.gain.setValueAtTime(0, ctx.currentTime)
  humGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2) // Fade in smoothly
  
  humOsc.connect(humGain)
  humGain.connect(ctx.destination)
  
  humOsc.start()
}

export function stopHum() {
  const ctx = getAudioContext()
  if (!ctx || !humOsc || !humGain) return
  
  humGain.gain.setValueAtTime(humGain.gain.value, ctx.currentTime)
  humGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1) // Fade out
  
  humOsc.stop(ctx.currentTime + 1)
  humOsc = null
  humGain = null
}
