"use client"
import { useEffect, useState } from "react"
import React from "react"
import {
    MoreHorizontal,
} from "lucide-react"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Booking {
    booking_id: string;
    booking_date: string; // hoặc Date nếu bạn parse từ backend
    time_start: string;   // hoặc Date
    time_end: string;     // hoặc Date
    total_price: number;
    deposit: number;
    Status: string;
    prove_payment: string;
    user: User;
    fields: Field;
}
interface Field {
    field_id: string;
    field_name: string;
    half_hour: boolean;
    location: string;
    description: string;
    status: string;
    image_url: string;
    create_at: string;
    user: User;
    category: Category;
    option: Option;
}

interface Option {
    option_field_id: string;
    number_of_field: string;
    category: Category;
}

interface Category {
    category_id: string
    category_name: string
}

interface User {
    user_id: string;
    username: string;
    passWord: string;
    email: string;
    phone_number: string;
}
enum status {
    Pending,
    Confirmed,
    Cancelled
}

// Hàm format ngày
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB').format(new Date(date));
  };
  
  // Hàm format giờ
  const formatTime = (date: Date) => {
    // Trừ đi 7 giờ
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - 7);
  
    // Format lại giờ sau khi đã trừ đi 7 giờ
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(newDate);
  };
  
export default function Booking() {
    const [Bookings, setBookings] = useState([]);
    const [selectedBookings, setSelectedBookings] = useState<Booking | undefined>();
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/Booking/get")
          .then(response => {
            // Format ngày và giờ cho mỗi booking
            const formattedBookings = response.data.map((booking: any) => ({
              ...booking,
              booking_date: formatDate(booking.booking_date),
              time_start: formatTime(booking.time_start),
              time_end: formatTime(booking.time_end),
            }));
            setBookings(formattedBookings);
          })
          .catch(err => console.log(err));
      }, []);

    const handleDeleteClick = (Bookings: Booking) => {
        setSelectedBookings(Bookings);
        console.log(selectedBookings);
        setShowAlert(true);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedBookings(undefined);
    }

    const handleConfirmDelete = () => {
        // Make sure Fields.id is passed dynamically in the URL
        if (selectedBookings) {
            axios.delete(`http://localhost:5000/api/admin/Booking/delete/${selectedBookings.booking_id}`)
                .then(() => {
                    toast({
                        title: "Booking Deleted",
                        description: `Booking has been deleted.`,
                    });
                    // Reload the Booking or update state after deletion
                    axios.get("http://localhost:5000/api/admin/Booking/get")
                        .then((response) => {
                            const formattedBookings = response.data.map((booking: any) => ({
                              ...booking,
                              booking_date: formatDate(booking.booking_date),
                              time_start: formatTime(booking.time_start),
                              time_end: formatTime(booking.time_end),
                            }));
                            setBookings(formattedBookings);
                          })
                          .catch((err) => console.error("Error fetching Booking:", err));
              
                        setShowAlert(false); // Close the alert dialog
                })
                .catch((err) => {
                    console.error("Error deleting Booking:", err);
                    toast({
                        title: "Delete Failed",
                        description: `There was an error deleting the Booking.`,
                        variant: "destructive",
                    });
                });
        }
    };
    return (
        <main>
            <title>Booking</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {Object.keys(status)
                            .filter((key) => isNaN(Number(key))) // loại bỏ giá trị số do enum hai chiều
                            .map((key) => (
                                <TabsTrigger key={key} value={key}>{key}</TabsTrigger>
                            ))}
                    </TabsList>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Field Name</TableHead>
                                        <TableHead>Customer Name</TableHead>
                                        <TableHead>Booking date</TableHead>
                                        <TableHead>time</TableHead>
                                        <TableHead>Total price</TableHead>
                                        <TableHead>Deposit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Prove payment</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Bookings.map((booking: Booking) => (
                                        <TableRow key={booking.booking_id}>
                                            {/* <TableCell className="font-medium">
                                                <Image
                                                    alt="Field image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="32"
                                                    src={Field.image_url}
                                                    width="32"
                                                />
                                            </TableCell> */}
                                            <TableCell className="font-medium">
                                                {booking.fields.field_name}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.user.username}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.booking_date}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.time_start}-{booking.time_end}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.total_price}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.deposit}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.Status}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {booking.prove_payment}
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
                                                        {/* <DropdownMenuItem onClick={() => handleEditClick(Field)}>Edit</DropdownMenuItem> */}
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(booking)}>Delete</DropdownMenuItem>
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
                                Booking
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
                {Object.keys(status)
                    .filter((key) => isNaN(Number(key))) // loại bỏ giá trị số do enum hai chiều
                    .map((key) => (
                        <TabsContent key={key} value={key}>
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>{key}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field Name</TableHead>
                                                <TableHead>Customer Name</TableHead>
                                                <TableHead>Booking date</TableHead>
                                                <TableHead>time</TableHead>
                                                <TableHead>Total price</TableHead>
                                                <TableHead>Deposit</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Prove payment</TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {Bookings.map((booking: Booking) => {
                                                if (booking.Status == key) {
                                                    return (
                                                        <TableRow key={booking.booking_id}>
                                                            <TableCell className="font-medium">
                                                                {booking.fields.field_name}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.user.username}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.booking_date}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.time_start}-{booking.time_end}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.total_price}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.deposit}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.Status}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {booking.prove_payment}
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
                                                                        {/* <DropdownMenuItem onClick={() => handleEditClick(Field)}>Edit</DropdownMenuItem> */}
                                                                        <DropdownMenuItem onClick={() => handleDeleteClick(booking)}>Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>)
                                                }
                                            })}

                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        Booking
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
            <Toaster />
        </main>
    )
}
