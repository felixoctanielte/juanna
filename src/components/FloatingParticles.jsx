import { useEffect, useRef } from 'react'

export default function FloatingParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const NUM = 120
    const particles = Array.from({ length: NUM }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.8 + 0.4,
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    -(Math.random() * 0.4 + 0.1),
      alpha: Math.random(),
      da:    (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
      color: ['#d4af37','#f5d97e','#ff9eb5','#c9a0dc','#ffffff'][Math.floor(Math.random() * 5)],
      type:  Math.random() < 0.3 ? 'star' : 'circle',
    }))

    const drawStar = (x, y, r, alpha, color) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.shadowBlur = 6
      ctx.shadowColor = color
      ctx.translate(x, y)
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const b = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2
        if (i === 0) ctx.moveTo(Math.cos(a) * r * 2.2, Math.sin(a) * r * 2.2)
        else ctx.lineTo(Math.cos(a) * r * 2.2, Math.sin(a) * r * 2.2)
        ctx.lineTo(Math.cos(b) * r, Math.sin(b) * r)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x  += p.vx
        p.y  += p.vy
        p.alpha += p.da
        if (p.alpha <= 0 || p.alpha >= 1) p.da *= -1
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        if (p.type === 'star') {
          drawStar(p.x, p.y, p.r, p.alpha * 0.8, p.color)
        } else {
          ctx.save()
          ctx.globalAlpha = p.alpha * 0.7
          ctx.fillStyle = p.color
          ctx.shadowBlur = 8
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })
      animId = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
