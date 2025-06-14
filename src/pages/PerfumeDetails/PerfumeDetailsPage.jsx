import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import c from "./PerfumeDetailsPage.module.scss";

const PerfumeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [perfume, setPerfume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Review-related states
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [userReview, setUserReview] = useState({ rating: 0, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Order modal states
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPerfumeDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = `https://server-production-45af.up.railway.app/api/parfume/${id}`;
        const res = await axios.get(url);
        setPerfume(res.data);
      } catch (err) {
        console.error(
          "Error fetching perfume details:",
          err.response ? err.response.data : err.message
        );
        setError(
          err.response?.data?.message || "Failed to load perfume details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      setReviewLoading(true);
      setReviewError("");
      try {
        const res = await axios.get(
          `https://server-production-45af.up.railway.app/api/review/perfume/${id}`
        );
        setReviews(res.data.reviews);
      } catch (err) {
        console.error(
          "Error fetching reviews:",
          err.response ? err.response.data : err.message
        );
        setReviewError(
          err.response?.data?.message || "Failed to load reviews."
        );
      } finally {
        setReviewLoading(false);
      }
    };

    if (id) {
      fetchPerfumeDetails();
      fetchReviews();
    } else {
      setError("Perfume ID is missing.");
      setIsLoading(false);
    }
  }, [id]);

  const handleOrderClick = () => {
    if (!token) {
      alert("Please log in to place an order.");
      navigate("/auth");
      return;
    }
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

    setIsOrdering(true);
    setOrderError("");
    try {
      await axios.post(
        "https://server-production-45af.up.railway.app/api/order",
        {
          perfumeId: perfume.id,
          quantity: parseInt(quantity),
          orderMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order placed successfully! We will contact you soon.");
      setShowModal(false);
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
      setIsOrdering(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!token) {
      alert("Please log in to submit a review.");
      navigate("/auth");
      return;
    }

    if (userReview.rating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError("");
    try {
      const res = await axios.post(
        `https://server-production-45af.up.railway.app/api/review/perfume/${id}`,
        {
          rating: parseInt(userReview.rating),
          comment: userReview.comment.trim() || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews([res.data.review, ...reviews]);
      setUserReview({ rating: 0, comment: "" });
      setHoverRating(0);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(
        "Error submitting review:",
        err.response ? err.response.data : err.message
      );
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className={c.detailsPage}>
        <div className={c.loaderOverlay}>
          <div className={c.loader}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={c.detailsPage}>
        <p className={c.errorMessage}>{error}</p>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className={c.detailsPage}>
        <p className={c.noPerfumeMessage}>
          Perfume not found. It might have been removed or the ID is incorrect.
        </p>
      </div>
    );
  }

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return "N/A";
    return arr
      .map(
        (item) =>
          item.charAt(0).toUpperCase() +
          item.slice(1).toLowerCase().replace(/_/g, " ")
      )
      .join(", ");
  };

  const formatAttribute = (attr) => {
    if (!attr) return "N/A";
    return (
      attr.charAt(0).toUpperCase() +
      attr.slice(1).toLowerCase().replace(/_/g, " ")
    );
  };

  return (
    <div className={c.detailsPage}>
      <div className={c.perfumeContainer}>
        <div className={c.imageSection}>
          <img
            src={
              perfume.image ||
              "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={perfume.name}
            className={c.perfumeImage}
          />
        </div>
        <div className={c.infoSection}>
          <h1 className={c.perfumeName}>{perfume.name}</h1>
          <h2 className={c.perfumeBrand}>{perfume.brand}</h2>
          <p className={c.perfumePrice}>${perfume.price}</p>
          <p className={c.perfumeSize}>{perfume.size}ml</p>
          <p className={c.perfumeDescription}>
            {perfume.description || "No description available."}
          </p>

          <div className={c.detailsGrid}>
            <div className={c.detailItem}>
              <strong>Gender:</strong> {formatAttribute(perfume.gender)}
            </div>
            <div className={c.detailItem}>
              <strong>Season:</strong> {formatAttribute(perfume.season)}
            </div>
            <div className={c.detailItem}>
              <strong>Occasion:</strong> {formatAttribute(perfume.occasion)}
            </div>
            <div className={c.detailItem}>
              <strong>Intensity:</strong> {formatAttribute(perfume.intensity)}
            </div>
            <div className={c.detailItem}>
              <strong>Fragrance Family:</strong>{" "}
              {formatAttribute(perfume.fragranceFamily)}
            </div>
            <div className={c.detailItem}>
              <strong>Stock:</strong>{" "}
              {perfume.stock > 0
                ? `${perfume.stock} available`
                : "Out of Stock"}
            </div>
            <div className={c.detailItem}>
              <strong>Average Rating:</strong>{" "}
              {perfume.averageRating
                ? `${perfume.averageRating.toFixed(1)}/5`
                : "No reviews yet"}
            </div>
            <div className={c.detailItem}>
              <strong>Total Reviews:</strong> {perfume.totalReviews || 0}
            </div>
          </div>

          <div className={c.notesSection}>
            <p>
              <strong>Top Notes:</strong> {formatArray(perfume.topNotes)}
            </p>
            <p>
              <strong>Middle Notes:</strong> {formatArray(perfume.middleNotes)}
            </p>
            <p>
              <strong>Base Notes:</strong> {formatArray(perfume.baseNotes)}
            </p>
          </div>

          <div className={c.performanceSection}>
            <div className={c.performanceItem}>
              <strong>Longevity:</strong>{" "}
              {perfume.longevity ? `${perfume.longevity} hours` : "N/A"}
            </div>
            <div className={c.performanceItem}>
              <strong>Sillage:</strong>{" "}
              {perfume.sillage ? `${perfume.sillage}/10` : "N/A"}
            </div>
          </div>

          <button
            className={c.orderBtn}
            onClick={handleOrderClick}
            disabled={perfume.stock <= 0}
          >
            {perfume.stock > 0 ? "Order Now" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Review Form */}
      <div className={c.reviewFormSection}>
        <h3>Write a Review</h3>
        {reviewError && <p className={c.error}>{reviewError}</p>}
        <div className={c.ratingInput}>
          <label>Your Rating:</label>
          <div className={c.stars}>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={ratingValue}
                  className={`${c.star} ${
                    ratingValue <= (hoverRating || userReview.rating)
                      ? c.filled
                      : ""
                  }`}
                  onClick={() =>
                    !isSubmittingReview &&
                    setUserReview({ ...userReview, rating: ratingValue })
                  }
                  onMouseEnter={() =>
                    !isSubmittingReview && setHoverRating(ratingValue)
                  }
                  onMouseLeave={() => !isSubmittingReview && setHoverRating(0)}
                >
                  &#9733; {/* Unicode star character */}
                </span>
              );
            })}
          </div>
          <span className={c.currentRatingDisplay}>
            {userReview.rating > 0 ? `${userReview.rating}/5` : ""}
          </span>
        </div>
        <textarea
          placeholder="Your review (optional)"
          value={userReview.comment}
          onChange={(e) =>
            setUserReview({ ...userReview, comment: e.target.value })
          }
          rows="4"
          className={c.modalTextarea}
          disabled={isSubmittingReview}
        ></textarea>
        <button
          onClick={handleReviewSubmit}
          className={c.submitButton}
          disabled={isSubmittingReview}
        >
          {isSubmittingReview ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Review List */}
      <div className={c.reviewListSection}>
        <h3>Customer Reviews</h3>
        {reviewLoading && <div className={c.loader}></div>}
        {reviewError && <p className={c.errorMessage}>{reviewError}</p>}
        {!reviewLoading && reviews && reviews.length === 0 && (
          <p className={c.noReviewsMessage}>
            No reviews yet. Be the first to review!
          </p>
        )}
        {reviews &&
          reviews.map((review) => (
            <div key={review.id} className={c.reviewItem}>
              <div className={c.reviewHeader}>
                <span className={c.reviewUser}>{review.user.name}</span>
                <div className={c.reviewRatingStars}>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`${c.starDisplay} ${
                        index < review.rating ? c.filled : ""
                      }`}
                    >
                      &#9733;
                    </span>
                  ))}
                  <span className={c.reviewRatingText}>{review.rating}/5</span>{" "}
                </div>
              </div>
              <p className={c.reviewComment}>
                {review.comment || "No comment provided."}
              </p>
              <p className={c.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>

      {showModal && (
        <div className={c.modalOverlay}>
          <div className={c.modal}>
            <h3>Place Your Order</h3>
            {orderError && <p className={c.error}>{orderError}</p>}
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className={c.modalInput}
              disabled={isOrdering}
            />
            <textarea
              placeholder="Your message (optional)"
              value={orderMessage}
              onChange={(e) => setOrderMessage(e.target.value)}
              rows="4"
              className={c.modalTextarea}
              disabled={isOrdering}
            ></textarea>
            <div className={c.modalActions}>
              <button
                onClick={handleSubmitOrder}
                className={c.submitButton}
                disabled={isOrdering}
              >
                {isOrdering ? "Placing Order..." : "Submit Order"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={c.cancelButton}
                disabled={isOrdering}
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

export default PerfumeDetailsPage;
