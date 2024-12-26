"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

type ProductData = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [Products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    axios({
      url: "https://fakestoreapi.com/products",
      method: "GET",
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.in",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 95%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    productRefs.current.forEach((productRef) => {
      if (productRef) {
        gsap.fromTo(
          productRef,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: productRef,
              start: "top 90%",
              end: "bottom 30%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, [Products]);

  return (
    <div className="container mx-auto py-12 px-6 md:px-10 lg:px-12">
      <h1
        ref={titleRef}
        className="text-4xl md:text-5xl font-extrabold text-left text-white mb-8"
      >
        Product List
      </h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-3">
        {Products.map((product, index) => (
          <div
            key={product.id}
            ref={(el) => (productRefs.current[index] = el)}
            className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
          >
            <div
              className="w-full h-[600px] md:h-[500px] lg:h-96 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${product.image})` }}
            ></div>

            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white p-4 space-y-2">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-lg font-bold">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
