import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import c from "../Shop/Shop.module.scss";
import { Link, useNavigate } from "react-router-dom";

const ForYouPage = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPerfumes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("pageSize", pageSize);

      params.append("limit", 100);

      const queryString = params.toString();
      const url = `https://server-production-45af.up.railway.app/api/parfume/for-you/recommendations${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.hasCompletedQuiz === false) {
        setHasCompletedQuiz(false);
        setPerfumes([]);
        setTotalPages(1); // Reset total pages
        setCurrentPage(1); // Reset current page
      } else {
        setHasCompletedQuiz(true);
        setPerfumes(res.data.perfumes);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching personalized perfumes:", error);
      if (error.response && error.response.status === 401) {
        alert("Please log in to view personalized recommendations.");
        navigate("/login");
      }
      setPerfumes([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate, currentPage, pageSize]);

  useEffect(() => {
    if (token) {
      fetchPerfumes();
    } else {
      setIsLoading(false);
      alert("Please log in to view personalized recommendations.");
      navigate("/login");
    }
  }, [token, navigate, fetchPerfumes]);

  const handleOrderClick = (id) => {
    if (!token) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }
    setSelectedPerfumeId(id);
    setQuantity("");
    setOrderMessage("");
    setOrderError("");
    setShowModal(true);
  };

  const handleSubmitOrder = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      setOrderError("Quantity must be at least 1.");
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

  const handleQuizRedirect = () => {
    navigate("/quiz");
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

      {!hasCompletedQuiz ? (
        <div className={c.quizPrompt}>
          <p className={c.noResults}>
            Complete your preference quiz to get personalized recommendations.
          </p>
          <button className={c.quizButton} onClick={handleQuizRedirect}>
            Complete the Quiz
          </button>
        </div>
      ) : perfumes.length > 0 ? (
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
        !isLoading &&
        hasCompletedQuiz && (
          <p className={c.noResults}>
            No perfumes found matching your personalized recommendations.
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

export default ForYouPage;
