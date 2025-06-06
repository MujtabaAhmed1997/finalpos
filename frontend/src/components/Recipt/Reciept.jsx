import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GenericReceipt = ({ orderType }) => {
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id: OrderID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Fetching order and order details for ID:", OrderID);
    fetchOrder(OrderID);
    fetchOrderDetails(OrderID);
  }, [OrderID]);

  const fetchOrder = async (id) => {
    try {
      //console.log(`Fetching ${orderType} order with ID:`, id);
      const res = await axios.get(
        `http://localhost:3001/api/${orderType}-orders/${id}`
      );
      setData(res.data);
      // console.log("Order data fetched:", res.data);
    } catch (err) {
      console.error(`Error fetching ${orderType} order:`, err);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      //console.log(`Fetching ${orderType} order details for order ID:`, id);
      const res = await axios.get(
        `http://localhost:3001/api/${orderType}ordersdetails/${orderType}Order/${id}/details`
      );
      setDetail(res.data);
      console.log("Order details fetched:", res.data);
    } catch (err) {
      console.error(`Error fetching ${orderType} order details:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNavigate = () => {
    if (orderType === "sales") {
      navigate(`/salesorder/show`);
    } else {
      navigate("/purchaseorder");
    }
  };

  const textStyle = {
    textAlign: "center",
    verticalAlign: "middle",
    color: "black",
  };
  const headerStyle = {
    textAlign: "center",
    verticalAlign: "middle",
    fontWeight: "bold",
    color: "black",
  };
  const rightAlignTextStyle = {
    textAlign: "right",
    verticalAlign: "middle",
    color: "black",
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !detail) {
    console.log("Data or detail not available yet.");
    return <div>No data available</div>;
  }

  // console.log("Rendering receipt with data:", data);
  console.log("Rendering receipt with details:", detail);

  // return (
  //   <div
  //     className="d-flex  justify-content-center align-items-center flex-column"
  //     style={{ height: "100vh" }}
  //   >
  //     <div
  //       className="container"
  //       style={{
  //         backgroundColor: "white",
  //         padding: "20px",
  //         borderRadius: "8px",
  //         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  //       }}
  //     >
  //       <div className="row mb-3">
  //         <div className="col-4" style={textStyle}>
  //           {new Date(data.OrderDate).toLocaleDateString()}
  //         </div>
  //         <div className="col-4" style={textStyle}>
  //           {data.Supplier?.SupplierName ||
  //             data.Customer?.CustomerName ||
  //             "Unknown"}
  //         </div>
  //         <div className="col-4" style={textStyle}>
  //           {new Date().toLocaleTimeString()}
  //         </div>
  //       </div>
  //       <div className="row">
  //         <div className="col-12">
  //           <table className="table table-bordered">
  //             <thead>
  //               <tr>
  //                 <th style={headerStyle}>Product</th>
  //                 <th style={headerStyle}>Variation</th>
  //                 <th style={headerStyle}>Quantity</th>
  //                 <th style={headerStyle}>Unit Price</th>
  //                 {orderType === "sales" && (
  //                   <>
  //                     <th style={headerStyle}>Loose Quantity</th>
  //                     <th style={headerStyle}>Discount</th>
  //                   </>
  //                 )}
  //                 <th style={headerStyle}>Total</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {detail.OrderDetails && detail.OrderDetails.length > 0 ? (
  //                 detail.OrderDetails.map((item, index) => (
  //                   <tr key={index}>
  //                     <td style={textStyle}>{item.Product.ProductName}</td>
  //                     <td style={textStyle}>{item.ProductVariation.Size}</td>
  //                     <td style={textStyle}>{item.Quantity}</td>
  //                     <td style={textStyle}>{item.UnitPrice}</td>
  //                     {orderType === "sales" && (
  //                       <>
  //                         <td style={textStyle}>{item.LooseQuantity}</td>
  //                         <td style={textStyle}>{item.Discount}</td>
  //                       </>
  //                     )}
  //                     <td style={textStyle}>{item.total}</td>
  //                   </tr>
  //                 ))
  //               ) : (
  //                 <tr>
  //                   <td
  //                     colSpan={orderType === "sales" ? "7" : "5"}
  //                     style={textStyle}
  //                   >
  //                     No items available
  //                   </td>
  //                 </tr>
  //               )}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //       <div className="row mt-3">
  //         <div className="col-12 d-flex justify-content-end">
  //           <table className="table table-bordered" style={{ width: "auto" }}>
  //             <tbody>
  //               <tr>
  //                 <th style={headerStyle}>Total Amount</th>
  //                 <td style={rightAlignTextStyle}>{data.TotalAmount}</td>
  //               </tr>
  //               <tr>
  //                 <th style={headerStyle}>Amount Paid</th>
  //                 <td style={rightAlignTextStyle}>{data.AmountPaid}</td>
  //               </tr>
  //               <tr>
  //                 <th style={headerStyle}>Remaining Amount</th>
  //                 <td style={rightAlignTextStyle}>{data.RemainingAmount}</td>
  //               </tr>
  //               <tr>
  //                 <th style={headerStyle}>Payment Status</th>
  //                 <td style={rightAlignTextStyle}>{data.PaymentStatus}</td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //       <div className="row mt-3">
  //         <div className="col-12 d-flex justify-content-end">
  //           <button className="btn btn-primary me-2" onClick={handlePrint}>
  //             Print
  //           </button>
  //           <button className="btn btn-secondary" onClick={handleNavigate}>
  //             Back to Order
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column p-3">
  //   <div className="container bg-white p-4 rounded shadow-sm flex-column gap-3  overflow-x-auto">
  //     <div className="row mb-3 text-center">
  //       <div className="col-12 col-md-4 mb-2" style={textStyle}>
  //         {new Date(data.OrderDate).toLocaleDateString()}
  //       </div>
  //       <div className="col-12 col-md-4 mb-2" style={textStyle}>
  //         {data.Supplier?.SupplierName ||
  //           data.Customer?.CustomerName ||
  //           "Unknown"}
  //       </div>
  //       <div className="col-12 col-md-4" style={textStyle}>
  //         {new Date().toLocaleTimeString()}
  //       </div>
  //     </div>

  //     <div className="row mb-3">
  //       <div className="col-12">
  //         <div className="table-responsive">
  //           <table className="table table-bordered table-sm text-nowrap">
  //             <thead className="table-light">
  //               <tr>
  //                 <th style={headerStyle}>Product</th>
  //                 <th style={headerStyle}>Variation</th>
  //                 <th style={headerStyle}>Quantity</th>
  //                 <th style={headerStyle}>Unit Price</th>
  //                 {orderType === "sales" && (
  //                   <>
  //                     <th style={headerStyle}>Loose Quantity</th>
  //                     <th style={headerStyle}>Discount</th>
  //                   </>
  //                 )}
  //                 <th style={headerStyle}>Total</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {detail.OrderDetails?.length > 0 ? (
  //                 detail.OrderDetails.map((item, index) => (
  //                   <tr key={index}>
  //                     <td style={textStyle}>{item.Product?.ProductName}</td>
  //                     <td style={textStyle}>
  //                       {item.ProductVariation?.Size || "-"}
  //                     </td>
  //                     <td style={textStyle}>{item.Quantity}</td>
  //                     <td style={textStyle}>{item.UnitPrice}</td>
  //                     {orderType === "sales" && (
  //                       <>
  //                         <td style={textStyle}>{item.LooseQuantity}</td>
  //                         <td style={textStyle}>{item.Discount}</td>
  //                       </>
  //                     )}
  //                     <td style={textStyle}>{item.total}</td>
  //                   </tr>
  //                 ))
  //               ) : (
  //                 <tr>
  //                   <td
  //                     colSpan={orderType === "sales" ? 7 : 5}
  //                     style={textStyle}
  //                     className="text-center"
  //                   >
  //                     No items available
  //                   </td>
  //                 </tr>
  //               )}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="row mb-3">
  //       <div className="col-12 d-flex justify-content-md-end justify-content-center">
  //         <div className="table-responsive">
  //           <table className="table table-bordered w-auto">
  //             <tbody>
  //               <tr>
  //                 <th style={headerStyle}>Total Amount</th>
  //                 <td style={rightAlignTextStyle}>{data.TotalAmount}</td>
  //               </tr>
  //               <tr>
  //                 <th style={headerStyle}>Amount Paid</th>
  //                 <td style={rightAlignTextStyle}>{data.AmountPaid}</td>
  //               </tr>
  //               <tr>
  //                 <th style={headerStyle}>Remaining Amount</th>
  //                 <td style={rightAlignTextStyle}>{data.RemainingAmount}</td>
  //               </tr>
  //               <tr>
  //                 <th style={headerStyle}>Payment Status</th>
  //                 <td style={rightAlignTextStyle}>{data.PaymentStatus}</td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="row">
  //       <div className="col-12 d-flex justify-content-md-end justify-content-center flex-wrap gap-2">
  //         <button className="btn btn-primary" onClick={handlePrint}>
  //           Print
  //         </button>
  //         <button className="btn btn-secondary" onClick={handleNavigate}>
  //           Back to Order
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // </div>

  return (
    <div className="m-3">
      <div
        style={{
          maxWidth: "1200px",
          marginInline: "auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          minHeight: "100dvh",
        }}
      >
        <div className="mb-3 text-center d-flex gap-4 justify-content-center">
          <div className="" style={textStyle}>
            {new Date(data.OrderDate).toLocaleDateString()}
          </div>
          <div className="" style={textStyle}>
            {data.Supplier?.SupplierName ||
              data.Customer?.CustomerName ||
              "Unknown"}
          </div>
          <div className="" style={textStyle}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-bordered table-sm text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th style={headerStyle}>Product</th>
                    <th style={headerStyle}>Variation</th>
                    <th style={headerStyle}>Quantity</th>
                    <th style={headerStyle}>Unit Price</th>
                    {orderType === "sales" && (
                      <>
                        <th style={headerStyle}>Loose Quantity</th>
                        <th style={headerStyle}>Discount</th>
                      </>
                    )}
                    <th style={headerStyle}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.OrderDetails?.length > 0 ? (
                    detail.OrderDetails.map((item, index) => (
                      <tr key={index}>
                        <td style={textStyle}>{item.Product?.ProductName}</td>
                        <td style={textStyle}>
                          {item.ProductVariation?.Size || "-"}
                        </td>
                        <td style={textStyle}>{item.Quantity}</td>
                        <td style={textStyle}>{item.UnitPrice}</td>
                        {orderType === "sales" && (
                          <>
                            <td style={textStyle}>{item.LooseQuantity}</td>
                            <td style={textStyle}>{item.Discount}</td>
                          </>
                        )}
                        <td style={textStyle}>{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={orderType === "sales" ? 7 : 5}
                        style={textStyle}
                        className="text-center"
                      >
                        No items available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="table-responsive w-100">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row" style={{ width: "50%" }}>
                  Total Amount
                </th>
                <td style={{ width: "50%" }}>{data.TotalAmount}</td>
              </tr>
              <tr>
                <th scope="row" style={{ width: "50%" }}>
                  Amount Paid
                </th>
                <td style={{ width: "50%" }}>{data.AmountPaid}</td>
              </tr>
              <tr>
                <th scope="row" style={{ width: "50%" }}>
                  Remaining Amount
                </th>
                <td style={{ width: "50%" }}>{data.RemainingAmount}</td>
              </tr>
              <tr>
                <th scope="row" style={{ width: "50%" }}>
                  Payment Status
                </th>
                <td style={{ width: "50%" }}>{data.PaymentStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="">
          <div className=" d-flex justify-content-md-end justify-content-center flex-wrap gap-2">
            <button className="btn btn-primary" onClick={handlePrint}>
              Print
            </button>
            <button className="btn btn-secondary" onClick={handleNavigate}>
              Back to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericReceipt;
