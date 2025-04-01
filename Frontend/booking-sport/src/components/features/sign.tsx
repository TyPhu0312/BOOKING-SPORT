"use client";

import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { sha3_512 } from 'js-sha3';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
// Login Component
export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Fetch user data by email from the backend
            const response = await fetch(`http://localhost:5000/api/admin/user/getByEmail/${email}`);

            if (!response.ok) {
                throw new Error('User not found');
            }

            const user = await response.json();

            // Use js-sha3 to hash the entered password with sha3-512
            const hashedPassword = sha3_512(password);  // Hash the password using sha3-512

            // Compare the hashed password with the stored password (which should also be hashed)
            if (user && hashedPassword === user.passWord) {
                alert("Đăng nhập thành công!");
                if (user.role.roleName === "Admin") {
                    sessionStorage.setItem("user_info", JSON.stringify(user));
                    router.push('/admin');
                } else {
                    sessionStorage.setItem("user_info", JSON.stringify(user));
                    router.push('/');
                }

            } else {
                alert('Invalid password');
            }
        } catch (error: any) {
            alert('Invalid email');
        }
    };

    return (
        <div>
            <h1 className="text-3xl text-center">ĐĂNG NHẬP</h1>
            <form onSubmit={handleLogin}>
                <Label htmlFor="email">Email của bạn</Label>
                <Input
                    className="mt-2 mb-4 bg-transparent rounded-full"
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                    <Input
                        className="mt-2 mb-2 bg-transparent rounded-full"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
                <center>
                    <Button className="bg-gradient-to-r from-[#FFA008] to-[#FF6F00] text-white font-bold py-2 px-4 rounded" type="submit">
                        Đăng nhập
                    </Button>
                </center>

            </form>
            <center>
                <p>Chưa có tài khoản ? <Link href="/register">Đăng ký</Link></p>
            </center>
        </div>
    );
}


export function Sign() {
    interface Role {
        id: string;
        roleName: string;
    }

    const [newUser, setNewUser] = useState({
        roleID: '',
        name: '',
        email: '',
        passWord: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roles, setRoles] = useState<Role[]>([]); // set to array of roles
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/role/get")
            .then((response) => setRoles(response.data))
            .catch((err) => console.log(err));
    }, []);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // If roles are fetched, find the role with name 'User'
        const userRole = roles.find((role) => role.roleName === "User");
        const roleID = userRole ? userRole.id : ''; // Use the ID of the found role, or default to an empty string

        setNewUser((prev) => ({
            ...prev,
            [name]: value,
            roleID, // Set the roleID here
        }));

        console.log(newUser); // It's asynchronous, so this may not show the updated value immediately
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(newUser);
        console.log("pass", newUser.passWord);
        console.log("passcf", confirmPassword);
        if (newUser.passWord !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Create user in the backend
            await axios.post("http://localhost:5000/api/admin/user/create", newUser);
            toast({
                title: "User Created",
                description: "New User has been added successfully.",
            });

            // Reset form

            setConfirmPassword('');

            // Register user with Firebase
            setNewUser({
                name: '',
                email: '',
                passWord: '',
                roleID: '',
            });
            alert("Đăng ký thành công!");
            router.push('/login');
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || err.message || "An error occurred");
        }
    };

    return (
        <div>
            <h1 className="text-3xl text-center">ĐĂNG KÝ</h1>
            <form onSubmit={handleRegister}>
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input
                    className="mt-2 mb-4 bg-transparent rounded-full"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Tên hiển thị"
                    value={newUser.name}
                    onChange={handleInputChange}
                />
                <Label htmlFor="email">Email của bạn</Label>
                <Input
                    className="mt-2 mb-4 bg-transparent rounded-full"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                />
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                    <Input
                        className="mt-2 mb-4 bg-transparent rounded-full"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="passWord"
                        placeholder="Password"
                        value={newUser.passWord}
                        onChange={handleInputChange}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                    <Input
                        className="mt-2 mb-4 bg-transparent rounded-full"
                        type={showPassword1 ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility1}
                    >
                        {showPassword1 ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
                <center>
                    <Button
                        className="bg-gradient-to-r from-[#FFA008] to-[#FF6F00] text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Đăng ký
                    </Button>
                </center>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </form>
            <center>
                <p>Bạn đã có tài khoản? <Link href="/login">Đăng nhập</Link></p>
            </center>
            {/* {roles.map((role:any)=>(
                <p>{role.roleName}</p>
            ))} */}
        </div>
    );
}

export function RSign() {
    return (
        <Image
            className="object-cover"
            fill={true}
            src="/loginimg.jpg"
            alt="bg-image"
        />
    );
}