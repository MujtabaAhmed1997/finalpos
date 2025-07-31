import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import './Productcomp.css'; // Import the CSS file for this component

function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      const fetchedProducts = response.data;

      // Shuffle the icons array
      const availableIcons = shuffleIcons();

      // Map each product with an icon
      const productsWithIcons = fetchedProducts.map((product, index) => ({
        ...product,
        icon: availableIcons[index % availableIcons.length] // Assign icons in a loop
      }));

      setProducts(productsWithIcons);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to shuffle icons array
  const shuffleIcons = () => {
    const icons = [
      <BsFillArchiveFill className='card_icon' />,
      <BsFillGrid3X3GapFill className='card_icon' />,
      <BsPeopleFill className='card_icon' />,
      <BsFillBellFill className='card_icon' />
    ];

    // Shuffle icons array
    for (let i = icons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [icons[i], icons[j]] = [icons[j], icons[i]];
    }

    return icons;
  };

  // Function to handle delete product
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${productId}`);
        fetchProducts(); // Refresh products after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  // Function to handle update product (example, you can implement a modal or form for update)
  const handleUpdateProduct = async (productId) => {
    navigate(`/products/update/${productId}`);
  };

  // Function to handle view product variations
  const handleViewProduct = async (productId) => {
    navigate(`/variations/${productId}`);
  };

  // Function to handle add product (example, you can implement a modal or form for add)
  const handleAddProduct = async () => {
    navigate('/products/add');
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>PRODUCTS</h3>
      </div>

      <div className='main-cards'>
        {products.map((product) => (
          <div className='card' key={product.ProductID}>
            <div className='card-inner'>
              <h3>{product.Unit}</h3>
              {product.icon}
            </div>
            <h1>{product.ProductName}</h1>
            <div className='card-buttons'>
              <button className='view-button' onClick={() => handleViewProduct(product.ProductID)}>View</button>
              <button className='delete-button' onClick={() => handleDeleteProduct(product.ProductID)}>Delete</button>
              <button className='update-button' onClick={() => handleUpdateProduct(product.ProductID)}>Update</button>
            </div>
          </div>
        ))}
      </div>

      <div className='add-product-button'>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </main>
  );
}

export default Product;
