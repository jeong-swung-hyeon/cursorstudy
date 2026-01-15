import React, { useState, useEffect } from 'react';
import './App.css';
import Memo from './components/Memo';

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  // 메모 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  // 새 메모 생성
  const handleNewMemo = () => {
    const newMemo = {
      id: Date.now(),
      title: '',
      content: '',
      isEditing: true, // 새 메모는 바로 수정 모드
      createdAt: new Date().toISOString(),
    };
    setMemos([newMemo, ...memos]);
  };

  // 메모 업데이트
  const handleUpdateMemo = (id, updatedMemo) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...updatedMemo, id } : memo
    ));
  };

  // 메모 삭제
  const handleDeleteMemo = (id) => {
    setMemos(memos.filter(memo => memo.id !== id));
  };

  // 검색 필터링
  const filteredMemos = memos.filter(memo => {
    const searchLower = searchTerm.toLowerCase();
    return (
      memo.title.toLowerCase().includes(searchLower) ||
      memo.content.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
        <div className="container">
          <h1 className="navbar-brand mb-0 fw-bold">
            <i className="bi bi-journal-text me-2"></i>
            메모 앱
          </h1>
        </div>
      </nav>
      
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <label htmlFor="searchInput" className="form-label fw-semibold">
                      <i className="bi bi-search me-2"></i>메모 검색
                    </label>
                    <input
                      id="searchInput"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="제목이나 내용으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      onClick={handleNewMemo} 
                      className="btn btn-success btn-lg w-100"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      새 메모
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {filteredMemos.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted d-block mb-3"></i>
                  <h4 className="text-muted">
                    {searchTerm ? '검색 결과가 없습니다.' : '메모가 없습니다.'}
                  </h4>
                  <p className="text-muted mb-0">
                    {!searchTerm && '새 메모를 만들어보세요!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {filteredMemos.map(memo => (
                  <div key={memo.id} className="col-12">
                    <Memo
                      memo={memo}
                      onUpdate={handleUpdateMemo}
                      onDelete={handleDeleteMemo}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
