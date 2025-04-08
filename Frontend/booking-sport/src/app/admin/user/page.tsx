"use client"
import { useEffect, useState } from "react"
import React from "react"
import {
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
    user_id: string;
    username: string;
    passWord: string;  // Đảm bảo có passWord
    email: string;
    phone_number: string;
    create_at: string; // Đảm bảo có create_at
    role: Role
}

interface Role {
    role_id: string;  // ID của vai trò (UUID hoặc string)
    roleName: string; // Tên vai trò (Admin, User, etc.)
}
export default function User() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState<User | undefined>();
    const [roles, setRoles] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    const [newUser, setNewUser] = useState({
        user_id: '',
        username: '',
        passWord: '', // Thêm passWord
        email: '',
        phone_number: '',
        create_at: '',  // Đảm bảo có create_at
    });
    const [UserCreate, setUserCreate] = useState({
        roleID: '',
        username: '',
        passWord: '', // Thêm passWord
        email: '',
        phone_number: '',
        create_at: ''  // Đảm bảo có create_at
    });
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newUser);
    };
    const handleInputChange2Create = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setUserCreate((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(UserCreate);
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
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { id, value } = e.target;
    //     const timestamp = new Date().toISOString(); // Get real-time timestamp

    //     setNewUser((prev) => ({
    //         ...prev,
    //         [id]: value,
    //         create_at: timestamp // Assign timestamp to create_at
    //     }));

    //     console.log({ ...newUser, [id]: value, create_at: timestamp }); // Logs the expected updated state
    // };
    const handleInputChangeCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const timestamp = new Date().toISOString(); // Get real-time timestamp

        setUserCreate((prev) => ({
            ...prev,
            [id]: value,
            create_at: timestamp // Assign timestamp to create_at
        }));

        console.log({ ...UserCreate, [id]: value, create_at: timestamp }); // Logs the expected updated state
    };
    useEffect(() => {
        axios.get("https://booking-sport-lljl.onrender.com/api/admin/user/get")
            .then(users => setUsers(users.data))
            .catch(err => console.log(err))
        axios.get("https://booking-sport-lljl.onrender.com/api/admin/roles/get")
            .then(roles => setRoles(roles.data))
            .catch(err => console.log(err))
    }, []);
    // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
    //     setSelectedProduct(product);
    //     a = selectedProduct;
    // }
    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setShowAlert(true);
    }
    const handleEditClick = (user: User) => {
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
        if (!user) {
            console.error("User is undefined");
            toast({
                title: "Edit Failed",
                description: "No user selected for editing.",
                variant: "destructive",
            });
            return;
        }

        axios.put(`https://booking-sport-lljl.onrender.com/api/admin/user/update/${user.user_id}`, newUser)
            .then(() => {
                toast({
                    title: "User Edited",
                    description: "User has been successfully edited.",
                });

                // Cập nhật danh sách user sau khi chỉnh sửa thành công
                return axios.get("https://booking-sport-lljl.onrender.com/api/admin/user/get");
            })
            .then((response) => {
                setUsers(response.data);
                setShowAlert(false);  // Đóng hộp thoại alert
                setDialogOpen(false); // Đóng modal chỉnh sửa nếu có
            })
            .catch((err) => {
                console.error("Error editing user:", err);
                toast({
                    title: "Edit Failed",
                    description: "There was an error editing the user.",
                    variant: "destructive",
                });
            });
    };

    const handleConfirmDelete = () => {

        if (selectedUser) {
            axios.delete(`https://booking-sport-lljl.onrender.com/api/admin/user/delete/${selectedUser.user_id}`)
                .then(() => {
                    toast({
                        title: "User Deleted",
                        description: `User has been deleted.`,
                    });
                    axios.get("https://booking-sport-lljl.onrender.com/api/admin/user/get")
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
        console.log(UserCreate);
        axios.post("https://booking-sport-lljl.onrender.com/api/admin/user/create", UserCreate)
            .then(() => {
                toast({
                    title: "User Created",
                    description: "New User has been added successfully.",
                });
                // Load lại danh sách sản phẩm
                axios.get("https://booking-sport-lljl.onrender.com/api/admin/user/get")
                    .then((response) => setUsers(response.data))
                    .catch((err) => console.error("Error fetching users:", err));
                setUserCreate({
                    roleID: '',
                    username: '',
                    passWord: '', // Thêm passWord
                    email: '',
                    phone_number: '',
                    create_at: ''
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating userduct:", err));
    };
    return (
        <main>
            <title>User</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {roles.map((roles: Role) => (
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
                                            onChange={handleInputChange2Create}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role: Role) => (
                                                <>
                                                    <option key={role.role_id} value={role.role_id}>{role.roleName}</option></>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="username" className="text-right col-span-2">
                                            User name
                                        </Label>
                                        <Input onChange={handleInputChangeCreate} id="username" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="passWord" className="text-right col-span-2">
                                            Password
                                        </Label>
                                        <Input onChange={handleInputChangeCreate} id="passWord" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="email" className="text-right col-span-2">
                                            Email
                                        </Label>
                                        <Input onChange={handleInputChangeCreate} id="email" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="phone_number" className="text-right col-span-2">
                                            Phone Number
                                        </Label>
                                        <Input onChange={handleInputChangeCreate} id="phone_number" type="text" className="col-span-4" />
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
                                        <TableHead>Email</TableHead>
                                        <TableHead>SĐT</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: User) => (
                                        <TableRow key={user.user_id}>
                                            <TableCell className="hidden sm:table-cell">{user.role?.roleName}</TableCell>
                                            <TableCell className="font-medium">{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="font-medium">{user.phone_number}</TableCell>
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
                {roles.map((roles: Role) => (
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
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>SĐT</TableHead>
                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((users: User) => {
                                            if (users.role.roleName == roles.roleName) {
                                                return (
                                                    <TableRow key={users.user_id}>
                                                        <TableCell className="hidden sm:table-cell">{users.role?.roleName}</TableCell>
                                                        <TableCell className="font-medium">{users.username}</TableCell>
                                                        <TableCell>{users.email}</TableCell>
                                                        <TableCell className="font-medium">{users.phone_number}</TableCell>
                                                        <TableCell className="font-medium hidden">{users.passWord}</TableCell>
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
                                {roles.filter((role: Role) => role.role_id !== user?.role.role_id).map((role: Role) => (
                                    <option key={role.role_id} value={role.role_id}>{role.roleName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="title" className="text-right col-span-2">
                                User name
                            </Label>
                            <Input onChange={handleInputChange1} id="username" type="text" className="col-span-4" defaultValue={user?.username} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="passWord" className="text-right col-span-2">
                                Password
                            </Label>
                            <Input onChange={handleInputChange1} id="passWord" type="text" className="col-span-4" defaultValue={user?.passWord} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right col-span-2">
                                SĐT
                            </Label>
                            <Input onChange={handleInputChange1} id="phone_number" type="text" className="col-span-4" defaultValue={user?.phone_number} />
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
        </main>
    )
}
