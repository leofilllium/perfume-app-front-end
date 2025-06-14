import React, { useEffect, useRef } from "react";
import c from "./About.module.scss";
import storyImage from "../../assets/spacer.jpg";

const About = () => {
  const storySectionRef = useRef(null);
  const uniquenessRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(c.animateOnScroll);
        }
      });
    }, observerOptions);

    if (storySectionRef.current) observer.observe(storySectionRef.current);
    if (uniquenessRef.current) observer.observe(uniquenessRef.current);

    itemsRef.current.forEach((item, index) => {
      if (item) {
        setTimeout(() => {
          if (item.getBoundingClientRect().top < window.innerHeight) {
            item.classList.add(c.animateStagger);
          }
        }, index * 100);
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addToItemsRef = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  return (
    <>
      {/* Banner Section */}
      <div className={c.banner}>
        <div className={c.banner_content}>
          <h3>About Us</h3>
          <p>
            At Belle Aura, we believe that perfumes are more than just scents;
            they are expressions of one's individuality and style. Our passion
            for exquisite fragrances led us to curate a collection that captures
            the essence of diverse personalities, bringing you an unparalleled
            olfactory experience that transcends the ordinary.
          </p>
        </div>
      </div>

      {/* <div className={c.story_section} ref={storySectionRef}>
        <h3>Our Story</h3>
      </div>

      <div
        className={c.story_image}
        role="img"
        aria-label="Belle Aura story - Journey of fragrance excellence"
      /> */}

      {/*  Uniqueness Section */}
      <div className={c.uniqueness} ref={uniquenessRef}>
        <h3>What Makes Us Unique</h3>
        <div className={c.uniqueness_content}>
          <div className={c.uniqueness_content_item} ref={addToItemsRef}>
            <b>Locally Inspired</b>
            <p>
              Our perfumes are meticulously crafted to reflect the cultural
              heritage, traditions, and landscapes of various regions. From the
              vibrant souks of Marrakech to the serene cherry blossom gardens of
              Kyoto, each fragrance tells a unique story that resonates with its
              origin, capturing the soul of places that inspire wanderlust and
              wonder.
            </p>
          </div>
          <div className={c.uniqueness_content_item} ref={addToItemsRef}>
            <b>High-Quality Ingredients</b>
            <p>
              We believe that the key to an extraordinary scent lies in the
              quality of ingredients. That's why we collaborate with expert
              perfumers who source the finest and ethically-sourced materials
              from around the world. We never compromise on the quality of our
              products, ensuring a long-lasting and luxurious experience that
              evolves beautifully on your skin.
            </p>
          </div>
          <div className={c.uniqueness_content_item} ref={addToItemsRef}>
            <b>Personalized Service</b>
            <p>
              We understand that choosing the perfect scent is a deeply personal
              experience. Our team of fragrance experts is always ready to
              assist you in finding a fragrance that complements your
              personality and style. Whether you're exploring new scents or
              seeking to rediscover an old favorite, we're here to guide you
              every step of the way on your olfactory journey.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
