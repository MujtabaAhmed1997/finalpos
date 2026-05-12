import React from 'react'
import { useState } from 'react';
import UpdateSalesOrderForm from '../../components/Sales/Updatesaleorder';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './UpdateSalesOrderPage.css';

function UpdateSalesOrderPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='update-sales-order-container'>
        <UpdateSalesOrderForm />
      </div>
    </div>
  );
}

export default UpdateSalesOrderPage