// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const ProfitLossScreen = () => {
//   const [date, setDate] = useState("");
//   const [variation, setVariation] = useState("");
//   const [showReport, setShowReport] = useState(false);

//   // Dummy data for Latif Oil
//   const data = {
//     revenue: 150000,
//     cogs: 90000,
//     expenses: 20000,
//     details: [
//       { category: "Sales Revenue", amount: 150000 },
//       { category: "Cost of Goods Sold", amount: -90000 },
//       { category: "Rent", amount: -5000 },
//       { category: "Salaries", amount: -10000 },
//       { category: "Utilities", amount: -5000 },
//     ],
//   };

//   const grossProfit = data.revenue - data.cogs;
//   const netProfit = grossProfit - data.expenses;

//   const handleGenerateReport = () => {
//     if (date && variation) {
//       setShowReport(true);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">Profit & Loss Statement </h2>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Select Date:</label>
//           <input
//             type="date"
//             className="form-control"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>
//         <div className="col-md-4">
//           <label>Select Date:</label>
//           <input
//             type="date"
//             className="form-control"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>
//         <div className="col-md-4">
//           <label>Select Variation:</label>
//           <select
//             className="form-control"
//             value={variation}
//             onChange={(e) => setVariation(e.target.value)}
//           >
//             <option value="">Select Variation</option>
//             <option value="Type A">lateef oil</option>
//             <option value="Type B">lateef ghee </option>
//             <option value="Type C">Rice</option>
//           </select>
//         </div>
//         <div className="col-md-4 d-flex align-items-end">
//           <button className="btn btn-primary" onClick={handleGenerateReport}>
//             Generate Report
//           </button>
//         </div>
//       </div>

//       {showReport && (
//         <>
//           <div className="row">
//             <div className="col-md-4">
//               <div className="card text-white bg-success mb-3">
//                 <div className="card-header">Revenue</div>
//                 <div className="card-body">
//                   <h5 className="card-title">
//                     {data.revenue.toLocaleString()}
//                   </h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="card text-white bg-danger mb-3">
//                 <div className="card-header">COGS</div>
//                 <div className="card-body">
//                   <h5 className="card-title">{data.cogs.toLocaleString()}</h5>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="card text-white bg-primary mb-3">
//                 <div className="card-header">Net Profit</div>
//                 <div className="card-body">
//                   <h5 className="card-title">{netProfit.toLocaleString()}</h5>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <table className="table table-striped mt-3">
//             <thead>
//               <tr>
//                 <th>Category</th>
//                 <th>Amount </th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.details.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.category}</td>
//                   <td
//                     className={item.amount < 0 ? "text-danger" : "text-success"}
//                   >
//                     {item.amount.toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProfitLossScreen;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const ProfitLossScreen = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const formattedDate = previousDate.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [variationID, setVariationID] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate || !variationID) {
      alert("Please select start date, end date, and variation.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/profitloss/",

        {
          startDate,
          endDate,
          variationID,
        }
      );
      setReportData(response.data);
      setShowReport(true);
    } catch (err) {
      setError("Failed to fetch report. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container flex-column mt-4">
      <h2 className="text-center mb-4">Profit & Loss Statement</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>Select Variation:</label>
          <select
            className="form-control"
            value={variationID}
            onChange={(e) => setVariationID(e.target.value)}
          >
            <option value="">Select Variation</option>
            <option value="1">Latif Oil</option>
            <option value="2">Latif Ghee</option>
            <option value="15">Test</option>
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end mt-2">
          <button
            className="btn btn-primary"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showReport && reportData && (
        <>
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-4">
              <div className="card text-white bg-success mb-3">
                <div className="card-header" style={{ whiteSpace: "nowrap" }}>
                  Revenue
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {reportData.totalRevenue.toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-danger mb-3">
                <div className="card-header">COGS</div>
                <div className="card-body">
                  <h5 className="card-title">
                    {reportData.totalCOGS.toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Net Profit</div>
                <div className="card-body">
                  <h5 className="card-title">
                    {reportData.netProfit.toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sales Revenue</td>
                <td className="text-success">
                  {reportData.totalRevenue.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Cost of Goods Sold</td>
                <td className="text-danger">
                  -{reportData.totalCOGS.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Total Expenses</td>
                <td className="text-danger">
                  -{reportData.totalExpenses.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Gross Profit</td>
                <td className="text-success">
                  {reportData.grossProfit.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Net Profit</td>
                <td className="text-success">
                  {reportData.netProfit.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ProfitLossScreen;
