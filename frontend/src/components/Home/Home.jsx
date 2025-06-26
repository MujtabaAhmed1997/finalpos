// import React from 'react';
// import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
//  import './home.css';

// function Home() {
//   const data = [
//     { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//     { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//     { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
//     { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
//     { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
//     { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
//     { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
//   ];

//   return (
//     <main className='main-container'>
//       <div className='main-title'>
//         <h3>DASHBOARD</h3>
//       </div>

//       <div className='main-cards'>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>PRODUCTS</h3>
//             <BsFillArchiveFill className='card_icon' />
//           </div>
//           <h1>300</h1>
//         </div>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>CATEGORIES</h3>
//             <BsFillGrid3X3GapFill className='card_icon' />
//           </div>
//           <h1>12</h1>
//         </div>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>CUSTOMERS</h3>
//             <BsPeopleFill className='card_icon' />
//           </div>
//           <h1>33</h1>
//         </div>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>ALERTS</h3>
//             <BsFillBellFill className='card_icon' />
//           </div>
//           <h1>42</h1>
//         </div>
//       </div>

//       <div className='charts'>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             width={500}
//             height={300}
//             data={data}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="pv" fill="#8884d8" />
//             <Bar dataKey="uv" fill="#82ca9d" />
//           </BarChart>
//         </ResponsiveContainer>

//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             width={500}
//             height={300}
//             data={data}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
//             <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </main>
//   );
// }

// export default Home;

// import React, { useEffect, useState } from 'react';
// import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
// import './home.css';

// function Home() {
//   const [stats, setStats] = useState({ products: 0, categories: 0, customers: 0 });

//   useEffect(() => {
//     fetch('http://localhost:3001/api/stats')
//       .then(response => response.json())
//       .then(data => setStats(data))
//       .catch(error => console.error('Error fetching stats:', error));
//   }, []);

//   return (
//     <main className='main-container'>
//       <div className='main-title'>
//         <h3>DASHBOARD</h3>
//       </div>

//       <div className='main-cards'>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>PRODUCTS</h3>
//             <BsFillArchiveFill className='card_icon' />
//           </div>
//           <h1>{stats.products}</h1>
//         </div>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>CATEGORIES</h3>
//             <BsFillGrid3X3GapFill className='card_icon' />
//           </div>
//           <h1>{stats.categories}</h1>
//         </div>
//         <div className='card'>
//           <div className='card-inner'>
//             <h3>CUSTOMERS</h3>
//             <BsPeopleFill className='card_icon' />
//           </div>
//           <h1>{stats.customers}</h1>
//         </div>
//         <div className='card'>
//            <div className='card-inner'>
//              <h3>Variations</h3>
//              <BsFillBellFill className='card_icon' />
//            </div>
//            <h1>{stats.Variation}</h1>
//          </div>

//      </div>
//       {/* Add your chart components here if needed */}
//     </main>
//   );
// }

// export default Home;

// Home.js
import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import "./home.css";

function Home() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    variations: 0,
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card card-1">
          <div className="card-inner">
            <h3>Product</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/products/add")}
            >
              Add
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/products")}
            >
              View
            </button>
          </div>
        </div>
        <div className="card card-2">
          <div className="card-inner">
            <h3>Categories</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/categories/add")}
            >
              Add
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/categories")}
            >
              View
            </button>
          </div>
        </div>
        <div className="card card-3">
          <div className="card-inner">
            <h3>Customer</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/customers/add")}
            >
              Add
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/customers")}
            >
              View
            </button>
          </div>
        </div>
        <div className="card card-4">
          <div className="card-inner">
            <h3>VARIATIONS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>{stats.variations}</h1>
        </div>
        {/* Add more cards here */}
        <div className="card card-5">
          <div className="card-inner">
            <h3>CREATE BILL</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/salesorder/add")}
            >
              CREATE ORDER
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/salesorder/show")}
            >
              SALESORDER LIST
            </button>
          </div>{" "}
        </div>
        <div className="card card-6">
          <div className="card-inner">
            <h3>LATE CUSTOMER PAYMENTS</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() =>
                (window.location.href = "/customerpayment/overdue")
              }
            >
              SHOW
            </button>
          </div>{" "}
        </div>
        <div className="card card-7">
          <div className="card-inner">
            <h3>PAYMENTS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/supplierpayment/add")}
            >
              SUPPLIER
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/customerpayment/add")}
            >
              CUSTOMER
            </button>
          </div>{" "}
        </div>
        <div className="card card-8">
          <div className="card-inner">
            <h3>RETURNS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/addreturn")}
            >
              Add
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/returnshow")}
            >
              Return Order
            </button>
          </div>
        </div>
        <div className="card card-9">
          <div className="card-inner">
            <h3>SUPPLIERS LEISURE</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/supplierleisure")}
            >
              Details
            </button>
          </div>
        </div>
        <div className="card card-10">
          <div className="card-inner">
            <h3>STOCK</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/purchaseorder")}
            >
              Add Stock
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/stocks")}
            >
              Stock Details
            </button>
          </div>
        </div>
        <div className="card card-11">
          <div className="card-inner">
            <h3>CUSTOMER LEISURES</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/customerleisure")}
            >
              Details
            </button>
          </div>
        </div>
        <div className="card card-12">
          <div className="card-inner">
            <h3>Reports</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/report")}
            >
              Sales Report
            </button>
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/profit-loss")}
            >
              Profit Loss Report
            </button>
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/stocks")}
            >
              Stock Report
            </button>
          </div>
        </div>
        <div className="card card-7">
          <div className="card-inner">
            <h3>Products</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/products")}
            >
              Product List
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/products/add")}
            >
              Add Product
            </button>
          </div>{" "}
        </div>
        <div className="card card-3">
          <div className="card-inner">
            <h3>Pricing Rules</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/pricerule/show")}
            >
              Pricing List
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/pricerule/add")}
            >
              Add Price
            </button>
          </div>{" "}
        </div>
        <div className="card card-2">
          <div className="card-inner">
            <h3>Expenses</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/expense/addExpense")}
            >
              Add
            </button>
            <button
              className="card-button"
              onClick={() => (window.location.href = "/expense/read")}
            >
              View
            </button>
          </div>
        </div>

        <div className="card card-2">
          <div className="card-inner">
            <h3>Reminder</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/reminder/add")}
            >
              Add
            </button>
          </div>
          <div className="button-container">
            <button
              className="card-button"
              onClick={() => (window.location.href = "/reminder/add")}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
