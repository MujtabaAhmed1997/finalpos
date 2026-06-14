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

  const closeMobileSidebar = () => {
    if (openSidebarToggle) OpenSidebar();
  };

  return (
    <>
      {openSidebarToggle && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={OpenSidebar}
          aria-label="Close menu"
        />
      )}
      <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> SHOP POS
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/Homepage" onClick={closeMobileSidebar}>
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
                <Link to="/salesorder/add" onClick={closeMobileSidebar}>New Sale</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/salesorder/show" onClick={closeMobileSidebar}>Sales History</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/returnshow" onClick={closeMobileSidebar}>Returns</Link>
              </li>
            </ul>
          )}
        </li>

        <li className='sidebar-list-item'>
          <Link to="/products" onClick={closeMobileSidebar}>
            <BsFillArchiveFill className='icon' /> Products
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/categories" onClick={closeMobileSidebar}>
            <BsFillGrid3X3GapFill className='icon' /> Categories
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/customers" onClick={closeMobileSidebar}>
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
                <Link to="/stocks" onClick={closeMobileSidebar}>Stock Details</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/purchaseorder" onClick={closeMobileSidebar}>Add Stock</Link>
              </li>
              <li className='sidebar-dropdown-item'>
                <Link to="/report" onClick={closeMobileSidebar}>Stock Reports</Link>
              </li>
            </ul>
          )}
        </li>
        <li className='sidebar-list-item'>
          <Link to="/suppliers" onClick={closeMobileSidebar}>
            <BsPeopleFill className='icon' /> Suppliers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/users" onClick={closeMobileSidebar}>
            <BsPeopleFill className='icon' /> Users
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/report" onClick={closeMobileSidebar}>
            <BsMenuButtonWideFill className='icon' /> Reports
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/customerpayment/overdue" onClick={closeMobileSidebar}>
            <BsFillGearFill className='icon' /> Overdue Payments
          </Link>
        </li>
      </ul>
    </aside>
    </>
  );
}

export default Sidebar;
