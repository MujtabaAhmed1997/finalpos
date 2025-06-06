import React, { useState } from 'react';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsChevronDown, BsChevronUp
} from 'react-icons/bs';
import '../Sidebar/sidebar.css';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [inventoryDropdown, setInventoryDropdown] = useState(false);

  const toggleInventoryDropdown = () => {
    setInventoryDropdown(!inventoryDropdown);
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> SHOP
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <a href="/Homepage">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/users">
            <BsPeopleFill className='icon' /> Roles
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/products">
            <BsFillArchiveFill className='icon' /> Products
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/categories">
            <BsFillGrid3X3GapFill className='icon' /> Categories
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/customers">
            <BsPeopleFill className='icon' /> Customers
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/salesorder/show">
            <BsPeopleFill className='icon' /> Create Bill
          </a>
        </li>
        <li className='sidebar-list-item'>
          <div onClick={toggleInventoryDropdown} className='sidebar-list-item-dropdown'>
            <BsListCheck className='icon' /> Stocks
            {inventoryDropdown ? <BsChevronUp className='icon' /> : <BsChevronDown className='icon' />}
          </div>
          {inventoryDropdown && (
            <ul className='sidebar-dropdown-list'>
              <li className='sidebar-dropdown-item'>
                <a href="/stocks">Stock Details</a>
              </li>
              <li className='sidebar-dropdown-item'>
                <a href="/purchaseorder">Add Stock</a>
              </li>
              <li className='sidebar-dropdown-item'>
                <a href="/inventory/reports">Stock Reports</a>
              </li>
            </ul>
          )}
        </li>
        <li className='sidebar-list-item'>
          <a href="/suppliers">
            <BsPeopleFill className='icon' /> Suppliers
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/report">
            <BsMenuButtonWideFill className='icon' /> Reports
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="">
            <BsFillGearFill className='icon' /> Setting
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
