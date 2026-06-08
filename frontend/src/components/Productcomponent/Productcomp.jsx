import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import './Productcomp.css';
import { useConfirm } from "../../ui/confirm/ConfirmProvider";
import { useToast } from "../../ui/toast/ToastProvider";
import { get, delete_ } from "../../service/apiClient";
import { useInvalidate } from '../../context/DataRefreshContext';
import { useListRefresh } from '../../hooks/useListRefresh';

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const toast = useToast();
  const invalidate = useInvalidate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await get('/products');
      
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
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await get('/product-categories');
      
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
  }, []);

  useListRefresh('products', () => {
    fetchProducts();
    fetchCategories();
  });

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
      const response = await delete_(`/products/${productId}`);
      
      if (response.data.success) {
        // Remove the deleted product from state
        setProducts(prevProducts => prevProducts.filter(product => product.ProductID !== productId));
        invalidate(['products', 'variations']);
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

