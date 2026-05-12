import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import './Productcomp.css'; // Import the CSS file for this component
import { useConfirm } from "../../ui/confirm/ConfirmProvider";
import { useToast } from "../../ui/toast/ToastProvider";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const toast = useToast();

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
    const ok = await confirm({
      title: "Delete product?",
      description: "This will permanently delete the product. If it has variations/orders, the server may reject the delete.",
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
    });
    if (!ok) return;

    try {
      const response = await axios.delete(`http://localhost:3001/api/products/${productId}`);
      
      if (response.data.success) {
        // Remove the deleted product from state
        setProducts(prevProducts => prevProducts.filter(product => product.ProductID !== productId));
        toast.success("Product deleted.");
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
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

