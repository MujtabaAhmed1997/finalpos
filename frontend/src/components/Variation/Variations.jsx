import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './variation.css';

function Variations() {
  const { id } = useParams();
  const [variations, setVariations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVariations();
  }, []);

  const fetchVariations = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products/${id}/variations`);
      const fetchedVariations = response.data;

      if (!Array.isArray(fetchedVariations)) {
        throw new Error('Expected array, received non-array data');
      }

      const availableIcons = shuffleIcons();

      const variationsWithIcons = fetchedVariations.map((variation, index) => ({
        ...variation,
        icon: availableIcons[index % availableIcons.length]
      }));

      setVariations(variationsWithIcons);
    } catch (error) {
      console.error('Error fetching variations:', error);
    }
  };

  const shuffleIcons = () => {
    const icons = [
      <BsFillArchiveFill className='card_icon' />,
      <BsFillGrid3X3GapFill className='card_icon' />,
      <BsPeopleFill className='card_icon' />,
      <BsFillBellFill className='card_icon' />
    ];

    for (let i = icons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [icons[i], icons[j]] = [icons[j], icons[i]];
    }

    return icons;
  };

  const handleDeleteVariation = async (variationId) => {
    try {
      await axios.delete(`http://localhost:3001/api/productVariations/${variationId}`);
      fetchVariations();
    } catch (error) {
      console.error('Error deleting variation:', error);
    }
  };

  const handleUpdateVariation = (variationId) => {
    navigate(`/variations/update/${variationId}`);
  };

  const handleAddVariation = () => {
    navigate('/variations/add');
  };

  const handleViewPriceHistory = (variationId) => {
    navigate(`/priceHistory/${variationId}`);
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>VARIATIONS</h3>
      </div>

      <div className='main-cards'>
        {variations.map((variation, index) => (
          <div className={`card card-${index}`} key={variation.VariationID}>
            <div className='card-inner'>
              <h3>{variation.SKU}</h3>
              {variation.UnitsPerPackage}
            </div>
            <h1>{variation.Size}</h1>
            <div className='card-buttons'>
              <button className='delete-button' onClick={() => handleDeleteVariation(variation.VariationID)}>Delete</button>
              <button className='update-button' onClick={() => handleUpdateVariation(variation.VariationID)}>Update</button>
              <button className='price-history-button' onClick={() => handleViewPriceHistory(variation.VariationID)}>Price History</button>
            </div>
          </div>
        ))}
      </div>

      <div className='add-variation-button'>
        <button onClick={handleAddVariation}>Add Variation</button>
      </div>
    </main>
  );
}

export default Variations;
