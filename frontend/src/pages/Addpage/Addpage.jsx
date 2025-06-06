import React from 'react'
import { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './addpage.css';
import Addcomponent from '../../components/Addcomponent/Addcomponent';
function Addpage() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
   return(
  <div className='grid-container'>
  <Header OpenSidebar={OpenSidebar} />
  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
 <div className='product-container '>
 <Addcomponent/>

 </div>
</div>)
}

export default Addpage
