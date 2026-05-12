import React from 'react'
import { useState } from 'react';
import SalesOrdershow from '../../components/Sales/Salesordershow';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Sales.css';

function Sales() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='sales-container'>
        <SalesOrdershow />
      </div>
    </div>
  );
}

export default Sales