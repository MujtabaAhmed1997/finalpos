
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

// Logging middleware (log all requests)
app.use(requestLogger);

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


app.listen(`${process.env.Port}`, () => {
  console.log(`Server is running on http://localhost:${process.env.Port}`);
});