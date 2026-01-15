import React, { useState, useEffect } from 'react';
import './Memo.css';

function Memo({ memo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(memo.isEditing || false);
  const [title, setTitle] = useState(memo.title || '');
  const [content, setContent] = useState(memo.content || '');

  // 수정 모드가 변경될 때 상태 업데이트
  useEffect(() => {
    setIsEditing(memo.isEditing || false);
    setTitle(memo.title || '');
    setContent(memo.content || '');
  }, [memo.isEditing, memo.title, memo.content]);

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

  return (
    <div className="card shadow-sm mb-3 memo-card">
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
            <h5 className="card-title mb-0 flex-grow-1 me-3">
              {memo.title || <span className="text-muted">(제목 없음)</span>}
            </h5>
            <div className="btn-group" role="group">
              <button 
                onClick={handleEdit} 
                className="btn btn-outline-primary btn-sm"
                title="수정"
              >
                <i className="bi bi-pencil-square me-1"></i>
                수정
              </button>
              <button 
                onClick={handleDelete} 
                className="btn btn-outline-danger btn-sm"
                title="삭제"
              >
                <i className="bi bi-trash me-1"></i>
                삭제
              </button>
            </div>
          </div>
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
