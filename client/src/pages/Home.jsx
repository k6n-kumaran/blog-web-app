import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'

const Home = () => {

  const [posts,setPosts] = useState([])
  useEffect(() => {
    try {
      const fetchPosts = async() => {
        const res = await fetch(`/api/post/posts?limit=9`)
        const data = await res.json();
        if(res.ok) {
            setPosts(data.posts)
        }
      }
      fetchPosts()
    } catch (error) {
      console.log(error.message);
    }
  },[])
  return (
    <div>
      <div className=' flex flex-col gap-6 sm:p-28 p-12 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold  lg:text-5xl'>Welcome to my blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Here you will find some great movies and about the movies.
        Feel free to give a honest review or opinion</p>
       <Link to={'/search'} className='text-xs sm:text-sm text-teal-500  font-bold hover:underline'>
         View all posts
       </Link>
      </div>
      
      <div className='flex flex-col gap-8 py-7 p-3 max-w-6xl mx-auto'>
       {posts && posts.length > 0 && (
          <div className=' flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent posts</h2>
            <div className='flex flex-wrap  gap-4'>
              {posts.map((post,index) => {
                return <PostCard key={index} post={post}/>
              })}
            </div>
            <Link to={'/search'} className='text-lg text-teal-400 text-center hover:underline'>
              View all posts
            </Link>
          </div>
       )}
      </div>
    </div>
  )
}

export default Home