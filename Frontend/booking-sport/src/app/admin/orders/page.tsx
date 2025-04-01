"use client"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Admin from "../page"
import { useEffect, useState } from "react"
import axios from "axios"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { any } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialogadmin"
import { useRouter } from 'next/compat/router';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
export default function Orders() {
    const router = useRouter();
    const getStatusColor = (status: any) => {
        switch (status) {
            case "Processing":
                return "bg-yellow-500 text-white"; // Màu vàng
            case "Cancelled":
                return "bg-red-500 text-white"; // Màu đỏ
            case "Completed":
                return "bg-green-500 text-white"; // Màu xanh
            default:
                return "bg-gray-500 text-white"; // Màu xám cho trạng thái không xác định
        }
    };
    enum Status {
        Pending = "Pending",
        Processing = "Processing",
        Completed = "Completed",
        Cancelled = "Cancelled",
    }
    let total = 0;
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderDetailFilter, setOrderDetailFilter] = useState<any>([]);
    const [showView, setShowView] = useState(false);
    const [order, setOrder] = useState<any>([]);
    const [orders, setOrders] = useState([]);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [orderStatus, setOrderStatus] = useState({
        status: ""
    });
    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/order/get")
            .then(orders => setOrders(orders.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/admin/orderDetail/get")
            .then(orderDetail => setOrderDetail(orderDetail.data))
            .catch(err => console.log(err))
    }, []);
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
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setOrderStatus((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(orderStatus);
    };
    function handleViewClick(orders: any) {
        console.log(orders);
        setOrder(orders);
        const filteredOrderDetail = orderDetail.filter((detail: any) => detail.orderID === orders.id);
        setOrderDetailFilter(filteredOrderDetail);
        setShowView(true);
    }
    function handleEditClick(orders: any) {
        setShowAlertEdit(true);
        console.log(orders);
        setOrder(orders);
        setOrderStatus(orders);
 
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }
    const handleViewClose = () => {
        setShowView(false);
    };
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/admin/order/update/${order.id}`, orderStatus)
            .then(() => {
                toast({
                    title: "Order status Edit",
                    description: `Order status has been edit.`,
                });
                axios.get("http://localhost:5000/api/admin/order/get")
                    .then((response) => setOrders(response.data))
                    .catch((err) => console.error("Error fetching Order status:", err));

                setShowAlertEdit(false);
            })
            .catch((err) => {
                console.error("Error deleting Order status:", err);
                toast({
                    title: "Edit Failed",
                    description: `There was an error edit the Order status.`,
                    variant: "destructive",
                });
            });
    }

    return (
        <Admin>
            <title>Order</title>
            <Tabs defaultValue="all">

                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {Object.values(Status).map((status) => (
                        <TabsTrigger key={status} value={status}>
                            {status}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="all">
                    <Card>
                        <CardHeader className="px-7">
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>Recent orders from your store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="table-cell">Phone</TableHead>
                                        <TableHead className="table-cell">Address</TableHead>
                                        <TableHead className="table-cell">Status</TableHead>
                                        <TableHead className="table-cell">Date</TableHead>
                                        <TableHead className="table-cell">Amount</TableHead>
                                        <TableHead className="table-cell">Payment method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((orders: any) => (
                                        <TableRow key={orders.id} className="bg-white">
                                            <TableCell>
                                                <div className="font-medium">{orders.user.name}</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    {orders.user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">{orders.phone}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{orders.address}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge className={`text-xs ${getStatusColor(orders.status)}`} variant="outline">
                                                    {orders.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{orders.orderDate}</TableCell>
                                            <TableCell className="">{formatPrice(orders.totalAmount)}</TableCell>
                                            <TableCell className="">{(orders.paymentMethod=='internetBanking') ? "Banking" : "Cod"}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        // onClick={() => handleToggleMenuClick(product)}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick(orders)}>View</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditClick(orders)}>Edit</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                {Object.values(Status).map((status) => (
                    <TabsContent value={status}>
                        <Card>
                            <CardHeader className="px-7">
                                <CardTitle>{status}</CardTitle>
                                <CardDescription>Recent orders from your store.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="table-cell">Phone</TableHead>
                                            <TableHead className="table-cell">Address</TableHead>
                                            <TableHead className="table-cell">Status</TableHead>
                                            <TableHead className="table-cell">Date</TableHead>
                                            <TableHead className="table-cell">Amount</TableHead>
                                            <TableHead className="table-cell">Payment method</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((orders: any) => {
                                            if (orders.status == status) {
                                                return (
                                                    <TableRow key={orders.id} className="bg-white">
                                                        <TableCell>
                                                            <div className="font-medium">{orders.user.name}</div>
                                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                                {orders.user.email}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">{orders.phone}</TableCell>
                                                        <TableCell className="hidden sm:table-cell">{orders.address}</TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Badge className={`text-xs ${getStatusColor(orders.status)}`} variant="outline">
                                                                {orders.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{orders.orderDate}</TableCell>
                                                        <TableCell className="">{formatPrice(orders.totalAmount)}</TableCell>
                                                        <TableCell className="">{orders.paymentMethod}</TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    // onClick={() => handleToggleMenuClick(product)}
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => handleViewClick(orders)}>View</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleEditClick(orders)}>Edit</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                ))}
                <Dialog open={showView} onOpenChange={setShowView}>
                    <DialogContent>
                        <div className="h-[80%]">
                            <DialogTitle>
                                <div className="flex justify-start item-start space-y-1 flex-col ">
                                    <h1 className="text-3xl font-semibold leading-7 lg:leading-9  text-gray-800">#{order.id}</h1>
                                    <p className="text-base font-medium leading-6 text-gray-600">Order date: {order.orderDate}</p>
                                </div>
                            </DialogTitle>

                            <div className=" flex flex-row jusitfy-center items-stretch w-full ">
                                <div className="flex flex-col justify-start items-start w-full ">
                                    <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 w-full">
                                        <p className="text-lg font-semibold leading-6 text-gray-800">Product</p>
                                        <Table>
                                            <ScrollArea className="h-80 w-auto rounded-md border p-3">
                                                <TableHeader>
                                                    <TableRow className="sticky top-0 bg-gray-300 text-black">
                                                        <TableHead>Image</TableHead>
                                                        <TableHead className="hidden md:table-cell">Product name</TableHead>
                                                        <TableHead className="hidden md:table-cell">Price</TableHead>
                                                        <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                                                        <TableHead className="hidden md:table-cell">Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.isArray(orderDetailFilter) && orderDetailFilter.map((item: any) => {
                                                        const subtotal = item?.product?.price * item?.quantity || 0;
                                                        total += subtotal;
                                                        return (
                                                            <TableRow className="bg-white">
                                                                <TableCell>
                                                                    <div className="pb-4 w-24">
                                                                        <img
                                                                            className="w-full hidden md:block"
                                                                            src={item.product.image}
                                                                            alt="product image"
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">{item.product.title}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                                                                        {formatPrice(item.product.price)}
                                                                    </p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">{item.quantity}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">{formatPrice(subtotal)}</p>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </ScrollArea>
                                        </Table>

                                    </div>
                                    <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-0 md:space-x-6 xl:space-x-8">
                                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                                            <div className="flex justify-between items-center w-full">
                                                <h3 className="text-xl font-semibold leading-5 text-gray-800">Payment method</h3>
                                                <h3 className="text-xl font-semibold leading-5 text-gray-800">{order.paymentMethod}</h3>
                                            </div>
                                            <div className="flex justify-center items-center w-full  flex-col border-gray-200 border-b pb-4">
                                                {/* <div className="flex justify-between items-center w-full">
                                                <p className="text-base leading-4 text-gray-800">
                                                    Discount <span className="bg-gray-200 p-1 text-xs font-medium leading-3  text-gray-800">STUDENT</span>
                                                </p>
                                                <p className="text-base leading-4 text-gray-600">-$28.00 (50%)</p>
                                            </div> */}
                                                {/* <div className="flex justify-between items-center w-full">
                                                <p className="text-base leading-4 text-gray-800">Shipping</p>
                                                <p className="text-base leading-4 text-gray-600">$8.00</p>
                                            </div> */}
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <p className="text-base font-semibold leading-4 text-gray-800">Total</p>
                                                <p className="text-base font-semibold leading-4 text-gray-600">{formatPrice(total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Customer</h3>
                                    <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                                            <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                                <div className=" flex justify-start items-start flex-col space-y-2">
                                                    {order?.user?.name ? (
                                                        <p className="text-base font-semibold leading-4 text-left text-gray-800">{order.user.name}</p>
                                                    ) : (
                                                        <p className="text-base font-semibold leading-4 text-left text-gray-800">User name not available</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {order?.user?.email ? (
                                                    <p className="cursor-pointer text-sm leading-5 text-gray-800">{order.user.email}</p>
                                                ) : (
                                                    <p className="cursor-pointer text-sm leading-5 text-gray-800"></p>
                                                )}
                                            </div>
                                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
                                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{order.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0  xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col  xl:mt-8">
                                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order.address}</p>
                                                </div>
                                            </div>
                                            {/* <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                                            <button className="mt-6 md:mt-0 py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800">Edit Details</button>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit order status</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-6 items-center gap-4">
                                <Label htmlFor="status" className="text-right col-span-2">
                                    Status
                                </Label>
                                <select
                                    id="status"  // Đây là ID cho dropdown
                                    onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                    className="col-span-4"
                                >
                                    <option>{order.status || "No Status"}</option>
                                    {Object.values(Status).filter((status: any) =>status != order.status ).map((status: any) => (
                                        <option key={status} value={status} > {status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleAlertEditClose}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmEdit}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Tabs>
            <Toaster />
        </Admin >

    )
}

