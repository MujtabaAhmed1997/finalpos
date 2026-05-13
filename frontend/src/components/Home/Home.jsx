import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
  BsFillCreditCardFill,
  BsFillExclamationTriangleFill,
  BsFillLayersFill,
  BsFillPieChartFill,
  BsReceipt,
  BsFillStarFill,
  BsFillTagFill,
  BsTruck,
  BsFillWalletFill,
  BsFillBoxFill,
  BsFillAlarmFill,
  BsFillGearFill,
  BsFillHouseFill,
  BsFillCartFill,
  BsFillFileTextFill,
  BsFillCalculatorFill
} from "react-icons/bs";
import DashboardCard from "./DashboardCard";
import ReminderWidget from "../Reminder/ReminderWidget";
import "./home.css";
import { get } from "../../service/apiClient";

function Home() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    variations: 0,
  });

  useEffect(() => {
    get("/stats")
      .then((res) => setStats(res.data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  // Dashboard cards configuration
  const dashboardCards = [
    {
      title: "Products",
      icon: BsFillArchiveFill,
      buttons: [
        { label: "Add", url: "/products/add" },
        { label: "View", url: "/products" }
      ]
    },
    {
      title: "Categories",
      icon: BsFillGrid3X3GapFill,
      buttons: [
        { label: "Add", url: "/categories/add" },
        { label: "View", url: "/categories" }
      ]
    },
    {
      title: "Customers",
      icon: BsPeopleFill,
      buttons: [
        { label: "Add", url: "/customers/add" },
        { label: "View", url: "/customers" }
      ]
    },
    {
      title: "Variations",
      icon: BsFillLayersFill,
      value: stats.variations,
      buttons: [
        { label: "Add", url: "/variations/add" },
        { label: "View", url: "/variations/all" }
      ]
    },
    {
      title: "Create Bill",
      icon: BsReceipt,
      buttons: [
        { label: "Order", url: "/salesorder/add" },
        { label: "View", url: "/salesorder/show" }
      ]
    },
    {
      title: "Late Customer Payments",
      icon: BsFillExclamationTriangleFill,
      buttons: [
        { label: "View", url: "/customerpayment/overdue" }
      ]
    },
    {
      title: "Payments",
      icon: BsFillCreditCardFill,
      buttons: [
        { label: "Supplier", url: "/supplierpayment/add" },
        { label: "Customer", url: "/customerpayment/add" }
      ]
    },
    {
      title: "Returns",
      icon: BsTruck,
      buttons: [
        { label: "Add", url: "/addreturn" },
        { label: "View", url: "/returnshow" }
      ]
    },
    {
      title: "Suppliers Leisure",
      icon: BsFillStarFill,
      buttons: [
        { label: "View", url: "/supplierleisure" }
      ]
    },
    {
      title: "Stock",
      icon: BsFillBoxFill,
      buttons: [
        { label: "Add", url: "/purchaseorder" },
        { label: "View", url: "/stocks" }
      ]
    },
    {
      title: "Customer Leisures",
      icon: BsPeopleFill,
      buttons: [
        { label: "View", url: "/customerleisure" }
      ]
    },
    {
      title: "Reports",
      icon: BsFillPieChartFill,
      buttons: [
        { label: "Sales", url: "/report" },
        { label: "Profit", url: "/profit-loss" },
        { label: "Stock", url: "/stocks" }
      ]
    },
    // {
    //   title: "Product Management",
    //   icon: BsFillArchiveFill,
    //   buttons: [
    //     { label: "Product List", url: "/products" },
    //     { label: "Add Product", url: "/products/add" }
    //   ]
    // },
    {
      title: "Pricing Rules",
      icon: BsFillTagFill,
      buttons: [
        { label: "View", url: "/pricerule/show" },
        { label: "Add", url: "/pricerule/add" }
      ]
    },
    {
      title: "Expenses",
      icon: BsFillWalletFill,
      buttons: [
        { label: "Add", url: "/expense/addExpense" },
        { label: "View", url: "/expense/read" }
      ]
    },
    {
      title: "Reminders",
      icon: BsFillAlarmFill,
      buttons: [
        { label: "Add", url: "/reminder/add" },
        { label: "View", url: "/reminder/view" }
      ]
    }
  ];

  const handleCardAction = (action) => {
    if (action.url) {
      window.location.href = action.url;
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="dashboard-layout">
        <div className="main-cards">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              icon={card.icon}
              value={card.value}
              buttons={card.buttons}
              cardIndex={index + 1}
              onClick={handleCardAction}
            />
          ))}
        </div>
        
        <div className="widgets-section">
          <ReminderWidget />
        </div>
      </div>
    </main>
  );
}

export default Home;
