
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./cart-context";
import { useTitle } from "./TitleContext";


interface MenuItem {
  id: string,
  title: string;
  current: boolean
};

export function ListProduct() {

  const formatPrice = (price: number): string => {
    // Kiểm tra giá trị đầu vào
    if (isNaN(price)) {
      throw new Error("Giá trị không hợp lệ");
    }

    // Định dạng giá sử dụng Intl.NumberFormat
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0, // Không có phần thập phân
    });

    // Loại bỏ ký hiệu "₫" mặc định
    return formatter.format(price).replace('₫', 'VND').trim();
  };
  const { title} = useTitle();
  const [selectedTitle, setSelectedTitle] = useState<string>("ALL");
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  // Fetch dữ liệu khi component được mount
  useEffect(() => {
    // Fetch dữ liệu sản phẩm
    axios
      .get("http://localhost:5000/api/admin/product/get")
      .then((response) => setProducts(response.data))
      .catch((err) => console.error("Error fetching products:", err));
  
    // Fetch dữ liệu danh mục
    axios
      .get("http://localhost:5000/api/admin/category/get")
      .then((response) => {
        setCategories(response.data);
  
        // Tạo menu từ danh mục
        const initialMenu: MenuItem[] = [
          {
            id: "1",
            title: "ALL",
            current: title=="ALL",
          },
          ...response.data.map((category: any) => ({
            id: category.id,
            image: category.image,
            title: category.categoryName,
            current: category.categoryName==title,
          })),
        ];
        setMenu(initialMenu);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [title]);
  
  useEffect(() => {
    // Cập nhật selectedTitle dựa trên giá trị của title
    if (!title) {
      setSelectedTitle("ALL");
    } else {
      setSelectedTitle(title);
      setMenu((prevMenu) =>
        prevMenu.map((item) => ({
          ...item,
          current: item.title === title,
        }))
      );
    }
  }, [title]); // Thêm title vào danh sách phụ thuộc
  
  // Hàm xử lý sự kiện khi chọn danh mục
  const handleClick = (title: string) => {
    setSelectedTitle(title); // Cập nhật danh mục được chọn
    // Cập nhật trạng thái menu
    setMenu((prevMenu) =>
      (prevMenu || []).map((item) => ({
        ...item,
        current: item.title === title, // Đặt `current: true` nếu title trùng với title được chọn, ngược lại là false
      }))
    );
  };

  // Lọc sản phẩm dựa trên danh mục được chọn
  const filteredProducts =
    selectedTitle === "ALL"
      ? products // Hiển thị toàn bộ sản phẩm nếu "ALL" được chọn
      : products.filter(
        (product: any) => product.category.categoryName === selectedTitle
      );

  function handleAddToCart(item: any): void {
    const cartItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1, // Mặc định thêm 1 sản phẩm
      image: item.image,
    };
    addToCart(cartItem);
  }

  function showTilte() {
    console.log(title);
  }

  return (
    <>
      <div className="m-0 flex justify-center flex-row gap-2 md:gap-6 lg:gap-24 items-center w-full p-10 lg:px-auto border-b-2 border-black">
        {menu.map((item: any) => (
          <Button
            key={item.id}
            className={`md:h-20 md:w-20 lg:h-32 lg:w-32  h-14 w-14 flex flex-col p-5 gap-0 ${item.current ? "bg-orange-700" : "bg-orange-400 hover:bg-orange-700"
              }`}
            value={item.title}
            onClick={() => handleClick(item.title)}
          >
            {item.title !== "ALL" && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full md:w-[80%] md:h-[80%] object-fill"
              />
            )}
            <p className="md:text-xl font-bold text-xs">{item.title}</p>
          </Button>
        ))}
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl sm:py-6 lg:max-w-7xl ">
          <div className="my-6 mx-3 grid grid-cols-2 gap-x-2 gap-y-4 md:gap-y-6 md:grid-cols-3 lg:grid-cols-5 md:gap-x-6 lg:gap-x-8 justify-items-center" >
            {filteredProducts.map((item: any) => (
              <div
                key={item.id}
                className=" w-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 flex flex-col p-5 items-center"
              >
                <img
                  className="rounded-t-lg items-center w-auto h-auto"
                  src={item.image}
                  alt=""
                />
                <div className="px-5">
                  <p className="text-center mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {item.category.categoryName}
                  </p>
                  <p className="mb-1 text-lg font-normal text-black dark:text-gray-400 text-center">
                    {item.title}
                  </p>
                  <p className="mb-3 text-lg font-normal text-yellow-400 dark:text-gray-400 text-center">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex gap-2 md:gap-5">
                  <Button
                    onClick={() => handleAddToCart(item)} // Thêm sản phẩm vào giỏ
                    className=" bg-red-600 pl-4  hover:bg-orange-400 gap-0"
                  >
                    <p className="text-xl font-bold">Add to Cart</p>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}



