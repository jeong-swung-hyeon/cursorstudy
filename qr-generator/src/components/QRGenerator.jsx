import { useState, useRef } from 'react'
import QRCodeCanvas from './QRCodeCanvas'
import StyleCard from './StyleCard'
import './QRGenerator.css'

function QRGenerator() {
  const [links, setLinks] = useState([''])
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRefs = useRef({})
  
  // 미리 정의된 색상 팔레트
  const colorPalette = [
    '#FF0000', // 빨강
    '#FF8C00', // 주황
    '#FFD700', // 노랑
    '#00FF00', // 초록
    '#00CED1', // 하늘색
    '#0000FF', // 파랑
    '#5720F2', // 보라
    '#000000'  // 검정
  ]
  
  // 스타일 설정 상태
  const [settings, setSettings] = useState({
    qrStyle: 'rounded', // square, rounded, circle, smooth
    foregroundColor: '#000000',
    useLogo: true
  })
  
  // QR 코드 스타일 옵션
  const qrStyles = [
    { value: 'square', label: '기본형' },
    { value: 'rounded', label: '라운드형' },
    { value: 'circle', label: '원형' },
    { value: 'smooth', label: '부드러운형' }
  ]

  const handleLinkChange = (index, value) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const handleAddLink = () => {
    if (links.length < 10) {
      setLinks([...links, ''])
    }
  }

  const handleRemoveLink = (index) => {
    if (links.length > 1) {
      const newLinks = links.filter((_, i) => i !== index)
      setLinks(newLinks)
    }
  }

  const handleGenerate = async () => {
    const validLinks = links.filter(link => link.trim() !== '')
    if (validLinks.length === 0) {
      alert('최소 1개 이상의 링크를 입력해주세요.')
      return
    }

    setIsGenerating(true)

    try {
      // 모든 QR 코드가 완전히 렌더링될 때까지 대기 (로고 이미지 로드 포함)
      await new Promise(resolve => setTimeout(resolve, 2500))

      // 각 QR 코드를 순차적으로 다운로드
      for (let i = 0; i < validLinks.length; i++) {
        const canvas = canvasRefs.current[`qr-${i}`]
        
        if (canvas && canvas instanceof HTMLCanvasElement) {
          // Canvas를 Blob으로 변환하고 다운로드
          await new Promise((resolve) => {
            try {
              canvas.toBlob((blob) => {
                if (blob && blob.size > 100) { // 빈 이미지가 아닌지 확인
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `qr-code-${i + 1}.png`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }
                setTimeout(resolve, 300)
              }, 'image/png')
            } catch (error) {
              console.error('Canvas 변환 오류:', error)
              setTimeout(resolve, 300)
            }
          })
        }
      }

      alert(`${validLinks.length}개의 QR 코드가 생성되었습니다!`)
    } catch (error) {
      console.error('QR 코드 생성 중 오류:', error)
      alert('QR 코드 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="qr-generator">
      <div className="settings-section">
        <h2 className="section-title">스타일 설정</h2>
        
        <div className="setting-group">
          <label className="setting-label">코드 스타일</label>
          <div className="style-cards-container">
            {qrStyles.map((style) => (
              <StyleCard
                key={style.value}
                style={style.value}
                label={style.label}
                isSelected={settings.qrStyle === style.value}
                onClick={() => handleSettingChange('qrStyle', style.value)}
              />
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">스킨 스타일</label>
          <div className="color-picker-container">
            <div className="color-input-wrapper">
              <input
                type="text"
                value={settings.foregroundColor}
                onChange={(e) => {
                  let value = e.target.value.trim()
                  // #가 없으면 추가
                  if (value && !value.startsWith('#')) {
                    value = '#' + value
                  }
                  // hex 색상 형식 검증
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '' || value === '#') {
                    handleSettingChange('foregroundColor', value || '#000000')
                  }
                }}
                onBlur={(e) => {
                  // 포커스를 잃을 때 유효하지 않은 값이면 기본값으로 설정
                  let value = e.target.value.trim()
                  if (!value || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    handleSettingChange('foregroundColor', '#000000')
                  }
                }}
                className="color-hex-input"
                placeholder="#000000"
                maxLength={7}
              />
              <div 
                className="color-swatch-inline"
                style={{ backgroundColor: settings.foregroundColor }}
              />
            </div>
            <div className="color-palette">
              {colorPalette.map((color) => (
                <div
                  key={color}
                  className={`color-swatch ${settings.foregroundColor.toUpperCase() === color.toUpperCase() ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleSettingChange('foregroundColor', color)}
                >
                  {settings.foregroundColor.toUpperCase() === color.toUpperCase() && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={settings.useLogo}
              onChange={(e) => handleSettingChange('useLogo', e.target.checked)}
              className="checkbox-input"
            />
            로고 중앙 삽입
          </label>
        </div>
      </div>

      <div className="links-section">
        <h2 className="section-title">링크 입력</h2>
        {links.map((link, index) => (
          <div key={index} className="link-input-group">
            <input
              type="text"
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              placeholder={`링크 ${index + 1}을(를) 입력하세요`}
              className="link-input"
            />
            {links.length > 1 && (
              <button
                onClick={() => handleRemoveLink(index)}
                className="remove-btn"
                title="삭제"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {links.length < 10 && (
          <button onClick={handleAddLink} className="add-btn">
            + 추가
          </button>
        )}
      </div>

      <div className="preview-section">
        <h2 className="section-title">미리보기</h2>
        <div className="qr-preview-grid">
          {links.map((link, index) => {
            if (link.trim() === '') return null
            return (
              <div key={index} className="qr-preview-item">
                <QRCodeCanvas
                  key={`${index}-${settings.qrStyle}-${settings.foregroundColor}-${settings.useLogo}`}
                  ref={(el) => {
                    if (el) {
                      canvasRefs.current[`qr-${index}`] = el
                    }
                  }}
                  value={link}
                  index={index}
                  qrStyle={settings.qrStyle}
                  foregroundColor={settings.foregroundColor}
                  backgroundColor="#FFFFFF"
                  useLogo={settings.useLogo}
                />
                <p className="qr-label">링크 {index + 1}</p>
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || links.filter(l => l.trim() !== '').length === 0}
        className="generate-btn"
      >
        {isGenerating ? '생성 중...' : '생성'}
      </button>
    </div>
  )
}

export default QRGenerator
