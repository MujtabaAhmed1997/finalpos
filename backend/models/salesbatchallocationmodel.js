// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');

// const Salesbatchallocation = sequelize.define('Salesbatchallocation', {
//     SalesbatchallocationID: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     salesorderdetailID: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'SalesOrderDetail',
//             key: 'SalesOrderDetailID'
//         }
//     },
//     BatchID: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Batches',
//             key: 'BatchID'
//         }
//     },
//     ProductID: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Products',
//             key: 'ProductID'
//         }
//     },
//     VariationID: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'ProductVariations',
//             key: 'VariationID'
//         }
//     },
//     Quantity: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     looseQuantity: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     UnitPrice: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     }

// });

// module.exports = Salesbatchallocation;

const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Salesbatchallocation = sequelize.define('Salesbatchallocation', {
    SalesbatchallocationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SalesOrderDetailID: {  // Use camel case correctly
        type: DataTypes.INTEGER,
        references: {
            model: 'SalesOrderDetails',  // Ensure correct table name
            key: 'SalesOrderDetailID'
        }
    },
    BatchID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Batches',
            key: 'BatchID'
        }
    },
    ProductID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'ProductID'
        }
    },
    VariationID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ProductVariations',
            key: 'VariationID'
        }
    },
    Quantity: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    looseQuantity: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    UnitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = Salesbatchallocation;
