import React from 'react'
import { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Users from '../../components/usercurd/Users';
import './userspage.css'
function Userpage() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle);
    };
     return(
    <div className='grid-container'>
    <Header OpenSidebar={OpenSidebar} />
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
   <div className='product-container '>
   <Users />
  
   </div>
  </div>)
}

export default Userpage
