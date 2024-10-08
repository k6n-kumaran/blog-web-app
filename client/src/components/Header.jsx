import React from 'react'
import {Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react'
import { Link , useLocation, useNavigate} from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from '../app/slice/themeSlice'
import { signoutSuccess } from '../app/slice/userSlice'

const Header = () => {
    const navigate = useNavigate()
    const path = useLocation().pathname;
    const {currentUser} = useSelector((state) => state.user)
    const {theme} = useSelector((state) => state.theme)
    const dispatch = useDispatch();


    const handleSignOut = async() => {
        try {
          const res = await fetch(`/api/user/signout`, {
            method : "POST"
          })
          const data = await res.json();
          if(!res.ok) {
            console.log(data.message); 
          } else{
            dispatch(signoutSuccess())
            navigate('/signin')
          }
        } catch (error) {
          console.log(error.message);
          
        }
      }
  return (
    <Navbar className='border-b-2'>
    <Link to={'/'} className='self-center whitespace-nowrap  text-sm sm:text-xl
    font-semibold dark:text-white'>
       <span className='px-2 py-1 bg-gradient-to-r from-blue-500
        via-blue-300 to-blue-100 rounded-lg text-black '>K6n's</span>Blog
    </Link>
    <form >
        <TextInput 
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
    </form>
    <Button className='w-11 h-10  lg:hidden' pill color={"gray"}>
        <AiOutlineSearch />
    </Button>
    <div className='flex gap-2 md:order-2'>
        <Button pill className='w-12 h-10  hidden  sm:inline' color={"gray"} 
        onClick={() =>dispatch(toggleTheme())}>
            {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
            <Dropdown 
            arrowIcon={false} 
            inline 
            label={<Avatar  alt='user' img={currentUser.photo} 
            rounded />}
            >
            <Dropdown.Header>
                <span className='block text-sm'>{currentUser.username}</span>
                <span className='block text-md truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown> )
         :  (  
            <Link to={'/signin'}>
              <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
            </Link>
            )
        }
        
        <Navbar.Toggle />
    </div>
    <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={'div'}>
            <Link to={'/'}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={'div'}>
            <Link to={'/about'}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={'div'}>
            <Link to={'/projects'}>Projects</Link>
        </Navbar.Link>
    </Navbar.Collapse>
    </Navbar>
  )
}

export default Header