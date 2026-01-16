import './StyleCard.css'

function StyleCard({ style, label, isSelected, onClick }) {
  // 스타일별 이미지 파일 매핑
  const styleImageMap = {
    'square': '/basic.png',
    'rounded': '/round.png',
    'circle': '/circle.png',
    'smooth': '/smoth.png'
  }
  
  const imageSrc = styleImageMap[style] || '/basic.png'
  
  return (
    <div 
      className={`style-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="style-card-qr">
        <img 
          src={imageSrc} 
          alt={label}
          className="style-card-image"
        />
      </div>
      <div className="style-card-label">
        {label}
      </div>
    </div>
  )
}

export default StyleCard
