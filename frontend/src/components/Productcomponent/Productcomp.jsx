import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import './Productcomp.css'; // Import the CSS file for this component

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      
      if (response.data.success) {
        const fetchedProducts = response.data.products;

        // Shuffle the icons array
        const availableIcons = shuffleIcons();

        // Map each product with an icon
        const productsWithIcons = fetchedProducts.map((product, index) => ({
          ...product,
          icon: availableIcons[index % availableIcons.length] // Assign icons in a loop
        }));

        setProducts(productsWithIcons);
      } else {
        console.error('Failed to fetch products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/product-categories');
      
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data.success && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        console.error('Invalid response format from categories API');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.CategoryID === categoryId);
    return category ? category.CategoryName : 'Unknown Category';
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
    try {
      const response = await axios.delete(`http://localhost:3001/api/products/${productId}`);
      
      if (response.data.success) {
        // Remove the deleted product from state
        setProducts(prevProducts => prevProducts.filter(product => product.ProductID !== productId));
        alert('Product deleted successfully!');
      } else {
        alert(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Function to handle update product
  const handleUpdateProduct = (productId) => {
    navigate(`/products/update/${productId}`);
  };

  // Function to handle add product
  const handleAddProduct = () => {
    navigate('/products/add');
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>PRODUCTS</h3>
      </div>

      <div className='main-cards'>
        {products.map((product, index) => (
          <div className="card" key={product.ProductID}>
            <div className='card-inner'>
              <h3>{product.ProductName}</h3>
              {product.icon}
            </div>
            <h1>{product.Unit}</h1>
            <p className='product-description'>Category: {getCategoryName(product.CategoryID)}</p>
            <div className='card-buttons'>
              <button 
                className='delete-button' 
                onClick={() => handleDeleteProduct(product.ProductID)}
              >
                Delete
              </button>
              <button className='update-button' onClick={() => handleUpdateProduct(product.ProductID)}>
                Update
              </button>
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

