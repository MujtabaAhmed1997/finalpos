// models/index.js
const Reminder = require('./remindermodel')
const sequelize = require('../db/sequelize');
const Product = require('./product');
const ProductVariation = require('./productvariation');
const ProductCategory = require('./productcategory');
const PurchaseOrder = require('./purchaseorder');
const PurchaseOrderDetail = require('./purchaseorderdetails');
const StockTransaction = require('./stockstranscation');
const Supplier = require('./supplier');
const SupplierPayment = require('./supplierpaymentmodel');
const Customer = require('./customer');
const SalesOrder = require('./salesorder');
const PriceHistory = require('./pricehistorymodel');
const SalesOrderDetail = require("./salesorderdetail");
const CustomerPayment = require('./customerpayment');
const SupplierLeisure = require('./supplierleisure');
const CustomerLeisure = require('./customerleisure');
const ReturnOrder = require('./returnorder');
const ReturnOrderDetail = require('./retuenorderdetails');
const CustomerReturn = require('./customerreturn');
const SupplierReturn = require('./supplierreturn');
const PriceRule = require('./pricerules');
const Batch = require('./batchmodel')
const Expense = require('./expensesmodel')
// const ProductType = require('./ProductType'); // Uncomment if using
const SalesBatchAllocation = require('./salesbatchallocationmodel')
// Define associations
Product.belongsTo(ProductCategory, { foreignKey: 'CategoryID' });
Product.hasMany(ProductVariation, { foreignKey: 'ProductID' });
ProductVariation.belongsTo(Product, { foreignKey: 'ProductID' });

PurchaseOrder.belongsTo(Supplier, { foreignKey: 'SupplierID' }); // Assuming you have a Supplier model
PurchaseOrder.hasMany(PurchaseOrderDetail, { foreignKey: 'PurchaseOrderID' });
PurchaseOrderDetail.belongsTo(PurchaseOrder, { foreignKey: 'PurchaseOrderID' });
PurchaseOrderDetail.belongsTo(Product, { foreignKey: 'ProductID' });
PurchaseOrderDetail.belongsTo(ProductVariation, { foreignKey: 'VariationID' });

//sales
SalesOrder.belongsTo(Customer, { foreignKey: 'CustomerID' }); // Assuming you have a Supplier model
SalesOrder.hasMany(SalesOrderDetail, { foreignKey: 'SalesOrderID' });
SalesOrderDetail.belongsTo(SalesOrder, { foreignKey: 'SalesOrderID' });
SalesOrderDetail.belongsTo(Product, { foreignKey: 'ProductID' });
SalesOrderDetail.belongsTo(ProductVariation, { foreignKey: 'VariationID' });


ProductVariation.hasMany(StockTransaction, { foreignKey: 'VariationID' });
StockTransaction.belongsTo(ProductVariation, { foreignKey: 'VariationID' });

// Define associations for SupplierPayment
Supplier.hasMany(SupplierPayment, { foreignKey: 'SupplierID' });
// PurchaseOrder.hasMany(SupplierPayment, { foreignKey: 'PurchaseOrderID' });
SupplierPayment.belongsTo(Supplier, { foreignKey: 'SupplierID' });
// SupplierPayment.belongsTo(PurchaseOrder, { foreignKey: 'PurchaseOrderID' });


// Define associations for CustomerPayment
// Customer.hasMany(CustomerPayment, { foreignKey: 'CustomerID' });
// PurchaseOrder.hasMany(CustomerPayment, { foreignKey: 'SalesOrderID' });
// CustomerPayment.belongsTo(Customer, { foreignKey: 'CustomerID' });
// CustomerPayment.belongsTo(SalesOrder, { foreignKey: 'SalesOrderID' });
Customer.hasMany(CustomerPayment, { foreignKey: 'CustomerID' });
// SalesOrder.hasMany(CustomerPayment,{foreignKey:'SalesOrderID'})
CustomerPayment.belongsTo(Customer, { foreignKey: 'CustomerID' });
// CustomerPayment.belongsTo(SalesOrder,{foreignKey:"SalesOrderID"})

// Define associations for SupplierLeisure
Supplier.hasMany(SupplierLeisure, { foreignKey: 'SupplierID' });
SupplierLeisure.belongsTo(Supplier, { foreignKey: 'SupplierID' });
// PurchaseOrder.hasMany(SupplierLeisure, { foreignKey: 'PurchaseOrderID' });
// SupplierLeisure.belongsTo(PurchaseOrder, { foreignKey: 'PurchaseOrderID' });


// Define associations for CustomerLeisure
Customer.hasMany(CustomerLeisure, { foreignKey: 'CustomerID' });
CustomerLeisure.belongsTo(Customer, { foreignKey: 'CustomerID' });
// SalesOrder.hasMany(CustomerLeisure, { foreignKey: 'SaleOrderID' });
// CustomerLeisure.belongsTo(SalesOrder, { foreignKey: 'SaleOrderID' });

///
//Customer.hasMany(CustomerPayment, { foreignKey: 'CustomerId' });
// CustomerPayment.belongsTo(Customer, { foreignKey: 'CustomerId' });

PriceHistory.belongsTo(ProductVariation, { foreignKey: 'VariationID' });


// Return Order Associations
ReturnOrder.hasMany(ReturnOrderDetail, { foreignKey: 'ReturnOrderID' });
ReturnOrderDetail.belongsTo(ReturnOrder, { foreignKey: 'ReturnOrderID' });
ReturnOrderDetail.belongsTo(ProductVariation, { foreignKey: 'VariationID' });

CustomerReturn.belongsTo(ReturnOrder, { foreignKey: 'ReturnOrderID' });
CustomerReturn.belongsTo(Customer, { foreignKey: 'CustomerID' });

SupplierReturn.belongsTo(ReturnOrder, { foreignKey: 'ReturnOrderID' });
SupplierReturn.belongsTo(Supplier, { foreignKey: 'SupplierID' });

ReturnOrderDetail.belongsTo(Product, { foreignKey: 'ProductID' });
ReturnOrderDetail.belongsTo(ProductVariation, { foreignKey: 'VariationID' });

PriceRule.belongsTo(ProductVariation, { foreignKey: 'VariationID' });


//batch changes
Batch.hasMany(StockTransaction, { foreignKey: 'BatchID' });
// Remove foreign key constraint for SalesOrderDetail since BatchID is TEXT
// Batch.hasMany(SalesOrderDetail, { foreignKey: 'BatchID' });
Batch.hasMany(PurchaseOrderDetail, { foreignKey: 'BatchID' });

StockTransaction.belongsTo(Batch, { foreignKey: 'BatchID' });
// Remove foreign key constraint for SalesOrderDetail since BatchID is TEXT
// SalesOrderDetail.belongsTo(Batch, { foreignKey: 'BatchID' });
PurchaseOrderDetail.belongsTo(Batch, { foreignKey: 'BatchID' })


//stockbtalloction assi 
SalesBatchAllocation.belongsTo(SalesOrderDetail, { foreignKey: 'SalesOrderDetailID', onDelete: 'CASCADE' });
SalesBatchAllocation.belongsTo(Batch, { foreignKey: 'BatchID', onDelete: 'CASCADE' });
SalesBatchAllocation.belongsTo(Product, { foreignKey: 'ProductID', onDelete: 'CASCADE' });
SalesBatchAllocation.belongsTo(ProductVariation, { foreignKey: 'VariationID', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  Expense,
  Product,
  ProductVariation,
  ProductCategory,
  PurchaseOrder,
  PurchaseOrderDetail,
  StockTransaction,
  SupplierPayment,
  SalesOrder,
  SalesOrderDetail,
  PriceHistory,
  CustomerPayment,
  CustomerLeisure,
  SupplierLeisure,
  Customer,
  ReturnOrder,
  ReturnOrderDetail,
  Batch,
  SalesBatchAllocation,
  Reminder

  // ProductType, // Uncomment if using
};
