import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import c from "./Profile.module.scss";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      alert("You need to be logged in to view your profile.");
      return;
    }

    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const userRes = await axios.get(
          "https://server-production-45af.up.railway.app/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userRes.data);

        // Fetch user orders
        const ordersRes = await axios.get(
          "https://server-production-45af.up.railway.app/api/order/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(ordersRes.data);

        // Fetch user preferences
        const preferencesRes = await axios.get(
          "https://server-production-45af.up.railway.app/api/preferences",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPreferences(preferencesRes.data);
      } catch (err) {
        console.error(
          "Error fetching profile data:",
          err.response ? err.response.data : err.message
        );
        setError(err.response?.data?.message || "Failed to load profile data.");

        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/auth");
        } else if (
          err.response &&
          err.response.status === 404 &&
          err.response.data.message === "User preferences not found"
        ) {
          setPreferences(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className={c.profilePage}>
        <div className={c.loaderOverlay}>
          <div className={c.loader}></div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className={c.profilePage}>
        <p className={c.errorMessage}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={c.profilePage}>
        <p className={c.noUserMessage}>
          User data not available. Please log in.
        </p>
      </div>
    );
  }

  return (
    <div className={c.profilePage}>
      <div className={c.profileContainer}>
        <h2 className={c.profileTitle}>Your Profile</h2>
        <div className={c.userInfo}>
          <p>
            <strong>Username:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
        </div>
        {/* User Preferences Section */}
        <h3 className={c.preferencesTitle}>Your Fragrance Preferences</h3>
        {preferences ? (
          <div className={c.preferencesInfo}>
            <p>
              <strong>Preferred Gender:</strong>{" "}
              {preferences.preferredGender.charAt(0).toUpperCase() +
                preferences.preferredGender.slice(1).toLowerCase()}
            </p>
            <p>
              <strong>Favorite Seasons:</strong>{" "}
              {preferences.favoriteSeasons
                .map(
                  (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
                )
                .join(", ")}
            </p>
            <p>
              <strong>Preferred Occasions:</strong>{" "}
              {preferences.preferredOccasions
                .map(
                  (o) => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase()
                )
                .join(", ")}
            </p>
            <p>
              <strong>Intensity Preference:</strong>{" "}
              {preferences.intensityPreference.charAt(0).toUpperCase() +
                preferences.intensityPreference.slice(1).toLowerCase()}
            </p>
            <p>
              <strong>Fragrance Families:</strong>{" "}
              {preferences.fragranceFamilies
                .map(
                  (f) => f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()
                )
                .join(", ")}
            </p>
          </div>
        ) : (
          <div className={c.noPreferences}>
            <p>You haven't set your fragrance preferences yet.</p>
            <button
              className={c.setPreferencesButton}
              onClick={() => navigate("/quiz")}
            >
              Set Your Preferences
            </button>
          </div>
        )}
        ---
        <h3 className={c.ordersTitle}>Your Orders</h3>
        {orders.length === 0 ? (
          <p className={c.noOrders}>You haven't placed any orders yet.</p>
        ) : (
          <div className={c.ordersGrid}>
            {orders.map((order) => (
              <div key={order.id} className={c.orderCard}>
                <div className={c.orderHeader}>
                  <h4>Order #{order.id}</h4>
                  <span className={c.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={c.perfumeDetails}>
                  <img
                    src={
                      order.perfume.image ||
                      "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={order.perfume.name}
                    className={c.perfumeImage}
                  />
                  <div className={c.perfumeInfo}>
                    <p className={c.perfumeName}>{order.perfume.name}</p>
                    <p className={c.perfumeBrand}>{order.perfume.brand}</p>
                    <p className={c.perfumePrice}>
                      Price: ${order.perfume.price}
                    </p>
                    <p className={c.orderQuantity}>
                      Quantity: {order.quantity}
                    </p>
                  </div>
                </div>
                {order.orderMessage && (
                  <p className={c.orderMessage}>
                    <strong>Message:</strong> {order.orderMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
