import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function CartDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Giỏ hàng</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <h3 className="text-lg font-medium">Giỏ hàng của bạn</h3>
        <ul>
          {/* Danh sách sản phẩm */}
          <li>Sản phẩm 1</li>
          <li>Sản phẩm 2</li>
        </ul>
        <Button className="mt-2 w-full" >
          Thanh toán
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
