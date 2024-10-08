import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {Button, Spinner} from 'flowbite-react'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'


const PostPage = () => {
    const {postSlug} = useParams()
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [post , setPost] = useState(null)
    const [recentPosts,setRecentPosts] = useState(null)
 
    useEffect(() => {
        const fetchPost = async  () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/posts?slug=${postSlug}`)
                const data = await res.json();
                if(!res.ok) {
                    setError(true);
                    setLoading(false)
                }
                if(res.ok) {
                    setPost(data.posts[0])
                    setError(false);
                    setLoading(false)
                }
            } catch (error) {
                setError(true);
                setLoading(false)                
            }
        }

        fetchPost()
    },[postSlug])

    useEffect(() => {
      try {
        const fetchRecentPosts = async() => {
          const res = await fetch(`/api/post/posts?limit=3`)
          const data = await res.json();
          if(res.ok) {
              setRecentPosts(data.posts)
          }
        }
        fetchRecentPosts()
      } catch (error) {
        console.log(error.message); 
      }
    },[])

    if(loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <Spinner size={'xl'} />
        </div>
    }
  return (
    <main className='p-3 flex flex-col min-h-screen mx-auto max-w-6xl'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link to={`/search/category=${post && post.category}`} className=' self-center mt-5' >
        <Button color={'gray'} pill size={'xs'}>{post && post.category}</Button>
      </Link>
      <img src={post && post.photo} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'  />
      <div className='flex justify-between p-3 border-b border-slate-300 text-sm'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className=' italic'>{post && (post.content.length/100).toFixed(0)} mins read</span>
      </div>
      <div
      className='w-full max-w-2xl mx-auto p-3 post-content'
       dangerouslySetInnerHTML={{__html: post && post.content}}>
      </div>

      <CommentSection postId={post?._id}  />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className=' flex flex-wrap  gap-4  mt-5  justify-center'>
        {
          recentPosts && 
            recentPosts.map((post,index) => {
              return <PostCard key={index} post={post}/>
            })
        }
        </div>
      </div>
    </main>
  )
}

export default PostPage