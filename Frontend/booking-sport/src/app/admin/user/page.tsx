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
import { createDecipheriv } from "crypto"


export default function User() {
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState<any>([]);
    const [roles, setRoles] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    let a;
    const [newUser, setNewUser] = useState({
        roleID: '',
        username: '',
        passWord: '',
        email: '',
        phone_number: '',
        createAt: ''
    });
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newUser);
    };
    const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target;

        const { value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newUser);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const timestamp = new Date().toISOString(); // Get real-time timestamp
    
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
            createAt: timestamp // Assign timestamp to createAt
        }));
    
        console.log({ ...newUser, [id]: value, createAt: timestamp }); // Logs the expected updated state
    };
    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/user/get")
            .then(users => setUsers(users.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/admin/roles/get")
            .then(roles => setRoles(roles.data))
            .catch(err => console.log(err))
    }, []);
    // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
    //     setSelectedProduct(product);
    //     a = selectedProduct;
    // }
    const handleDeleteClick = (user: React.SetStateAction<null>) => {
        setSelectedUser(user);
        setShowAlert(true);
    }
    const handleEditClick = (user: any) => {
        setUser(user);
        setNewUser(user);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedUser(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/admin/user/update/${user.user_id}`, newUser)
            .then(() => {
                toast({
                    title: "User Edit",
                    description: `User has been edit.`,
                });
                // Reload the users or update state after deletion
                axios.get("http://localhost:5000/api/admin/user/get")
                    .then((response) => setUsers(response.data))
                    .catch((err) => console.error("Error fetching users:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting user:", err);
                toast({
                    title: "Edit Failed",
                    description: `There was an error edit the user.`,
                    variant: "destructive",
                });
            });
    }
    const handleConfirmDelete = () => {

        if (selectedUser) {
            axios.delete(`http://localhost:5000/api/admin/user/delete/${selectedUser.user_id}`)
                .then(() => {
                    toast({
                        title: "User Deleted",
                        description: `User has been deleted.`,
                    });
                    axios.get("http://localhost:5000/api/admin/user/get")
                        .then((response) => setUsers(response.data))
                        .catch((err) => console.error("Error fetching users:", err));

                    setShowAlert(false);  // Close the alert dialog
                })
                .catch((err) => {
                    console.error("Error deleting user:", err);
                    toast({
                        title: "Delete Failed",
                        description: `There was an error deleting the user.`,
                        variant: "destructive",
                    });
                });
        }
    };
    const handleCreateUser = () => {
        console.log(newUser);
        axios.post("http://localhost:5000/api/admin/user/create", newUser)
            .then(() => {
                toast({
                    title: "User Created",
                    description: "New User has been added successfully.",
                });
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/admin/user/get")
                    .then((response) => setUsers(response.data))
                    .catch((err) => console.error("Error fetching users:", err));
                setNewUser({
                    roleID: '',
                    username: '',
                    passWord: '',
                    email: '',
                    phone_number: '',
                    createAt: ''
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating userduct:", err));
    };
    return (
        <Admin>
            <title>User</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {roles.map((roles: any) => (
                            <TabsTrigger key={roles.role_id} value={roles.roleName}>{roles.roleName}</TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Add User
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>
                                        Add new User to store catalog.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">

                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="roleID" className="text-right col-span-2">
                                            Role
                                        </Label>
                                        <select
                                            id="roleID"  // Đây là ID cho dropdown
                                            onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role: any) => (
                                                <>
                                                    <option key={role.role_id} value={role.role_id}>{role.roleName}</option></>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="username" className="text-right col-span-2">
                                            User name
                                        </Label>
                                        <Input onChange={handleInputChange} id="username" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="passWord" className="text-right col-span-2">
                                            Password
                                        </Label>
                                        <Input onChange={handleInputChange} id="passWord" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="email" className="text-right col-span-2">
                                            Email
                                        </Label>
                                        <Input onChange={handleInputChange} id="email" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="phone_number" className="text-right col-span-2">
                                            Phone Number
                                        </Label>
                                        <Input onChange={handleInputChange} id="phone_number" type="text" className="col-span-4" />
                                    </div>
    
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreateUser}>
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
                            <CardTitle>All</CardTitle>
                            <CardDescription>
                                Manage your users and view their sales performance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden">Password</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>SĐT</TableHead>
                                        <TableHead className="hidden">Password</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: any) => (
                                        <TableRow key={user.user_id}>
                                            <TableCell className="hidden sm:table-cell">{user.role?.roleName}</TableCell>
                                            <TableCell className="font-medium">{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="font-medium">{user.phone_number}</TableCell>
                                            <TableCell className="font-medium hidden">{user.passWord}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(user)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(user)}>Delete</DropdownMenuItem>
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
                                users
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
                {roles.map((roles: any) => (
                    <TabsContent key={roles.role_id} value={roles.roleName}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>{roles.roleName}</CardTitle>
                                <CardDescription>
                                    Manage your users and view their sales performance.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Role</TableHead>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Password</TableHead>
                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((users: any) => {
                                            if (users.role.roleName == roles.roleName) {
                                                return (
                                                    <TableRow key={users.user_id}>
                                                        <TableCell className="hidden sm:table-cell">
                                                            {users.role.roleName}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {users.user_id}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {users.username}
                                                        </TableCell>
                                                        <TableCell>{users.email}</TableCell>
                                                        <TableCell className="font-medium ">
                                                            {users.passWord}
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
                                                                    <DropdownMenuItem onClick={() => handleEditClick(users)}>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDeleteClick(users)}>Delete</DropdownMenuItem>
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
                                    users
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
                            Are you sure you want to delete this user?
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
                        <AlertDialogTitle>Edit userduct</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="roleID" className="text-right col-span-2">
                                Role
                            </Label>
                            <select
                                id="roleID"  // Đây là ID cho dropdown
                                onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                className="col-span-4"
                            >
                                <option>{user.role?.roleName || "No Role"}</option>
                                {roles.filter((role: any) => role.role_id != user.roleID).map((role: any) => (
                                    <option key={role.role_id} value={role.role_id} > {role.roleName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="title" className="text-right col-span-2">
                                User name
                            </Label>
                            <Input onChange={handleInputChange1} id="username" type="text" className="col-span-4" defaultValue={user.username} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="passWord" className="text-right col-span-2">
                                Password
                            </Label>
                            <Input onChange={handleInputChange1} id="passWord" type="text" className="col-span-4" defaultValue={user.passWord} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right col-span-2">
                                SĐT
                            </Label>
                            <Input onChange={handleInputChange1} id="phone_number" type="text" className="col-span-4" defaultValue={user.phone_number} />
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
