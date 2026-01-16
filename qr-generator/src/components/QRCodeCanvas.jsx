import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import QRCode from 'qrcode'
import './QRCodeCanvas.css'

const QRCodeCanvas = forwardRef(({ 
  value, 
  index, 
  qrStyle = 'square',
  foregroundColor = '#000000',
  backgroundColor = '#FFFFFF',
  useLogo = true,
  preview = false
}, ref) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const imageLoadedRef = useRef(false)

  useImperativeHandle(ref, () => canvasRef.current, [])

  useEffect(() => {
    // 약간의 지연을 두고 실행 (DOM이 완전히 렌더링된 후)
    const timer = setTimeout(() => {
      if (!canvasRef.current) {
        console.log('Canvas ref가 없습니다')
        return
      }
      
      if (!value || !value.trim()) {
        console.log('Value가 없습니다:', value)
        return
      }

      const canvas = canvasRef.current
      console.log('QR 코드 그리기 시작:', { 
        value, 
        qrStyle, 
        foregroundColor, 
        useLogo,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })

      // 색상 값 검증 및 정규화
      const normalizedForegroundColor = foregroundColor && foregroundColor.startsWith('#') 
        ? foregroundColor 
        : `#${foregroundColor.replace('#', '')}`
      const normalizedBackgroundColor = backgroundColor && backgroundColor.startsWith('#') 
        ? backgroundColor 
        : `#${backgroundColor.replace('#', '')}`
      
      console.log('정규화된 색상:', { normalizedForegroundColor, normalizedBackgroundColor })

      // Canvas 크기 설정 (이미지 포함)
      const size = preview ? 100 : 400
      
      // Canvas 초기화를 위해 크기를 강제로 변경 (항상 초기화되도록)
      canvas.width = size
      canvas.height = size
      
      // 컨텍스트 다시 가져오기 (크기 변경 시 리셋됨)
      const context = canvas.getContext('2d')
      
      // roundRect 폴리필 다시 설정
      if (!context.roundRect) {
        context.roundRect = function(x, y, width, height, radius) {
          this.beginPath()
          this.moveTo(x + radius, y)
          this.lineTo(x + width - radius, y)
          this.quadraticCurveTo(x + width, y, x + width, y + radius)
          this.lineTo(x + width, y + height - radius)
          this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
          this.lineTo(x + radius, y + height)
          this.quadraticCurveTo(x, y + height, x, y + height - radius)
          this.lineTo(x, y + radius)
          this.quadraticCurveTo(x, y, x + radius, y)
          this.closePath()
        }
      }

      // 배경 색상 설정
      context.fillStyle = normalizedBackgroundColor
      context.fillRect(0, 0, size, size)
      
      // 테스트: 명확한 테스트 사각형 그리기 (canvas가 작동하는지 확인)
      context.fillStyle = '#FF0000'
      context.fillRect(10, 10, 50, 50)
      console.log('배경 그리기 완료, 크기:', size, '색상:', normalizedBackgroundColor, 'canvas 크기:', canvas.width, canvas.height)

      // 로고 이미지 미리 로드 (로고를 사용하는 경우)
      const loadLogoImage = () => {
        return new Promise((resolve) => {
          if (!useLogo || preview) {
            resolve(null)
            return
          }

          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => resolve(img)
          img.onerror = () => {
            console.error('이미지 로드 실패')
            resolve(null)
          }
          img.src = '/1.webp'
        })
      }

      // QR 코드와 로고를 함께 그리기
      const drawQRCode = async () => {
        try {
          // QR 코드 데이터 가져오기
          QRCode.create(value, { errorCorrectionLevel: 'H' }, async (error, qr) => {
            if (error) {
              console.error('QR 코드 생성 오류:', error)
              return
            }

            if (!qr || !qr.modules) {
              console.error('QR 코드 모듈이 없습니다')
              return
            }

            console.log('QR 코드 생성 성공, 모듈 수:', qr.modules.length)

            const cells = qr.modules
            const cellSize = size / (cells.length + 8) // margin 포함
            const margin = cellSize * 4

            // QR 코드 그리기 함수
            const drawQRModule = (x, y, moduleSize) => {
              const centerX = x + moduleSize / 2
              const centerY = y + moduleSize / 2
              const radius = moduleSize / 2

              // 색상 설정
              context.fillStyle = normalizedForegroundColor

              switch (qrStyle) {
                case 'rounded':
                  context.beginPath()
                  context.roundRect(x, y, moduleSize, moduleSize, moduleSize * 0.3)
                  context.fill()
                  break
                case 'circle':
                  context.beginPath()
                  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
                  context.fill()
                  break
                case 'smooth':
                  context.beginPath()
                  context.roundRect(x, y, moduleSize, moduleSize, moduleSize * 0.5)
                  context.fill()
                  break
                default: // square
                  context.fillRect(x, y, moduleSize, moduleSize)
              }
            }

            // QR 코드 모듈 그리기
            let moduleCount = 0
            for (let row = 0; row < cells.length; row++) {
              for (let col = 0; col < cells[row].length; col++) {
                if (cells[row][col]) {
                  const x = margin + col * cellSize
                  const y = margin + row * cellSize
                  drawQRModule(x, y, cellSize)
                  moduleCount++
                }
              }
            }
            console.log('QR 코드 모듈 그리기 완료, 모듈 수:', moduleCount)

            // 로고 삽입
            const logoImg = await loadLogoImage()
            console.log('로고 이미지 로드:', { useLogo, preview, logoImg: !!logoImg })
            if (logoImg) {
              const imgSize = size * 0.2
              const centerX = size / 2
              const centerY = size / 2
              const radius = imgSize / 2
              const padding = 15

              // 이미지 주변에 배경색 원형 배경 추가
              context.save()
              context.fillStyle = normalizedBackgroundColor
              context.beginPath()
              context.arc(centerX, centerY, radius + padding, 0, Math.PI * 2)
              context.fill()
              context.restore()

              // 원형 마스크를 위한 경로 생성
              context.save()
              context.beginPath()
              context.arc(centerX, centerY, radius, 0, Math.PI * 2)
              context.clip()

              // 이미지 그리기
              const x = centerX - radius
              const y = centerY - radius
              context.drawImage(logoImg, x, y, imgSize, imgSize)
              context.restore()
            }

            imageLoadedRef.current = true
          })
        } catch (err) {
          console.error('QR 코드 그리기 오류:', err)
        }
      }

      drawQRCode()
    }, 100)

    return () => clearTimeout(timer)
  }, [value, qrStyle, foregroundColor, backgroundColor, useLogo, preview])

  return (
    <div ref={containerRef} className={`qr-canvas-container ${preview ? 'preview' : ''}`}>
      <canvas 
        ref={canvasRef} 
        className="qr-canvas"
        width={preview ? 100 : 400}
        height={preview ? 100 : 400}
        style={{ 
          width: '100%', 
          maxWidth: preview ? '100px' : '400px', 
          height: 'auto',
          display: 'block',
          border: '1px solid #ccc'
        }}
      />
    </div>
  )
})

QRCodeCanvas.displayName = 'QRCodeCanvas'

export default QRCodeCanvas
