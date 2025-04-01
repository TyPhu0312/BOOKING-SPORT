import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
import { useCart } from "./cart-context";

export default function BestSeller() {

  const { addToCart } = useCart();
  function handleAddToCart(item: any): void {
    const cartItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1, 
      image: item.image,
    };
    addToCart(cartItem);
  }
  const formatPrice = (price: number): string => {
    if (isNaN(price)) {
      throw new Error("Giá trị không hợp lệ");
    }

    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0, 
    });

    return formatter.format(price).replace('₫', 'VND').trim();
  };
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/product/get")
      .then((products) => setProducts(products.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);
  return (
    <div className="w-full h-full pt-10 pb-10 px-10">
      <div className="m-0 flex items-start w-full p-auto lg:px-14">
        <p className="max-w-70xl pl-4 text-xl md:text-5xl font-bold text-red-700 dark:text-neutral-200 font-sans">
          BestSeller
        </p>
      </div>
      <div className="mx-auto p-0 md:p-5 gap-5 items-center p-auto w-auto">
        <Carousel>
          <CarouselContent className="md:p-11">
            {products.map((item) => (
              <CarouselItem key={item.id} className="sm:basis-full md:basis-1/2 lg:basis-1/3 flex justify-center">
                <div
                  className="w-80 h-auto bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 flex flex-col p-5 items-center"
                >
                  <img
                    className="rounded-t-lg items-center w-60 h-auto"
                    src={item.image}
                    alt=""
                  />
                  <div className="px-5 pt-5">
                    <p className="text-center mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.category.categoryName}
                    </p>
                    <p className="mb-1 text-2xl font-normal text-black dark:text-gray-400 text-center">
                      {item.title}
                    </p>
                    <p className="mb-3 text-2xl font-normal text-yellow-400 dark:text-gray-400 text-center">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex gap-10 pb-5">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className=" bg-red-600 pl-4  hover:bg-orange-400 gap-0"
                    >
                      <p className="text-xl font-bold">Add to Cart</p>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 container flex justify-center">
            <CarouselPrevious />
            <p>&ensp;</p>
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
