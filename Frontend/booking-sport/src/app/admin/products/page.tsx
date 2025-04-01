"use client"
import { useEffect, useState } from "react"
import React from "react"
import Image from "next/image"
import {
    File,
    ListFilter,
    MoreHorizontal,
    PlusCircle,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import axios from "axios"
import Admin from "../page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"


export default function Products() {
    const [file, setFile] = useState<File | null>(null);
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState<any>([]);
    const [categories, setCategories] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    let a;
    const [newProduct, setNewProduct] = useState({
        image: '',
        categoryID: '',
        title: '',
        calories: "",
        price: 0,
        description: ''
    });
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;

        // Kiểm tra xem có phải là trường categoryName không
        if (id === "id") {
            setNewProduct((prev) => ({
                ...prev,
            }));
        } else {
            // Cập nhật các trường còn lại trong newProduct
            setNewProduct((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
        console.log(newProduct);
    };
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        // Kiểm tra xem có phải là trường categoryName không
        if (id === "id") {
            setNewProduct((prev) => ({
                ...prev,
            }));
        } else {
            // Cập nhật các trường còn lại trong newProduct
            setNewProduct((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
        console.log(newProduct);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target; // Lấy id và files từ target (input)
        if (files && files[0]) {
            const fileName = "/" + files[0].name; // Lấy tên file từ đối tượng file
            console.log(fileName); // In ra tên tệp
            // Nếu bạn muốn xử lý thêm, ví dụ như lưu vào state:
            setNewProduct((prev) => ({
                ...prev,
                [id]: fileName, // Lưu tên file vào state
            }));
        }
        // Nếu không phải file, xử lý giá trị text bình thường
        if (id !== "image") {
            const { value } = e.target;
            setNewProduct((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
        console.log(newProduct);
    };


    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/product/get")
            .then(products => setProducts(products.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/admin/category/get")
            .then(categories => setCategories(categories.data))
            .catch(err => console.log(err))
    }, []);
    // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
    //     setSelectedProduct(product);
    //     a = selectedProduct;
    // }
    const handleDeleteClick = (product: React.SetStateAction<null>) => {
        setSelectedProduct(product);
        setShowAlert(true);
    }
    const handleEditClick = (product: any) => {
        setProduct(product);
        setNewProduct(product);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
        setSelectedProduct(null);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedProduct(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/admin/product/update/${product.id}`, newProduct)
            .then(() => {
                toast({
                    title: "Product Edit",
                    description: `Product has been edit.`,
                });
                // Reload the products or update state after deletion
                axios.get("http://localhost:5000/api/admin/product/get")
                    .then((response) => setProducts(response.data))
                    .catch((err) => console.error("Error fetching products:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting product:", err);
                toast({
                    title: "Edit Failed",
                    description: `There was an error edit the product.`,
                    variant: "destructive",
                });
            });
    }
    const handleConfirmDelete = () => {
        // Make sure product.id is passed dynamically in the URL
        if (selectedProduct) {
            axios.delete(`http://localhost:5000/api/admin/product/delete/${selectedProduct.id}`)
                .then(() => {
                    toast({
                        title: "Product Deleted",
                        description: `Product has been deleted.`,
                    });
                    // Reload the products or update state after deletion
                    axios.get("http://localhost:5000/api/admin/product/get")
                        .then((response) => setProducts(response.data))
                        .catch((err) => console.error("Error fetching products:", err));

                    setShowAlert(false);  // Close the alert dialog
                })
                .catch((err) => {
                    console.error("Error deleting product:", err);
                    toast({
                        title: "Delete Failed",
                        description: `There was an error deleting the product.`,
                        variant: "destructive",
                    });
                });
        }
    };
    const handleCreateProduct = () => {
        console.log(newProduct);
        axios.post("http://localhost:5000/api/admin/product/create", newProduct)
            .then(() => {
                toast({
                    title: "Product Created",
                    description: "New product has been added successfully.",
                });
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/admin/product/get")
                    .then((response) => setProducts(response.data))
                    .catch((err) => console.error("Error fetching products:", err));
                setNewProduct({
                    image: '',
                    categoryID: '',
                    title: '',
                    calories: "",
                    price: 0,
                    description: ''
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating product:", err));
    };
    return (
        <Admin>
            <title>Product</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {categories.map((Categories: any) => (
                            <TabsTrigger value={Categories.categoryName}>{Categories.categoryName}</TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Archived
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Add Product
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                    <DialogDescription>
                                        Add new product to store catalog.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="image" className="text-right col-span-2">
                                            Image
                                        </Label>
                                        <Input onChange={handleInputChange} id="image" type="file" className="col-span-4" accept="Image/*" />
                                    </div>
                                    {/* <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="category" className="text-right col-span-2">
                                            Title
                                        </Label>
                                        <Input onChange={handleInputChange} id="categoryID" type="text" className="col-span-4" />
                                    </div> */}

                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="categoryID" className="text-right col-span-2">
                                            Category
                                        </Label>
                                        <select
                                            id="categoryID"  // Đây là ID cho dropdown
                                            onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category: any) => (
                                                <>
                                                    <option key={category.id} value={category.id}>{category.categoryName}</option></>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="title" className="text-right col-span-2">
                                            Product name
                                        </Label>
                                        <Input onChange={handleInputChange} id="title" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="calories" className="text-right col-span-2">
                                            Calories
                                        </Label>
                                        <Input onChange={handleInputChange} id="calories" type="number" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="price" className="text-right col-span-2">
                                            Price
                                        </Label>
                                        <Input onChange={handleInputChange} id="price" type="number" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="description" className="text-right col-span-2">
                                            Description
                                        </Label>
                                        <Textarea onChange={handleTextareaChange} id="description" className="col-span-4" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreateProduct}>
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                            <CardDescription>
                                Manage your products and view their sales performance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Calories</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Decsription
                                        </TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product: any) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="32"
                                                    src={product.image}
                                                    width="32"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.category.categoryName}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.title}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.calories}
                                            </TableCell>
                                            <TableCell className="font-medium">{product.price}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {product.description}
                                            </TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(product)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(product)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                products
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
                {categories.map((Categories: any) => (
                    <TabsContent value={Categories.categoryName}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                                <CardDescription>
                                    Manage your products and view their sales performance.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Calories</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="hidden md:table-cell">
                                                Decsription
                                            </TableHead>
                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product: any) => {
                                            if (product.category.categoryName == Categories.categoryName) {
                                                return (
                                                    <TableRow key={product.id}>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Image
                                                                alt="Product image"
                                                                className="aspect-square rounded-md object-cover"
                                                                height="32"
                                                                src={product.image}
                                                                width="32"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {product.category.categoryName}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {product.title}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {product.calories}
                                                        </TableCell>
                                                        <TableCell className="font-medium">{product.price}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {product.description}
                                                        </TableCell>
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
                                                                    <DropdownMenuItem onClick={() => handleEditClick(product)}>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDeleteClick(product)}>Delete</DropdownMenuItem>
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
                            <CardFooter>
                                <div className="text-xs text-muted-foreground">
                                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                    products
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this product?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertClose}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit product</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <Image className="mx-auto" src={product.image} alt={""} width={96} height={96} />
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="image" className="text-right col-span-2">
                                Image
                            </Label>
                            <Input onChange={handleInputChange} id="image" type="file" className="col-span-4" accept="Image/*" />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="categoryID" className="text-right col-span-2">
                                Category
                            </Label>
                            <select
                                id="categoryID"  // Đây là ID cho dropdown
                                onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                className="col-span-4"
                            >
                                <option>{product.category?.categoryName || "No Category"}</option>
                                {categories.filter((category: any) => category.id != product.categoryID).map((category: any) => (
                                    <option key={category.id} value={category.id} > {category.categoryName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="title" className="text-right col-span-2">
                                Product name
                            </Label>
                            <Input onChange={handleInputChange} id="title" type="text" className="col-span-4" defaultValue={product.title} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="calories" className="text-right col-span-2">
                                Calories
                            </Label>
                            <Input onChange={handleInputChange} id="calories" type="number" className="col-span-4" defaultValue={product.calories} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="price" className="text-right col-span-2">
                                Price
                            </Label>
                            <Input onChange={handleInputChange} id="price" type="number" className="col-span-4" defaultValue={product.price} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="description" className="text-right col-span-2">
                                Description
                            </Label>
                            <Textarea onChange={handleTextareaChange} id="description" className="col-span-4" defaultValue={product.description} />
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
            <Toaster />
        </Admin >
    )
}
