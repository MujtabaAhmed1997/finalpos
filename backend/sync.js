// // sync.js
// //const { sequelize, Product, ProductVariation, ProductCategory, PurchaseOrder, PurchaseOrderDetail, StockTransaction } = require('./models/index');

// (async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log('Database & tables created!');

//     // Sample data creation for demonstration
//     // const category = await ProductCategory.create({ CategoryName: 'Electronics', Description: 'Electronic Items' });
//     // const product = await Product.create({ ProductName: 'Laptop', Description: 'Gaming Laptop', Unit: 'pcs', ReorderLevel: 5, CategoryID: category.CategoryID });
//     // const variation = await ProductVariation.create({ ProductID: product.ProductID, Size: '15 inch', Color: 'Black', Price: 1500.00, QuantityInStock: 100 });

//     console.log('Sample data created!');
//   } catch (error) {
//     console.error('Error syncing database:', error);
//   }
// })();
