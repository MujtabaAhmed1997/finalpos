import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './category.css'; // Import the CSS file for this component

function Category() {
  const [categories, setCategories] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/product-categories');
      
      // Categories API returns data directly without success wrapper
      let fetchedCategories;
      if (Array.isArray(response.data)) {
        fetchedCategories = response.data;
      } else if (response.data.success && response.data.categories) {
        fetchedCategories = response.data.categories;
      } else {
        console.error('Invalid response format from categories API');
        return;
      }

      // Shuffle the icons array
      const availableIcons = shuffleIcons();

      // Map each category with an icon
      const categoriesWithIcons = fetchedCategories.map((category, index) => ({
        ...category,
        icon: availableIcons[index % availableIcons.length] // Assign icons in a loop
      }));

      setCategories(categoriesWithIcons);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  // Function to handle delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3001/api/product-categories/${categoryId}`);
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Function to show delete confirmation popup
  const showDeleteConfirmation = (categoryId, categoryName) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setShowDeletePopup(true);
  };

  // Function to confirm delete
  const confirmDelete = async () => {
    if (categoryToDelete) {
      await handleDeleteCategory(categoryToDelete.id);
      setShowDeletePopup(false);
      setCategoryToDelete(null);
    }
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setCategoryToDelete(null);
  };

  // Function to handle update category (example, you can implement a modal or form for update)
  const handleUpdateCategory = async (categoryId) => {
    // Example: Implement an update function
    navigate(`/categories/update/${categoryId}`);
    
    console.log(`Update category with ID: ${categoryId}`);
  };

  // Function to handle add category (example, you can implement a modal or form for add)
  const handleAddCategory = async () => {
    // Example: Navigate to the add category page
    navigate('/categories/add');
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>CATEGORIES</h3>
      </div>

      <div className='main-cards'>
        {categories.map((category, index) => (
          <div className="card" key={category.CategoryID}>
            <div className='card-inner'>
              <h3>{category.CategoryName}</h3>
              {category.icon}
            </div>
            {/* <h1>{category.Products.length}</h1> */}
            <h1>{category.CategoryID}</h1>
            <div className='card-buttons'>
              <button className='delete-button' onClick={() => showDeleteConfirmation(category.CategoryID, category.CategoryName)}>Delete</button>
              <button className='update-button' onClick={() => handleUpdateCategory(category.CategoryID)}>Update</button>
            </div>
          </div>
        ))}
      </div>

      <div className='add-category-button'>
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete category "{categoryToDelete?.name}"?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={confirmDelete}>Yes, Delete</button>
              <button className="cancel-button" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Category;
