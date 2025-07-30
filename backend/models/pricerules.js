const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); 
    const PriceRule = sequelize.define('PriceRule', {
      VariationID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      min_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      max_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price_per_kg: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, );
//     PriceRule.associate = function(models) {
//       // Add associations here, if necessary
//       PriceRule.belongsTo(models.Variation, { foreignKey: 'variation_id' });
//     };
//     return PriceRule;
//   };
  module.exports = PriceRule;
