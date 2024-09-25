import React, { useEffect, useState } from 'react'
import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
  const location = useLocation();
  const [tab,setTab] = useState('')


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if(tabFromURL) {
          setTab(tabFromURL)
    }    
  },[location.search])
  return (
    <Sidebar className='w-full md:w-56'>
       <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem active= {tab==="profile"} 
          href="/dashboard?tab=profile" icon={HiUser} label ="User" labelColor = "dark">
          Profile
          </SidebarItem>
        
          
          <Sidebar.Item  icon={HiArrowSmRight}  className=' cursor-pointer'>
          Sign Out
          </Sidebar.Item>
        </SidebarItemGroup>
       </SidebarItems>
    </Sidebar>
  )
}

export default DashboardSidebar