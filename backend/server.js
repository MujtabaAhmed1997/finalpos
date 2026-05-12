
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const sequelize = require('./db/sequelize');
const { requestLogger, globalErrorHandler } = require('./helpers/logger');

const productCategoryRoutes = require('./routes/categoryroute');
const userRoutes = require('./routes/userRoute'); // Ensure correct import
const usercurd = require('./routes/usercurd'); // Ensure correct import
const supplierRoutes = require('./routes/suppliersroute'); // Ensure correct import
const variationRoute = require('./routes/variationroute');
const ProductRoute = require('./routes/productroute');
const PurchaseOrderRoute = require('./routes/purchaseorderroute');
//const PurchaseOrderdetails=require('./routes/purchaseorddetailroute');
const PurchaseOrderdetails = require('./routes/purchaseorddetailroute'); // Correct import
const StockTransaction = require('./routes/stocktransactionroute');
const SupplierPayment = require('./routes/supplierpaymentroute');
const Customer = require('./routes/customerroute');
const SalesOrder = require('./routes/salesorderroute');
const SalesOrderdeatails = require('./routes/salesorderdetailroute');
const priceHistoryRoute = require('./routes/pricehistoryroute');
const customerPaymentRoutes = require('./routes/customepaymentroute');
const customerLeisureRoutes = require('./routes/Customerleisure');
const supplierLeisureRoutes = require('./routes/supplierleisureroute');
const conversionRoutes = require('./routes/conversion');
const Overdue = require('./routes/ovedueroute');
const ReportRoute = require('./routes/reportingroute');
const Stats = require("./routes/homepagestats");
const ReturnorderRoute = require('./routes/returorderroute');
const ReturnorderdetailsRoute = require('./routes/returnorderdetailroute');
const PriceRuleRoute = require('./routes/priceruleroute');
const Profitloss = require('./routes/profitloss.route')
const ExpenseRoute = require('./routes/expenseroute')
const ExpenseTypeRoute = require('./routes/expensetyperoute')
const BatchRoutes = require('./routes/batchroutes')
const sellnewlogic = require('./routes/saleslatestsinglelogicroute')
const ReminderRoutes = require('./routes/reminderroutes')
const NotificationRoutes = require('./routes/notificationroutes')

require('./cron');






const User = require('./models/usermodel'); // Import User model
const Supplier = require('./models/supplier'); // Import Supplier model
const productvariationmodel = require('./models/productvariation');
const productmodel = require('./models/product');


const app = express();
const port = process.env.Port || 3001;

app.use(express.json());
app.use(cors());

// Serve static files from frontend build (if they exist)
app.use(express.static('public'));

// Logging middleware (log all requests)
app.use(requestLogger);

// Simple root status page for backend health (fallback when no static file matches)
app.get(['/', '/status'], (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pak Brotherz Backend</title>
  <style>
    body { margin:0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: radial-gradient(circle at top, #1e3a8a, #0f172a 60%); color:#e2e8f0; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    .container { max-width: 520px; width: 100%; padding: 32px; background: rgba(15, 23, 42, 0.92); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 28px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.45); }
    h1 { margin: 0 0 12px; font-size: 2.2rem; color:#f8fafc; }
    p { margin: 0 0 16px; line-height:1.75; color:#cbd5e1; }
    .status { display:inline-flex; align-items:center; gap:10px; margin-bottom:18px; font-size:1rem; font-weight:600; }
    .dot { width:12px; height:12px; border-radius:9999px; background:#22c55e; box-shadow:0 0 12px rgba(34,197,94,.45); }
    .card { margin-top:18px; padding:18px; border-radius:18px; background: rgba(30, 41, 59, 0.8); border:1px solid rgba(148, 163, 184, 0.14); }
    a.button { display:inline-block; margin-top:18px; padding:12px 20px; border-radius:14px; background:linear-gradient(135deg,#3b82f6,#9333ea); color:#fff; text-decoration:none; transition: transform .2s ease, box-shadow .2s ease; }
    a.button:hover { transform: translateY(-2px); box-shadow: 0 18px 30px rgba(59,130,246,.25); }
    .small { font-size:.95rem; color:#94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="status"><span class="dot"></span>Backend is running</div>
    <h1>Pak Brotherz Backend</h1>
    <p>This server is live and responding. Use your frontend or API clients to connect to the available endpoints under <strong>/api</strong>.</p>
    <div class="card">
      <p><strong>Health check:</strong> GET <code>/</code> or <code>/status</code></p>
      <p class="small">If you want to log in, use the frontend or POST to <code>/api/users/login</code>.</p>
    </div>
    <a class="button" href="/api/users/login">Go to login API</a>
  </div>
</body>
</html>
  `);
});

// Use the routes
app.use('/api/users', userRoutes);

app.use('/api/suppliers', supplierRoutes);
app.use('/api/supplierpayment', SupplierPayment);

app.use('/api/customers', Customer);
app.use('/api/customerpayments', customerPaymentRoutes);
app.use('/api/overdue/', Overdue);
app.use('/api/usercurd', usercurd);

app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', ProductRoute);
app.use('/api/purchase-orders', PurchaseOrderRoute);
app.use('/api/purchaseordersdetails', PurchaseOrderdetails);
app.use('/api/stocktransaction', StockTransaction);


app.use('/api/sales-orders', SalesOrder);
app.use('/api/salesordersdetails', SalesOrderdeatails)
app.use('/api/conversion', conversionRoutes);



app.use('/api/customerleisure', customerLeisureRoutes);
app.use('/api/supplierleisure', supplierLeisureRoutes);


//app.use('/api/variation', variationRoute);
app.use('/api', variationRoute); // Ensure the base path is /api
app.use('/api/pricehistory', priceHistoryRoute);

//Reporting
app.use('/api/report', ReportRoute);
app.use('/api/stats', Stats);

//Return 
app.use('/api/return-orders', ReturnorderRoute);
app.use('/api/returnordersdetails', ReturnorderdetailsRoute);

//Price Rules
app.use('/api/pricerule', PriceRuleRoute);
app.use('/api/profitloss', Profitloss)

app.use("/api/expense", ExpenseRoute)

app.use("/api/batch", BatchRoutes)

app.use("/api/sellingnewlogic", sellnewlogic)

app.use("/api/reminder", ReminderRoutes)

app.use("/api/expensetype", ExpenseTypeRoute)

app.use('/api/reminders', ReminderRoutes);

app.use('/api/notifications', NotificationRoutes)

// Sync the models with the database
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize all defined models to the DB
    // await sequelize.sync({ alter: true }); // Use 'alter' to update the schema without dropping tables


    // sequelize.sync({ force: true }) 
    //not changign model
    await sequelize.sync(); // Avoids modifying schema and adding keys

    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

syncDatabase();

// Error handling middleware (must be at the end, after all routes)
app.use(globalErrorHandler);

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});