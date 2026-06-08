import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsChevronDown, BsChevronUp,
  BsReceipt
} from 'react-icons/bs';
import '../Sidebar/sidebar.css';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [inventoryDropdown, setInventoryDropdown] = useState(false);
  const [salesDropdown, setSalesDropdown] = useState(false);

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> SHOP POS
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/Homepage">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </Link>
        </li>

        <li className='sidebar-list-item'>
          <div onClick={() => setSalesDropdown(!salesDropdown)} className='sidebar-list-item-dropdown'>
            <BsReceipt className='icon' /> Sales / POS
            {salesDropdown ? <BsChevronUp className='icon' /> : <BsChevronDown className='icon' />}
          </div>
          {salesDropdown && (
            <ul className='sidebar-dropdown-list'>
              <li className='sidebar-dropdown-item'>
                <Link to="/salesorder/add">New Sale</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/salesorder/show">Sales History</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/returnshow">Returns</Link>
              </li>
            </ul>
          )}
        </li>

        <li className='sidebar-list-item'>
          <Link to="/products">
            <BsFillArchiveFill className='icon' /> Products
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/categories">
            <BsFillGrid3X3GapFill className='icon' /> Categories
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/customers">
            <BsPeopleFill className='icon' /> Customers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <div onClick={() => setInventoryDropdown(!inventoryDropdown)} className='sidebar-list-item-dropdown'>
            <BsListCheck className='icon' /> Stocks
            {inventoryDropdown ? <BsChevronUp className='icon' /> : <BsChevronDown className='icon' />}
          </div>
          {inventoryDropdown && (
            <ul className='sidebar-dropdown-list'>
              <li className='sidebar-dropdown-item'>
                <Link to="/stocks">Stock Details</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/purchaseorder">Add Stock</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/report">Stock Reports</Link>
              </li>
            </ul>
          )}
        </li>
        <li className='sidebar-list-item'>
          <Link to="/suppliers">
            <BsPeopleFill className='icon' /> Suppliers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/users">
            <BsPeopleFill className='icon' /> Users
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/report">
            <BsMenuButtonWideFill className='icon' /> Reports
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/customerpayment/overdue">
            <BsFillGearFill className='icon' /> Overdue Payments
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
