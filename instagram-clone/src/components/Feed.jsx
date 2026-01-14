import React from 'react'
import Post from './Post'
import './Feed.css'

const Feed = () => {
  // 피드 데이터
  const posts = [
    {
      id: 1,
      username: 'park_user',
      profileImage: '/images/park.jpg',
      postImage: '/images/KakaoTalk_20251231_080119210_19.jpg',
      likes: 123,
      caption: '오늘의 일상 📸',
      comments: [
        { username: 'friend1', text: '너무 예뻐요!' },
        { username: 'friend2', text: '좋아요 👍' }
      ],
      timestamp: '2시간 전'
    },
    {
      id: 2,
      username: 'won_user',
      profileImage: '/images/won.jpeg',
      postImage: '/images/KakaoTalk_20251231_080119210_22.jpg',
      likes: 456,
      caption: '맛있는 식사 🍽️',
      comments: [
        { username: 'friend3', text: '맛있어 보여요!' }
      ],
      timestamp: '5시간 전'
    },
    {
      id: 3,
      username: 'park_user',
      profileImage: '/images/park.jpg',
      postImage: '/images/KakaoTalk_20251231_080119210_24.jpg',
      likes: 789,
      caption: '여행 중 ✈️',
      comments: [],
      timestamp: '1일 전'
    },
    {
      id: 4,
      username: 'won_user',
      profileImage: '/images/won.jpeg',
      postImage: '/images/KakaoTalk_20251231_080244852_01.jpg',
      likes: 234,
      caption: '좋은 하루 🌞',
      comments: [
        { username: 'friend4', text: '행복해 보여요!' },
        { username: 'friend5', text: '좋은 하루 되세요!' }
      ],
      timestamp: '2일 전'
    },
    {
      id: 5,
      username: 'park_user',
      profileImage: '/images/park.jpg',
      postImage: '/images/KakaoTalk_20251231_080244852_04.jpg',
      likes: 567,
      caption: '새로운 시작 🎉',
      comments: [],
      timestamp: '3일 전'
    }
  ]

  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
