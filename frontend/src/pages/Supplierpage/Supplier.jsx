import React from 'react'
import { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './supplier.css';
import SupplierComponent from '../../components/supplier/suppliercomponen/supplier';
function Supplier() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
   return(
  <div className='grid-container'>
  <Header OpenSidebar={OpenSidebar} />
  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
 <div className='product-container '>
  <SupplierComponent/>

 </div>
</div>)
}

export default Supplier
