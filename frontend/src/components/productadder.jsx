import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [sku, setSku] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [quantityInStock, setQuantityInStock] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');

      const response = await axios.post('/api/add_product', {
        productName,
        description,
        categoryId: parseInt(categoryId),
        reorderLevel: parseInt(reorderLevel),
        sku,
        size,
        color,
        price: parseFloat(price),
        quantityInStock: parseInt(quantityInStock),
        transactionDate,
        quantity: parseInt(quantity)
      });

      setLoading(false);
      setSuccessMessage(response.data.message);
      clearForm();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data.message || err.message || 'Something went wrong');
    }
  };

  const clearForm = () => {
    setProductName('');
    setDescription('');
    setCategoryId('');
    setReorderLevel('');
    setSku('');
    setSize('');
    setColor('');
    setPrice('');
    setQuantityInStock('');
    setTransactionDate('');
    setQuantity('');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add New Product</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    name="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="categoryId" className="form-label">Category ID</label>
                  <input
                    type="number"
                    className="form-control"
                    id="categoryId"
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="reorderLevel" className="form-label">Reorder Level</label>
                  <input
                    type="number"
                    className="form-control"
                    id="reorderLevel"
                    name="reorderLevel"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="sku" className="form-label">SKU</label>
                  <input
                    type="text"
                    className="form-control"
                    id="sku"
                    name="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="size" className="form-label">Size</label>
                  <input
                    type="text"
                    className="form-control"
                    id="size"
                    name="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="color" className="form-label">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="price"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quantityInStock" className="form-label">Quantity in Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantityInStock"
                    name="quantityInStock"
                    value={quantityInStock}
                    onChange={(e) => setQuantityInStock(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="transactionDate" className="form-label">Transaction Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="transactionDate"
                    name="transactionDate"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Fresh Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success">
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
              {error && <p className="text-danger mt-2">{error}</p>}
              {successMessage && <p className="text-success mt-2">{successMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
