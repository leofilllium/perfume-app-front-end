import React from "react";
import c from "./BestSeller.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import bestseller1 from "../../assets/bestsellers/bestseller1.webp";
import bestseller2 from "../../assets/bestsellers/bestseller8.jpg";
import bestseller3 from "../../assets/bestsellers/bestseller2.jpg";
import bestseller4 from "../../assets/bestsellers/bestseller3.webp";
import bestseller5 from "../../assets/bestsellers/bestseller4.webp";
import bestseller6 from "../../assets/bestsellers/bestseller5.jpg";
import bestseller7 from "../../assets/bestsellers/bestseller6.avif";
import bestseller8 from "../../assets/bestsellers/bestseller7.jpeg";

const businessData = [
  {
  "id": "1",
  "name": "Moschino funny",
  "size": "100ml",
  "price": 50,
  "image":bestseller1
},
{
  "id": "2",
  "name": "Kilian good girl gone bad",
  "size": "50ml",
  "price": 230,
  "image":bestseller2
},
{
  "id": "3",
  "name": "Dior sauvage",
  "size": "100ml",
  "price": 140,
  "image":bestseller3
},
{
  "id": "4",
  "name": "Chanel tendre",
  "size": "100ml",
  "price": 180,
  "image":bestseller4
},
{
  "id": "5",
  "name": "Baccarat rouge 540",
  "size": "50ml",
  "price": 235,
  "image":bestseller5
},{
  "id": "6",
  "name": "Bright crystal versace",
  "size": "100ml",
  "price": 80,
  "image":bestseller6
},{
  "id": "7",
  "name": "Bleu de chanel",
  "size": "100ml",
  "price": 180,
  "image":bestseller7
},{
  "id": "8",
  "name": "Giorgio armani",
  "size": "100ml",
  "price": 145,
  "image":bestseller8
}
]



const BestSeller = () => { 
  return (
    <div className={c.bestsellers}>
      <h2 className={c.title}>Best selling products</h2>
      <Swiper
        slidesPerView={4}
        spaceBetween={12}
        className={c.swiperMain}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          600: {
            slidesPerView: 3,
          },
          900: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        }}
      >
        {businessData.map((item) => (
          <SwiperSlide key={item.id}>
            <img
              src={item.image}
              alt="Card Background image"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }}
            />

            <h3
              style={{
                margin: 0,
                padding: 0,
                width: "100%",
                textAlign: "center",
              }}
            >
              {item.name}
            </h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ margin: 0 }}>$ {item.price}</p>
              <p style={{ margin: 0, marginLeft: 10 }}>{item.size}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestSeller;
