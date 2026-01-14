import React, { useState } from 'react'
import './Post.css'

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments)

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      setComments([...comments, { username: 'you', text: commentText }])
      setCommentText('')
    }
  }

  return (
    <div className="post">
      {/* 헤더 */}
      <div className="post-header">
        <div className="post-header-left">
          <img 
            src={post.profileImage} 
            alt={post.username}
            className="profile-image"
          />
          <span className="username">{post.username}</span>
        </div>
        <div className="post-header-right">
          <span className="more-options">⋯</span>
        </div>
      </div>

      {/* 이미지 */}
      <div className="post-image-container">
        <img 
          src={post.postImage} 
          alt={post.caption}
          className="post-image"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button 
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            aria-label="좋아요"
          >
            <svg aria-label="좋아요" className="icon" fill={liked ? "#ed4956" : "currentColor"} height="24" role="img" viewBox="0 0 24 24" width="24">
              {liked ? (
                <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
              ) : (
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
              )}
            </svg>
          </button>
          <button 
            className="comment-button"
            onClick={() => setShowComments(!showComments)}
            aria-label="댓글"
          >
            <svg aria-label="댓글" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22l-1.344-4.992Zm-2.33-9.795a6.997 6.997 0 0 1-5.326-2.643 7.003 7.003 0 0 1 5.326 2.643Z" fillRule="evenodd"></path>
            </svg>
          </button>
          <button className="share-button" aria-label="공유">
            <svg aria-label="공유" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
              <polygon fill="none" points="11.698 20.334 22 3 2 3 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
            </svg>
          </button>
        </div>
        <div className="post-actions-right">
          <button className="save-button" aria-label="저장">
            <svg aria-label="저장" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* 좋아요 수 */}
      <div className="post-likes">
        <strong>{likes.toLocaleString()}명</strong>이 좋아합니다
      </div>

      {/* 캡션 */}
      <div className="post-caption">
        <strong>{post.username}</strong> {post.caption}
      </div>

      {/* 댓글 보기 */}
      {comments.length > 0 && (
        <div className="post-comments-preview">
          {showComments ? (
            <button 
              className="view-comments-btn"
              onClick={() => setShowComments(false)}
            >
              댓글 숨기기
            </button>
          ) : (
            <button 
              className="view-comments-btn"
              onClick={() => setShowComments(true)}
            >
              댓글 {comments.length}개 모두 보기
            </button>
          )}
        </div>
      )}

      {/* 댓글 목록 */}
      {showComments && (
        <div className="post-comments">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.username}</strong> {comment.text}
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력 */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="댓글 달기..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
        />
        <button 
          type="submit" 
          className={`comment-submit ${commentText.trim() ? 'active' : ''}`}
        >
          게시
        </button>
      </form>

      {/* 타임스탬프 */}
      <div className="post-timestamp">
        {post.timestamp}
      </div>
    </div>
  )
}

export default Post
