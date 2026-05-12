import React from 'react'
import { useState } from 'react';
import SaleOrderDetailList from '../../components/Sales/Sorderdeaillist';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './SaleOrderDetailListPage.css';

function SaleOrderDetailListPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='sale-order-detail-list-container'>
        <SaleOrderDetailList />
      </div>
    </div>
  );
}

export default SaleOrderDetailListPage