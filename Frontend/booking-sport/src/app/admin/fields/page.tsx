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


export default function Field() {
    const [Fields, setFields] = useState([]);
    const [Field, setField] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedFields, setSelectedFields] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    let a;
    const [newField, setnewField] = useState({
        field_name: '',
        half_hour: '',
        location:'',
        descriptio:'',
        status:'',
        image_url:'',
        create_at:'',
        OwnerID:'',
        CategoryID:'',
        OptionID:''	
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target; // Lấy id và files từ target (input)
        if (files && files[0]) {
            const fileName = "/" + files[0].name; // Lấy tên file từ đối tượng file
            console.log(fileName); // In ra tên tệp
            // Nếu bạn muốn xử lý thêm, ví dụ như lưu vào state:
            setnewField((prev) => ({
                ...prev,
                [id]: fileName, // Lưu tên file vào state
            }));
        }
        // Nếu không phải file, xử lý giá trị text bình thường
        if (id !== "image") {
            const { value } = e.target;
            setnewField((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
        console.log(newField);
    };
        const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { id, value } = e.target;
            const timestamp = new Date().toISOString(); // Get real-time timestamp
        
            setnewField((prev) => ({
                ...prev,
                [id]: value,
                createAt: timestamp // Assign timestamp to createAt
            }));
        
            console.log({ ...newField, [id]: value, createAt: timestamp }); // Logs the expected updated state
        };
    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/Fields/get")
            .then(Fields => setFields(Fields.data))
            .catch(err => console.log(err))
    }, []);
    const handleDeleteClick = (Fields: React.SetStateAction<null>) => {
        setSelectedFields(Fields);
        setShowAlert(true);
    }
    const handleEditClick = (Field: any) => {
        setField(Field);
        setnewField(Field);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
        setSelectedFields(null);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedFields(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/admin/Fields/update/${Field.fields_id}`, newField)
            .then(() => {
                toast({
                    title: "Fields Edit",
                    description: `Fields has been edit.`,
                });
                // Reload the Fields or update state after deletion
                axios.get("http://localhost:5000/api/admin/Fields/get")
                    .then((response) => setFields(response.data))
                    .catch((err) => console.error("Error fetching Fields:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting Fields:", err);
                toast({
                    title: "Edit Failed",
                    description: `There was an error edit the Fields.`,
                    variant: "destructive",
                });
            });
    }
    const handleConfirmDelete = () => {
        // Make sure Fields.id is passed dynamically in the URL
        if (selectedFields) {
            axios.delete(`http://localhost:5000/api/admin/Fields/delete/${selectedFields.id}`)
                .then(() => {
                    toast({
                        title: "Fields Deleted",
                        description: `Fields has been deleted.`,
                    });
                    // Reload the Fields or update state after deletion
                    axios.get("http://localhost:5000/api/admin/Fields/get")
                        .then((response) => setFields(response.data))
                        .catch((err) => console.error("Error fetching Fields:", err));

                    setShowAlert(false);  // Close the alert dialog
                })
                .catch((err) => {
                    console.error("Error deleting Fields:", err);
                    toast({
                        title: "Delete Failed",
                        description: `There was an error deleting the Fields.`,
                        variant: "destructive",
                    });
                });
        }
    };
    const handleCreateFields = () => {
        console.log(newField);
        axios.post("http://localhost:5000/api/admin/Fields/create", newField)
            .then(() => {
                toast({
                    title: "Fields Created",
                    description: "New Fields has been added successfully.",
                });
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/admin/Fields/get")
                    .then((response) => setFields(response.data))
                    .catch((err) => console.error("Error fetching Fields:", err));
                setnewField({
                    field_name: '',
                    half_hour: '',
                    location:'',
                    descriptio:'',
                    status:'',
                    image_url:'',
                    create_at:'',
                    OwnerID:'',
                    CategoryID:'',
                    OptionID:''	
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating Fields:", err));
    };
    return (
        <Admin>
            <title>Field</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Add Fields
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Fields</DialogTitle>
                                    <DialogDescription>
                                        Add new Fields to store catalog.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="image" className="text-right col-span-2">
                                            Image
                                        </Label>
                                        <Input onChange={handleInputChange} id="image" type="file" className="col-span-4" accept="Image/*" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="image" className="text-right col-span-2">
                                            Field Name
                                        </Label>
                                        <Input onChange={handleInputChange} id="FieldName" type="text" className="col-span-4" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreateFields}>
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
                            <CardTitle>Field</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Field Name</TableHead>
                                        <TableHead>Owner name</TableHead>
                                        <TableHead>Category name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>status</TableHead>
                                        <TableHead>Half hour</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Fields.map((Field: any) => (
                                        <TableRow key={Field.fields_id}>
                                            <TableCell className="font-medium">
                                                <Image
                                                    alt="Field image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="32"
                                                    src={Field.image_url}
                                                    width="32"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.field_name}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.category.category_name}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.category.half_hour}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.location}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.description}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.status}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.half_hour}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Field.user.user_name}
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(Field)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(Field)}>Delete</DropdownMenuItem>
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
                                Fields
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this Fields?
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
                        <AlertDialogTitle>Edit Fields</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <Image className="mx-auto" src={Field.image} alt={""} width={96} height={96} />
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="image" className="text-right col-span-2">
                                Image
                            </Label>
                            <Input onChange={handleInputChange} id="image" type="file" className="col-span-4" accept="Image/*" />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="image" className="text-right col-span-2">
                                Field Name
                            </Label>
                            <Input onChange={handleInputChange} id="FieldName" type="text" className="col-span-4" defaultValue={Field.FieldName}/>
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
