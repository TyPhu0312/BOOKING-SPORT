import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function CartButton() {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <FontAwesomeIcon icon={faCartShopping} className="h-5 w-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white shadow-lg rounded-md p-4">
          <h3 className="text-lg font-medium">Giỏ hàng của bạn</h3>
          <ul>
            {/* Danh sách sản phẩm */}
            <li>Sản phẩm 1</li>
            <li>Sản phẩm 2</li>
            <li>Sản phẩm 3</li>
          </ul>
          <Link href="/cart">
            <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md">Đi đến giỏ hàng</button>
          </Link>
        </PopoverContent>
      </Popover>
    </div>
  );
}
