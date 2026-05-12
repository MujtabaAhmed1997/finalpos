import React from 'react'
import { useState } from 'react';
import SalesOrderDetail from '../../components/Sales/Salesorderdetail';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './SalesOrderDetailPage.css';

function SalesOrderDetailPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='sales-order-detail-container'>
        <SalesOrderDetail />
      </div>
    </div>
  );
}

export default SalesOrderDetailPage