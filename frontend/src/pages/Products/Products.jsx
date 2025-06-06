import React from 'react'
import { useState } from 'react';
import Productcomp from '../../components/Productcomponent/Productcomp';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Products.css';
import AddProduct from '../../components/Productcomponent/Addproduct';
function Products() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
   return(
  <div className='grid-container'>
  <Header OpenSidebar={OpenSidebar} />
  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
 <div className='product-container '>
 <Productcomp/>

 </div>
</div>)
}

export default Products
