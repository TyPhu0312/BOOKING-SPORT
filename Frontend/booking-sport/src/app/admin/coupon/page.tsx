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

interface Payment {
    payment_id: string;
    total_price: number;
    payment_date: string;
    method: string;
    status: string;
    isDeposit: boolean;
    booking: Booking;
}

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
    Success,
    Failed
}
export default function Coupon() {

    return (
        <main>
            <title>Coupon</title>
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
                            <CardTitle>Coupon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>CouponId</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Start date</TableHead>
                                        <TableHead>End date</TableHead>
                                        <TableHead>Tên sân</TableHead>
                                        <TableHead>Tên chủ sân</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                Coupon
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
                                                <TableHead>CouponId</TableHead>
                                                <TableHead>Discount</TableHead>
                                                <TableHead>Start date</TableHead>
                                                <TableHead>End date</TableHead>
                                                <TableHead>Tên sân</TableHead>
                                                <TableHead>Tên chủ sân</TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>


                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        Payment
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    ))}
            </Tabs>

            {/* <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
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
            <Toaster /> */}
        </main>
    )
}
