import React, { useEffect, useRef } from "react";
import c from "./MainPage.module.scss";
import valuesImage from "../../assets/valuesImage.jpg";
import BestSeller from "../../components/BestSeller/BestSeller";
import offSale from "../../assets/50ofSale.jpg";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const valuesRef = useRef(null);
  const saleRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(c.fadeInUp);
        }
      });
    }, observerOptions);

    if (valuesRef.current) observer.observe(valuesRef.current);
    if (saleRef.current) observer.observe(saleRef.current);

    return () => observer.disconnect();
  }, []);

  const handleShopClick = () => {
    navigate("/shop");
  };

  const handleSaleClick = () => {
    navigate("/shop");
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className={c.banner_container}>
        <div className={c.banner}>
          <div className={c.banner_content}>
            <div className={c.textes}>
              <h1>Elevate Your Spirit with Victory Scented Fragrances!</h1>
              <p>
                Discover our exclusive collection of premium perfumes that
                capture the essence of triumph and elegance. Shop now and
                embrace the sweet smell of victory with Belle Aura.
              </p>
            </div>
            <button
              onClick={handleShopClick}
              aria-label="Shop now for perfumes"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Space Image */}
      <div
        className={c.space_image}
        role="img"
        aria-label="Belle Aura fragrance collection"
      ></div>

      {/* Values Section */}
      <div className={c.values} ref={valuesRef}>
        <img
          src={valuesImage}
          alt="Belle Aura values - Quality, elegance, and craftsmanship in every bottle"
          loading="lazy"
        />
        <h3>Our Values</h3>
      </div>

      {/* Best Seller Component */}
      <BestSeller />

      {/* Sale Section */}
      <div className={c.sale} ref={saleRef}>
        <div className={c.sale_content}>
          <div className={c.textes}>
            <h1>Perfume Year-End Sale! Up to 50% OFF</h1>
            <p>
              Discover an exquisite collection of premium perfumes at
              unbelievable prices during our exclusive Perfume Sale! Don't miss
              this opportunity to own luxury fragrances at incredible discounts.
            </p>
          </div>
          <button
            onClick={handleSaleClick}
            aria-label="Learn more about our sale"
          >
            Explore Sale
          </button>
        </div>
        <img
          src={offSale}
          alt="50% off sale on premium perfumes"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MainPage;
