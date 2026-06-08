import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowLeft, BsArrowRight, BsHouse } from 'react-icons/bs';
import './AppNavBar.css';

function AppNavBar() {
  const navigate = useNavigate();

  return (
    <nav className="app-nav-bar" aria-label="Page navigation">
      <div className="app-nav-bar__group">
        <button
          type="button"
          className="app-nav-bar__btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <BsArrowLeft /> <span className="app-nav-bar__label">Back</span>
        </button>
        <button
          type="button"
          className="app-nav-bar__btn"
          onClick={() => navigate(1)}
          aria-label="Go forward"
        >
          <span className="app-nav-bar__label">Forward</span> <BsArrowRight />
        </button>
      </div>
      <div className="app-nav-bar__group">
        <Link to="/salesorder/add" className="app-nav-bar__btn app-nav-bar__pos">
          + New Sale
        </Link>
        <Link to="/Homepage" className="app-nav-bar__btn app-nav-bar__home">
          <BsHouse /> <span className="app-nav-bar__label">Home</span>
        </Link>
      </div>
    </nav>
  );
}

export default AppNavBar;
