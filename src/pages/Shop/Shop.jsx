import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import c from "./Shop.module.scss";
import { Link } from "react-router-dom";

const Shop = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [genderFilter, setGenderFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const token = localStorage.getItem("token");

  const fetchPerfumes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (genderFilter) {
        params.append("gender", genderFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (minPriceFilter !== "") {
        params.append("minPrice", minPriceFilter);
      }
      if (maxPriceFilter !== "") {
        params.append("maxPrice", maxPriceFilter);
      }
      params.append("page", currentPage);
      params.append("pageSize", pageSize);

      const queryString = params.toString();
      const url = `https://server-production-45af.up.railway.app/api/parfume${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axios.get(url);
      setPerfumes(res.data.perfumes);
      setTotalItems(res.data.totalCount);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    genderFilter,
    searchQuery,
    minPriceFilter,
    maxPriceFilter,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    fetchPerfumes();
  }, [
    genderFilter,
    searchQuery,
    minPriceFilter,
    maxPriceFilter,
    currentPage,
    fetchPerfumes,
  ]);

  const handleOrderClick = (id) => {
    if (!token) {
      alert("Please log in to place an order.");
      return;
    }
    setSelectedPerfumeId(id);
    setQuantity("");
    setOrderMessage("");
    setOrderError("");
    setShowModal(true);
  };

  const handleSubmitOrder = async () => {
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
      setOrderError("Quantity must be a positive number.");
      return;
    }

    setIsLoading(true);
    setOrderError("");
    try {
      await axios.post(
        "https://server-production-45af.up.railway.app/api/order",
        {
          perfumeId: selectedPerfumeId,
          quantity: parseInt(quantity),
          orderMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order placed successfully! We will contact you soon.");
      setShowModal(false);
      fetchPerfumes();
    } catch (err) {
      console.error(
        "Error placing order:",
        err.response ? err.response.data : err.message
      );
      setOrderError(
        err.response
          ? err.response.data.message
          : "Error placing order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1) {
        if (startPage > 2) pages.unshift("...");
        pages.unshift(1);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={c.shopPage}>
      {isLoading && (
        <div className={c.loaderOverlay}>
          <div className={c.loader}></div>
        </div>
      )}

      <div className={c.filters}>
        <div className={c.filterGroup}>
          <button
            className={genderFilter === "" ? c.activeFilter : ""}
            onClick={() => setGenderFilter("")}
          >
            All
          </button>
          <button
            className={genderFilter === "MALE" ? c.activeFilter : ""}
            onClick={() => setGenderFilter("MALE")}
          >
            Male
          </button>
          <button
            className={genderFilter === "FEMALE" ? c.activeFilter : ""}
            onClick={() => setGenderFilter("FEMALE")}
          >
            Female
          </button>
          <button
            className={genderFilter === "UNISEX" ? c.activeFilter : ""}
            onClick={() => setGenderFilter("UNISEX")}
          >
            Unisex
          </button>
        </div>
        <div className={c.filterInputs}>
          <input
            type="text"
            placeholder="Search perfumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={c.searchInput}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPriceFilter}
            onChange={(e) => setMinPriceFilter(e.target.value)}
            className={c.priceInput}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
            className={c.priceInput}
          />
        </div>
      </div>

      {perfumes.length > 0 ? (
        <>
          <div className={c.grid}>
            {perfumes.map((perfume) => (
              <div key={perfume.id} className={c.card}>
                <Link to={`/perfume/${perfume.id}`} className={c.cardLink}>
                  <div className={c.cardImageContainer}>
                    <img
                      src={
                        perfume.image ||
                        "https://via.placeholder.com/200x200?text=No+Image"
                      }
                      alt={perfume.name}
                      className={c.cardImage}
                    />
                  </div>
                  <div className={c.cardContent}>
                    <h4 className={c.cardName}>{perfume.name}</h4>
                    <p className={c.cardBrand}>{perfume.brand}</p>
                    <div className={c.cardDetails}>
                      <p className={c.cardPrice}>${perfume.price}</p>
                      <p className={c.cardSize}>{perfume.size}ml</p>
                    </div>
                  </div>
                </Link>
                <button
                  className={c.orderBtn}
                  onClick={() => handleOrderClick(perfume.id)}
                >
                  Order Now
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={c.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={c.pageButton}
              >
                Previous
              </button>
              {getPaginationPages().map((page, index) =>
                page === "..." ? (
                  <span key={index} className={c.ellipsis}>
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`${c.pageButton} ${
                      currentPage === page ? c.activePage : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={c.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !isLoading && (
          <p className={c.noResults}>
            No perfumes found matching your criteria.
          </p>
        )
      )}

      {showModal && (
        <div className={c.modalOverlay}>
          <div className={c.modal}>
            <h3>Place Your Order</h3>
            {orderError && <p className={c.error}>{orderError}</p>}{" "}
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className={c.modalInput}
            />
            <textarea
              placeholder="Your message (optional)"
              value={orderMessage}
              onChange={(e) => setOrderMessage(e.target.value)}
              rows="4"
              className={c.modalTextarea}
            ></textarea>
            <div className={c.modalActions}>
              <button onClick={handleSubmitOrder} className={c.submitButton}>
                Submit Order
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={c.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
