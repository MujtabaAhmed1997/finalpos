import React, { useState, useEffect } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./variation.css";

function Variations() {
  const { id } = useParams();
  const [variations, setVariations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pageSize = 10;

  useEffect(() => {
    fetchVariations();
  }, [id, searchTerm, currentPage]);

  const fetchVariations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/productVariations/all`,
        {
          params: {
            search: searchTerm,
            page: currentPage,
            limit: pageSize,
          },
        }
      );

      const fetched = response.data.variations || [];

      const icons = shuffleIcons();
      const withIcons = fetched.map((v, i) => ({
        ...v,
        icon: icons[i % icons.length],
      }));

      setVariations(withIcons);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching variations:", error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleIcons = () => {
    const icons = [
      <BsFillArchiveFill className="card_icon" />,
      <BsFillGrid3X3GapFill className="card_icon" />,
      <BsPeopleFill className="card_icon" />,
      <BsFillBellFill className="card_icon" />,
    ];
    for (let i = icons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [icons[i], icons[j]] = [icons[j], icons[i]];
    }
    return icons;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteVariation = async (variationId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/productVariations/${variationId}`
      );
      fetchVariations();
    } catch (error) {
      console.error("Error deleting variation:", error);
    }
  };

  const handleUpdateVariation = (variationId) => {
    navigate(`/variations/update/${variationId}`);
  };

  const handleAddVariation = () => {
    navigate("/variations/add");
  };

  const handleViewPriceHistory = (variationId) => {
    navigate(`/priceHistory/${variationId}`);
  };

  const handlePageChange = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="main-container">
      <div className="main-title d-flex justify-content-between align-items-center flex-wrap">
        <h3>VARIATIONS</h3>
        <input
          type="text"
          placeholder="Search SKU or Size..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="main-cards">
            {variations.map((variation, index) => (
              <div className={`card card-${index}`} key={variation.VariationID}>
                <div className="card-inner">
                  <h3>{variation.SKU}</h3>
                  <span>{variation.UnitsPerPackage}</span>
                </div>
                <h1>{variation.Size}</h1>
                <div className="card-buttons">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteVariation(variation.VariationID)}
                  >
                    Delete
                  </button>
                  <button
                    className="update-button"
                    onClick={() => handleUpdateVariation(variation.VariationID)}
                  >
                    Update
                  </button>
                  <button
                    className="price-history-button"
                    onClick={() =>
                      handleViewPriceHistory(variation.VariationID)
                    }
                  >
                    Price History
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-buttons d-flex justify-content-between mt-3 flex-wrap gap-2">
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(-1)}
            >
              Previous
            </button>
            <span className="fw-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      <div className="add-variation-button mt-4 text-center">
        <button className="btn btn-success" onClick={handleAddVariation}>
          Add Variation
        </button>
      </div>
    </main>
  );
}

export default Variations;
