import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsInstagram,BsFacebook,BsTwitterX, BsGithub, BsDribbble } from 'react-icons/bs'

const FooterC = () => {
  return (
    <Footer container className='border border-t-4 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className=" grid w-full justify-between  sm:flex md:grid-cols-1">
          <div className="mt-5">
          <Link to={'/'} className='self-center whitespace-nowrap  text-lg sm:text-xl
                font-semibold dark:text-white'>
             <span className='px-2 py-1 bg-gradient-to-r from-blue-500
              via-blue-300 to-blue-100 rounded-lg text-black '>K6n's</span>Blog
          </Link>
          </div>
          <div className="grid grid-cols-2  gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <Footer.Title title='About' />
            <Footer.LinkGroup col>
              <Footer.Link href='/'>
                Footballer
              </Footer.Link>
              <Footer.Link href='/'>
                Cricketer
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title='Follow Us' />
            <Footer.LinkGroup col>
              <Footer.Link href='/'>
                Github
              </Footer.Link>
              <Footer.Link href='/'>
                Leetcode
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title='Legal' />
            <Footer.LinkGroup col>
              <Footer.Link href='#'>
                Privacy Policy
              </Footer.Link>
              <Footer.Link href=''>
                Terms &amp; Conditions
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          </div>
        </div>

        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href='#' by="K6n's Blog" year={new Date().getFullYear()} /> 
       
        <div className='flex gap-4 sm:mt-0 mt-4 sm:justify-center'>
          <Footer.Icon href='#' icon={BsInstagram} />
          <Footer.Icon href='#' icon={BsFacebook} />
          <Footer.Icon href='#' icon={BsTwitterX} />
          <Footer.Icon href='#' icon={BsGithub} />
          <Footer.Icon href='#' icon={BsDribbble} />

        </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterC