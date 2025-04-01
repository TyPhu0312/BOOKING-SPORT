import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'


export default function ProductCard() {
  return (
    <div className="w-80 h-auto bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 flex flex-col p-5 items-center">
      <img
        className="rounded-t-lg items-center w-60 h-auto"
        src="/Burger.png"
        alt=""
      />
      <div className="p-5">
        <p className="text-center mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hamburger
        </p>
        <p className="mb-1 text-2xl font-normal text-black dark:text-gray-400 text-center">
          Fried Chicken Burger
        </p>
        <p className="mb-3 text-2xl font-normal text-yellow-400 dark:text-gray-400 text-center">
          100.000 VND
        </p>
        <div className="flex justify-between">
          <Button className=" bg-red-600 hover:bg-orange-400 rounded-full md:w-10 md:h-10 w-auto h-auto">
            <FontAwesomeIcon icon={faPlus}/>
          </Button>
          <Button className=" bg-red-600  hover:bg-orange-400 gap-0">
            <p className="text-xl font-bold">Buy Now</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
