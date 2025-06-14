import React, { useEffect, useRef } from "react";
import styles from "./Footer.module.scss";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.footer_content}>
        <div className={styles.brand}>Belle Aura</div>
        <div className={styles.links}>
          <a
            href="https://instagram.com/belleaura"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Belle Aura on Instagram"
            title="Follow us on Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com/belleaura"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Belle Aura on Facebook"
            title="Follow us on Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com/belleaura"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Belle Aura on Twitter"
            title="Follow us on Twitter"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
      <div className={styles.copyright}>
        © {currentYear} Belle Aura. All rights reserved. | Crafted with passion
        for fragrance excellence.
      </div>
    </footer>
  );
};

export default Footer;
