// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ReportComponent = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [reportData, setReportData] = useState([]);
//   const [dailyPayments, setDailyPayments] = useState([]);

//   const fetchReportData = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/report', { params: { startDate, endDate } });
//       setReportData(response.data.reportData);
//       setDailyPayments(response.data.dailyPayments);
//       console.log(response.data);

//     } catch (error) {
//       console.error('Failed to fetch report data', error);
//     }
//   };

//   useEffect(() => {
//     if (startDate && endDate) {
//       fetchReportData();
//     }
//   }, [startDate, endDate]);

//   return (
//     <div
//     className='d-flex vh-100 '
//     style={{ backgroundColor: '#1d2634' }}
//   >
//     <div className="container mt-5  " >
//       <h1 className="text-center mb-4">Sales Report</h1>
//       <div className="row mb-4">
//         <div className="col-md-6">
//           <label>
//             Start Date:
//             <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//           </label>
//         </div>
//         <div className="col-md-6">
//           <label>
//             End Date:
//             <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//           </label>
//         </div>
//       </div>
//       <div>
//         <h2 className="mb-3">Sales Data</h2>
//         <table className="table table-striped">
//           <thead className="thead-dark bg-white">
//             <tr>
//               <th>Product Name</th>
//               <th>Variation</th>
//               <th>Total Quantity</th>
//               <th>Loose quantity</th>
//               <th>Total Amount</th>
//               <th>Average Selling Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reportData.map((item) => (
//               <tr key={`${item.VariationID}`}>
//                 <td>{item.Product.ProductName}</td>
//                 <td>{item.ProductVariation.SKU}</td>
//                 <td>{item.totalQuantity}</td>
//                 <td>{item.totalLooseQuantity}</td>
//                 <td>{item.totalAmount}</td>
//                 <td>{item.averageSellingPrice}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div>
//         <h2 className="mb-3">Daily Payments</h2>
//         <table className="table table-striped">
//           <thead className="thead-dark">
//             <tr>
//               <th>Date</th>
//               <th>Total Payments</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dailyPayments.map((payment, index) => (
//               <tr key={index}>
//                 <td>{payment.date}</td>
//                 <td>{payment.totalPayments}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default ReportComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Updated to useNavigate

const ReportComponent = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const formattedDate = previousDate.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [reportData, setReportData] = useState([]);
  const [dailyPayments, setDailyPayments] = useState([]);
  const navigate = useNavigate(); // Updated to use useNavigate

  const fetchReportData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/report", {
        params: { startDate, endDate },
      });
      setReportData(response.data.reportData);
      setDailyPayments(response.data.dailyPayments);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch report data", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate]);

  const goBack = () => {
    navigate("/homepage"); // Updated to use navigate
  };

  return (
    <div className=" vh-100" style={{ backgroundColor: "#1d2634" }}>
      <div
        className=" flex-column mt-5"
        style={{
          minHeight: "100vh",
          justifyContent: "center",
          maxWidth: "1200px",
          marginInline: "auto",
        }}
      >
        <h1 className="text-center mb-4">Sales Report</h1>
        <div className="row mb-4">
          <div className="col-md-6">
            <label>
              Start Date:
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
          </div>
          <div className="col-md-6">
            <label>
              End Date:
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div>
          <h2 className="mb-3">Sales Data</h2>
          <table className="table table-striped">
            <thead className="thead-dark bg-white">
              <tr>
                <th>Product Name</th>
                <th>Variation</th>
                <th>Total Quantity</th>
                <th>Loose Quantity</th>
                <th>Total Amount</th>
                <th>Average Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={`${item.VariationID}`}>
                  <td>{item.Product.ProductName}</td>
                  <td>{item.ProductVariation.SKU}</td>
                  <td>{item.totalQuantity}</td>
                  <td>{item.totalLooseQuantity}</td>
                  <td>{item.totalAmount}</td>
                  <td>{item.averageSellingPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="mb-3">Daily Payments</h2>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Date</th>
                <th>Total Payments</th>
              </tr>
            </thead>
            <tbody>
              {dailyPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.date}</td>
                  <td>{payment.totalPayments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={goBack} className="btn btn-primary mt-4">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ReportComponent;
