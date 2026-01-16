import React, { useState, useEffect } from 'react';
import './Memo.css';

function Memo({ memo, onUpdate, onDelete, onColorChange, onToggleStar }) {
  const [isEditing, setIsEditing] = useState(memo.isEditing || false);
  const [title, setTitle] = useState(memo.title || '');
  const [content, setContent] = useState(memo.content || '');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 수정 모드가 변경될 때 상태 업데이트
  useEffect(() => {
    setIsEditing(memo.isEditing || false);
    setTitle(memo.title || '');
    setContent(memo.content || '');
  }, [memo.isEditing, memo.title, memo.content]);

  // 색상 옵션
  const colorOptions = [
    { name: 'default', label: '기본', class: 'memo-color-default' },
    { name: 'yellow', label: '노란색', class: 'memo-color-yellow' },
    { name: 'green', label: '초록색', class: 'memo-color-green' },
    { name: 'blue', label: '파란색', class: 'memo-color-blue' },
    { name: 'pink', label: '분홍색', class: 'memo-color-pink' },
    { name: 'purple', label: '보라색', class: 'memo-color-purple' },
  ];

  // 수정 모드로 전환
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 저장
  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onUpdate(memo.id, {
        ...memo,
        title: title.trim(),
        content: content.trim(),
        isEditing: false,
      });
      setIsEditing(false);
    }
  };

  // 취소 (수정 모드 종료)
  const handleCancel = () => {
    setTitle(memo.title || '');
    setContent(memo.content || '');
    setIsEditing(false);
  };

  // 삭제
  const handleDelete = () => {
    if (window.confirm('이 메모를 삭제하시겠습니까?')) {
      onDelete(memo.id);
    }
  };

  // 색상 변경
  const handleColorSelect = (color) => {
    onColorChange(memo.id, color);
    setShowColorPicker(false);
  };

  // 메모 카드 클릭 (색상 선택기 토글)
  const handleCardClick = (e) => {
    // 버튼이나 입력 필드를 클릭한 경우는 무시
    if (e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' ||
        e.target.closest('button') ||
        e.target.closest('.color-picker')) {
      return;
    }
    
    if (!isEditing) {
      setShowColorPicker(!showColorPicker);
    }
  };

  const currentColor = colorOptions.find(c => c.name === (memo.color || 'default'));

  return (
    <div 
      className={`card shadow-sm mb-3 memo-card ${currentColor?.class || 'memo-color-default'}`}
      onClick={handleCardClick}
      style={{ cursor: isEditing ? 'default' : 'pointer' }}
    >
      {isEditing ? (
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor={`title-${memo.id}`} className="form-label fw-semibold">
              제목
            </label>
            <input
              id={`title-${memo.id}`}
              type="text"
              className="form-control form-control-lg"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label htmlFor={`content-${memo.id}`} className="form-label fw-semibold">
              내용
            </label>
            <textarea
              id={`content-${memo.id}`}
              className="form-control"
              rows="8"
              placeholder="내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button onClick={handleSave} className="btn btn-primary">
              <i className="bi bi-check-circle me-2"></i>
              저장
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              <i className="bi bi-x-circle me-2"></i>
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1 me-3">
              <h5 className="card-title mb-0 d-flex align-items-center">
                {memo.isStarred && (
                  <i className="bi bi-star-fill text-warning me-2"></i>
                )}
                {memo.title || <span className="text-muted">(제목 없음)</span>}
              </h5>
            </div>
            <div className="btn-group" role="group">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(memo.id);
                }}
                className={`btn btn-sm ${memo.isStarred ? 'btn-warning' : 'btn-outline-warning'}`}
                title={memo.isStarred ? '중요 표시 해제' : '중요 표시'}
              >
                <i className={`bi ${memo.isStarred ? 'bi-star-fill' : 'bi-star'}`}></i>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="btn btn-outline-primary btn-sm"
                title="수정"
              >
                <i className="bi bi-pencil-square me-1"></i>
                수정
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="btn btn-outline-danger btn-sm"
                title="삭제"
              >
                <i className="bi bi-trash me-1"></i>
                삭제
              </button>
            </div>
          </div>
          
          {showColorPicker && (
            <div className="color-picker mb-3 p-3 bg-light rounded" onClick={(e) => e.stopPropagation()}>
              <label className="form-label fw-semibold mb-2">색상 선택</label>
              <div className="d-flex gap-2 flex-wrap">
                {colorOptions.map(color => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name)}
                    className={`btn ${memo.color === color.name ? 'btn-primary' : 'btn-outline-secondary'} color-option ${color.class}`}
                    title={color.label}
                  >
                    <i className="bi bi-palette me-1"></i>
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <p className="card-text text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>
            {memo.content || <span className="text-muted">(내용 없음)</span>}
          </p>
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {new Date(memo.createdAt).toLocaleString('ko-KR')}
          </small>
        </div>
      )}
    </div>
  );
}

export default Memo;
