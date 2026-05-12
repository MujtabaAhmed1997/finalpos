import React from 'react'
import { useState } from 'react';
import SalesOrderForm from '../../components/Sales/Salesorder';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './SalesOrderFormPage.css';

function SalesOrderFormPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='sales-order-form-container'>
        <SalesOrderForm />
      </div>
    </div>
  );
}

export default SalesOrderFormPage