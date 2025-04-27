"use client";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

interface Field {
    field_id: string;
    field_name: string;
    half_hour: boolean;
    location: string;
    description: string;
    status: "Active" | "Inactive";
    image_url: string;
    create_at: string;
    owner: Owner;
    category: Category;
    options: OptionFieldRelation[];
}

interface OptionFieldRelation {
    option_field_id: string;
    optionField: OptionField;
}

interface OptionField {
    option_field_id: string;
    option_name: string;
    category: Category;
}

interface Category {
    category_id: string;
    category_name: string;
}

interface Owner {
    user_id: string;
    username: string;
    passWord: string;
    email: string;
    phone_number: string;
}

export default function Field() {
    const [fields, setFields] = useState<Field[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedField, setSelectedField] = useState<Field | undefined>(undefined);
    const { toast } = useToast();

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/fields/get")
            .then(response => {
                setFields(response.data);
                console.log("Fields loaded:", response.data);
            })
            .catch(err => console.log("Error loading fields:", err));
        axios.get("http://localhost:5000/api/admin/category/get")
            .then(response => {
                setCategory(response.data);
                console.log("Categories loaded:", response.data);
            })
            .catch(err => console.log("Error loading categories:", err));
    }, []);

    const handleDeleteClick = (field: Field) => {
        setSelectedField(field);
        setShowAlert(true);
    };

    const handleDetailClick = (field: Field) => {
        console.log("Opening modal for field:", field.field_id);
        setSelectedField(field);
        setShowDetailModal(true);
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedField(undefined);
    };

    const handleDetailModalClose = () => {
        console.log("Closing modal");
        setShowDetailModal(false);
        setSelectedField(undefined);
    };

    const handleConfirmDelete = () => {
        if (selectedField) {
            axios.delete(`http://localhost:5000/api/admin/fields/delete/${selectedField.field_id}`)
                .then(() => {
                    toast({
                        title: "Field Deleted",
                        description: `Field has been deleted.`,
                    });
                    setFields(fields.filter(field => field.field_id !== selectedField.field_id));
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting Field:", err);
                    toast({
                        title: "Delete Failed",
                        description: `There was an error deleting the Field.`,
                        variant: "destructive",
                    });
                });
        }
    };

    const handleStatusChange = (field: Field, newStatus: "Active" | "Inactive") => {
        axios.put(`http://localhost:5000/api/admin/fields/update/${field.field_id}`, {
            status: newStatus,
        })
            .then(() => {
                toast({
                    title: "Status Updated",
                    description: `Field status has been updated to ${newStatus}.`,
                });
                setFields(fields.map(f =>
                    f.field_id === field.field_id ? { ...f, status: newStatus } : f
                ));
            })
            .catch((err) => {
                console.error("Error updating Field status:", err);
                toast({
                    title: "Update Failed",
                    description: `There was an error updating the Field status.`,
                    variant: "destructive",
                });
            });
    };

    return (
        <main>
            <title>Danh sách sân thể thao đang có trong hệ thống</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {category.map((category: Category) => (
                            <TabsTrigger key={category.category_id} value={category.category_name}>
                                {category.category_name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Field</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Field Name</TableHead>
                                        <TableHead>Owner Name</TableHead>
                                        <TableHead>Category Name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Field Option</TableHead>
                                        <TableHead>Half Hour</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field: Field) => (
                                        <TableRow key={field.field_id}>
                                            <TableCell className="font-medium">
                                                {field.field_name}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {field.owner?.username ?? "Không xác định"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {field.category?.category_name ?? "Không xác định"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {field.location}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {field.description}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <select
                                                    value={field.status}
                                                    onChange={(e) => handleStatusChange(field, e.target.value as "Active" | "Inactive")}
                                                    className="border rounded p-1"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {field.options?.length > 0
                                                    ? field.options.map(opt => opt.optionField.option_name).join(", ")
                                                    : "Không xác định"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {field.half_hour ? 'Có' : 'Không'}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                            className="hover:bg-gray-100 transition-colors cursor-pointer"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDetailClick(field)}
                                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        >
                                                            Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(field)}
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
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
                                Showing <strong>1-{fields.length}</strong> of <strong>{fields.length}</strong> Fields
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
                {category.map((category: Category) => (
                    <TabsContent key={category.category_id} value={category.category_name}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>{category.category_name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Field Name</TableHead>
                                            <TableHead>Owner Name</TableHead>
                                            <TableHead>Category Name</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Half Hour</TableHead>
                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field: Field) => {
                                            if (field.category?.category_name === category.category_name) {
                                                return (
                                                    <TableRow key={field.field_id}>
                                                        <TableCell className="font-medium">
                                                            {field.field_name}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {field.owner?.username ?? "Không xác định"}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {field.category?.category_name ?? "Không xác định"}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {field.location}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {field.description}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            <select
                                                                value={field.status}
                                                                onChange={(e) => handleStatusChange(field, e.target.value as "Active" | "Inactive")}
                                                                className="border rounded p-1"
                                                            >
                                                                <option value="Active">Active</option>
                                                                <option value="Inactive">Inactive</option>
                                                            </select>
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {field.half_hour ? 'Có' : 'Không'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="hover:bg-gray-100 transition-colors cursor-pointer"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDetailClick(field)}
                                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                                                                    >
                                                                        Xem chi tiết
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteClick(field)}
                                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                                                                    >
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter>
                                <div className="text-xs text-muted-foreground">
                                    Showing <strong>1-{fields.filter(f => f.category?.category_name === category.category_name).length}</strong> of <strong>{fields.length}</strong> Fields
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
                            Are you sure you want to delete this Field?
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

            {/* Modal xem chi tiết với debug */}
            <Dialog
                open={showDetailModal}
                onOpenChange={(open) => {
                    console.log("onOpenChange triggered, new open state:", open);
                    setShowDetailModal(open);
                    if (!open) {
                        console.log("Modal closed, resetting selectedField");
                        setSelectedField(undefined);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-lg p-6">
                    <DialogHeader>
                        <div className="flex justify-between items-center">
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                                Chi tiết sân: {selectedField?.field_name}
                            </DialogTitle>
                            <button
                                onClick={() => {
                                    console.log("Close button clicked");
                                    handleDetailModalClose();
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer text-xl focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>
                        <DialogDescription className="text-sm text-gray-500">
                            Thông tin chi tiết về sân thể thao.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedField && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <Image
                                    src={selectedField.image_url}
                                    alt={selectedField.field_name}
                                    width={200}
                                    height={200}
                                    className="rounded-lg object-cover shadow-md"
                                    onError={() => console.log("Image load error for:", selectedField.field_id)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p><span className="font-semibold text-gray-700">Tên sân:</span> {selectedField.field_name}</p>
                                    <p><span className="font-semibold text-gray-700">Chủ sân:</span> {selectedField.owner?.username ?? "Không xác định"}</p>
                                    <p><span className="font-semibold text-gray-700">Danh mục:</span> {selectedField.category?.category_name ?? "Không xác định"}</p>
                                    <p><span className="font-semibold text-gray-700">Địa điểm:</span> {selectedField.location}</p>
                                </div>
                                <div className="space-y-2">
                                    <p><span className="font-semibold text-gray-700">Mô tả:</span> {selectedField.description}</p>
                                    <p><span className="font-semibold text-gray-700">Trạng thái:</span> {selectedField.status}</p>
                                    <p><span className="font-semibold text-gray-700">Tùy chọn sân:</span> {selectedField.options?.length > 0
                                        ? selectedField.options.map(opt => opt.optionField.option_name).join(", ")
                                        : "Không xác định"}</p>
                                    <p><span className="font-semibold text-gray-700">Đặt sân nửa giờ:</span> {selectedField.half_hour ? 'Có' : 'Không'}</p>
                                    <p><span className="font-semibold text-gray-700">Ngày tạo:</span> {new Date(selectedField.create_at).toLocaleDateString("vi-VN")}</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        console.log("Close button (footer) clicked");
                                        handleDetailModalClose();
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer"
                                >
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Toaster />
        </main>
    );
}