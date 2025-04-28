/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/app/hooks/useAuth";

interface Schedule {
    day_of_week: string;
    open_time: string;
    close_time: string;
    isClosed: boolean;
}

interface PriceRange {
    from_hour: string;
    to_hour: string;
    price: string;
    appliedDays: string[];
}

interface Category {
    category_id: string;
    category_name: string;
}

interface Option {
    option_field_id: string;
    option_name: string;
    CategoryID: string;
}

interface Province {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
}

interface Ward {
    code: number;
    name: string;
}

const RegisterField = () => {
    const router = useRouter();
    const { user, loading, isLoggedIn } = useAuth();
    
    useEffect(() => {
        if (!loading && (!user || !user.user_id)) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Form states
    const [fieldName, setFieldName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [halfHour, setHalfHour] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Address states
    const [address, setAddress] = useState({
        provinceCode: "",
        districtCode: "",
        wardCode: "",
        houseNumber: "",
        street: "",
        location: ""
    });

    // Schedule states
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            day_of_week: "Mon",
            open_time: "06:00",
            close_time: "22:00",
            isClosed: false,
        },
    ]);
    const [applyToRemainingDays, setApplyToRemainingDays] = useState<boolean[]>([true]);

    // Price range states
    const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
    const [currentPriceRange, setCurrentPriceRange] = useState<PriceRange>({
        from_hour: "",
        to_hour: "",
        price: "",
        appliedDays: [],
    });

    // Data states
    const [categories, setCategories] = useState<Category[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    // UI states
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const daysOfWeek = useMemo(() => [
        { backend: "Mon", display: "Thứ Hai" },
        { backend: "Tue", display: "Thứ Ba" },
        { backend: "Wed", display: "Thứ Tư" },
        { backend: "Thu", display: "Thứ Năm" },
        { backend: "Fri", display: "Thứ Sáu" },
        { backend: "Sat", display: "Thứ Bảy" },
        { backend: "Sun", display: "Chủ Nhật" }
    ], []);

    // Handlers
    const handleFieldNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldName(e.target.value);
    }, []);

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }, []);

    const handleCategoryChange = useCallback((value: string) => {
        setCategory(value);
        setSelectedOptions([]);
        setOptions([]);
    }, []);

    const handleOptionChange = useCallback((optionId: string, checked: boolean) => {
        if (!optionId) {
            console.warn("optionId is undefined, skipping update");
            return;
        }
        console.log("Option ID:", optionId, "Checked:", checked);
        setSelectedOptions(prev => {
            console.log("Previous selectedOptions:", prev);
            if (checked) {
                const newSelected = [...prev, optionId];
                console.log("New selectedOptions (added):", newSelected);
                return newSelected;
            }
            const newSelected = prev.filter(id => id !== optionId);
            console.log("New selectedOptions (removed):", newSelected);
            return newSelected;
        });
    }, []);

    const handleAddressChange = useCallback((field: keyof typeof address, value: string) => {
        setAddress(prev => {
            const newAddress = { ...prev, [field]: value };
            const locationParts = [
                newAddress.houseNumber,
                newAddress.street,
                wards.find(w => String(w.code) === newAddress.wardCode)?.name,
                districts.find(d => String(d.code) === newAddress.districtCode)?.name,
                provinces.find(p => String(p.code) === newAddress.provinceCode)?.name
            ].filter(Boolean);
            return { ...newAddress, location: locationParts.join(", ") };
        });
    }, [provinces, districts, wards]);

    const handleScheduleChange = useCallback((index: number, field: keyof Schedule, value: Schedule[keyof Schedule]) => {
        setSchedules(prev => {
            const newSchedules = [...prev];
            newSchedules[index] = { ...newSchedules[index], [field]: value };
            return newSchedules;
        });
    }, []);

    const handleApplyToRemainingDaysChange = useCallback((index: number, checked: boolean) => {
        const currentSchedule = schedules[index];

        if (!checked) {
            setApplyToRemainingDays(prev => {
                const newApplyToRemainingDays = [...prev];
                newApplyToRemainingDays[index] = false;
                return newApplyToRemainingDays;
            });
            return;
        }

        // Tạo lịch cho tất cả các ngày trong tuần, bắt đầu từ ngày hiện tại
        const newSchedules: Schedule[] = [];
        const newApplyToRemainingDays: boolean[] = [];

        // Thêm lịch cho tất cả các ngày trong tuần
        daysOfWeek.forEach((day, i) => {
            newSchedules.push({
                day_of_week: day.backend,
                open_time: currentSchedule.open_time,
                close_time: currentSchedule.close_time,
                isClosed: currentSchedule.isClosed,
            });
            // Chỉ đánh dấu "Áp dụng cho các ngày còn lại" cho ngày hiện tại
            newApplyToRemainingDays.push(i === index);
        });

        setSchedules(newSchedules);
        setApplyToRemainingDays(newApplyToRemainingDays);
    }, [schedules, daysOfWeek]);

    const removeScheduleDay = useCallback((index: number) => {
        if (schedules.length === 1) {
            toast.error("Phải có ít nhất một ngày trong lịch!");
            return;
        }

        setSchedules(prev => {
            const newSchedules = prev.filter((_, i) => i !== index);

            if (!applyToRemainingDays.some(value => value) && newSchedules.length < 7) {
                setApplyToRemainingDays(prev => {
                    const newApplyToRemainingDays = prev.filter((_, i) => i !== index);
                    newApplyToRemainingDays[newSchedules.length - 1] = true;
                    return newApplyToRemainingDays;
                });
            } else {
                setApplyToRemainingDays(prev => prev.filter((_, i) => i !== index));
            }

            return newSchedules;
        });
    }, [schedules.length, applyToRemainingDays]);

    const handleCurrentPriceRangeChange = useCallback((field: keyof PriceRange, value: string) => {
        setCurrentPriceRange(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleDaySelection = useCallback((day: string, checked: boolean) => {
        setCurrentPriceRange(prev => {
            const newAppliedDays = [...prev.appliedDays];
            if (checked) {
                newAppliedDays.push(day);
            } else {
                newAppliedDays.splice(newAppliedDays.indexOf(day), 1);
            }
            return { ...prev, appliedDays: newAppliedDays };
        });
    }, []);

    const addPriceRange = useCallback(() => {
        setPriceRanges(prev => [...prev, currentPriceRange]);
        setCurrentPriceRange({
            from_hour: "",
            to_hour: "",
            price: "",
            appliedDays: [],
        });
    }, [currentPriceRange]);

    const removePriceRange = useCallback((index: number) => {
        setPriceRanges(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(e.target.files?.[0] || null);
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            setError(null);
            
            if (!fieldName || !category || !selectedOptions.length || !imageFile) {
                setError("Vui lòng điền đầy đủ thông tin cơ bản: tên sân, danh mục, loại sân và hình ảnh.");
                return;
            }

            if (!address.provinceCode || !address.districtCode || !address.wardCode || !address.houseNumber || !address.street) {
                setError("Vui lòng điền đầy đủ thông tin địa chỉ.");
                return;
            }

            if (schedules.length !== 7) {
                setError("Vui lòng cung cấp lịch cho tất cả các ngày trong tuần.");
                return;
            }

            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            for (const schedule of schedules) {
                if (!schedule.isClosed) {
                    if (!schedule.open_time || !schedule.close_time) {
                        setError(`Vui lòng điền đầy đủ giờ mở/đóng cửa cho ngày ${schedule.day_of_week}, hoặc đánh dấu là ngày nghỉ.`);
                        return;
                    }
                    if (!timeRegex.test(schedule.open_time) || !timeRegex.test(schedule.close_time)) {
                        setError(`Định dạng giờ không hợp lệ cho ngày ${schedule.day_of_week}. Vui lòng sử dụng định dạng HH:mm.`);
                        return;
                    }
                    const openTime = new Date(`1970-01-01T${schedule.open_time}`);
                    const closeTime = new Date(`1970-01-01T${schedule.close_time}`);
                    if (openTime >= closeTime) {
                        setError(`Giờ mở cửa phải sớm hơn giờ đóng cửa cho ngày ${schedule.day_of_week}.`);
                        return;
                    }
                }
            }

            const openDays = schedules.filter(s => !s.isClosed).map(s => s.day_of_week);
            for (const day of openDays) {
                const dayPriceRanges = priceRanges.filter(range => range.appliedDays.includes(day));
                if (dayPriceRanges.length === 0) {
                    setError(`Vui lòng thêm ít nhất một khung giá cho ngày ${day}.`);
                    return;
                }

                for (let i = 0; i < dayPriceRanges.length; i++) {
                    for (let j = i + 1; j < dayPriceRanges.length; j++) {
                        const range1Start = new Date(`1970-01-01T${dayPriceRanges[i].from_hour}`);
                        const range1End = new Date(`1970-01-01T${dayPriceRanges[i].to_hour}`);
                        const range2Start = new Date(`1970-01-01T${dayPriceRanges[j].from_hour}`);
                        const range2End = new Date(`1970-01-01T${dayPriceRanges[j].to_hour}`);

                        if (range1Start < range2End && range2Start < range1End) {
                            setError(`Phát hiện khung giờ chồng chéo trong ngày ${day}.`);
                            return;
                        }
                    }
                }
            }

            // Chuyển đổi priceRanges thành day_price_ranges
            const dayPriceRanges: { day_of_week: string, priceRanges: { from_hour: string, to_hour: string, price: string }[] }[] = [];
            const backendDays = daysOfWeek.map(day => day.backend);
            backendDays.forEach(day => {
                const rangesForDay = priceRanges
                    .filter(range => range.appliedDays.includes(day))
                    .map(range => ({
                        from_hour: range.from_hour,
                        to_hour: range.to_hour,
                        price: range.price
                    }));
                dayPriceRanges.push({
                    day_of_week: day,
                    priceRanges: rangesForDay
                });
            });

            const formData = new FormData();
            formData.append("field_name", fieldName);
            formData.append("category_id", category);
            formData.append("description", description);
            formData.append("option_ids", JSON.stringify(selectedOptions));
            formData.append("half_hour", String(halfHour));
            formData.append("address", JSON.stringify(address));
            formData.append("schedules", JSON.stringify(schedules));
            formData.append("day_price_ranges", JSON.stringify(dayPriceRanges));
            formData.append("image", imageFile);
            if (user?.user_id) {
                formData.append("user_id", user.user_id);
            }

            const response = await axios.post(
                "http://localhost:5000/api/admin/fields/create",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.status === 201) {
                toast.success("Đăng ký thành công!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    toastId: "register-success"
                });

                // Chuyển hướng sau 2 giây
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        } catch (err) {
            const error = err as AxiosError<{ errors?: string[] }>;
            console.error("Error submitting form:", error.response?.data || error.message);
            if (error.response?.data?.errors) {
                setError(error.response.data.errors.join("; "));
            } else {
                setError("Đăng ký thất bại. Vui lòng thử lại.");
            }
            toast.error("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                toastId: "register-error"
            });
        }
    }, [fieldName, category, selectedOptions, imageFile, address, schedules, daysOfWeek, description, halfHour, user?.user_id, priceRanges, router]);

    // Effects
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/category/get");
                setCategories(response.data);
            } catch (err) {
                const error = err as AxiosError<{ error?: string }>;
                console.error("Lỗi khi lấy danh mục:", error.response?.data || error.message);
                setError(error.response?.data?.error || "Lấy danh mục thất bại. Vui lòng thử lại.");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (category) {
            const fetchOptions = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/admin/optionfields/getByCategory/${category}`);
                    console.log("Fetched options:", response.data);
                    const optionIds = response.data.map((opt: { option_field_id: string }) => opt.option_field_id);
                    const uniqueOptionIds = new Set(optionIds);
                    if (optionIds.length !== uniqueOptionIds.size) {
                        console.warn("Duplicate option_field_id found:", optionIds);
                    }
                    const filteredOptions = response.data.filter((opt: { option_field_id: string }) => opt.option_field_id);
                    setOptions(filteredOptions);
                } catch (error) {
                    console.error('Error fetching options:', error);
                    toast.error('Không thể tải danh sách loại sân', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        toastId: "fetch-options-error"
                    });
                }
            };
            fetchOptions();
        }
    }, [category]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/p/");
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", (error as AxiosError).message);
                setError("Không thể tải danh sách tỉnh/thành phố.");
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (!address.provinceCode) return;

        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${address.provinceCode}?depth=2`);
                setDistricts(response.data.districts || []);
                setWards([]);
                setAddress(prev => ({ ...prev, districtCode: "", wardCode: "" }));
            } catch (error) {
                console.error("Error fetching districts:", (error as AxiosError).message);
                setError("Không thể tải danh sách quận/huyện.");
            }
        };
        fetchDistricts();
    }, [address.provinceCode]);

    useEffect(() => {
        if (!address.districtCode) return;

        const fetchWards = async () => {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${address.districtCode}?depth=2`);
                setWards(response.data.wards || []);
                setAddress(prev => ({ ...prev, wardCode: "" }));
            } catch (error) {
                console.error("Error fetching wards:", (error as AxiosError).message);
                setError("Không thể tải danh sách phường/xã.");
            }
        };
        fetchWards();
    }, [address.districtCode]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng Ký Chủ Sân</h2>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên Sân
                                </label>
                                <Input
                                    value={fieldName}
                                    onChange={handleFieldNameChange}
                                    placeholder="Nhập tên sân"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh Mục
                                </label>
                                <Select value={category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.category_id} value={cat.category_id}>
                                                {cat.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {category && options.length > 0 && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại Sân
                                    </label>
                                    <div className="space-y-2">
                                        {options.map((option) => {
                                            if (!option.option_field_id) {
                                                console.warn("Invalid option (missing option_field_id):", option);
                                                return null;
                                            }
                                            return (
                                                <div key={option.option_field_id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={option.option_field_id}
                                                        checked={selectedOptions.includes(option.option_field_id)}
                                                        onCheckedChange={(checked) => handleOptionChange(option.option_field_id, checked as boolean)}
                                                    />
                                                    <label
                                                        htmlFor={option.option_field_id}
                                                        className="text-sm text-gray-700 cursor-pointer"
                                                    >
                                                        {option.option_name || "Không có tên"}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 mt-4">
                                <Switch
                                    checked={halfHour}
                                    onCheckedChange={(checked) => setHalfHour(checked)}
                                />
                                <span className="text-sm text-gray-700">
                                    Được phép đặt 30 phút
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô Tả
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Nhập mô tả về sân"
                                    className="w-full h-[104px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Địa Chỉ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tỉnh/Thành Phố
                                </label>
                                <Select
                                    value={address.provinceCode}
                                    onValueChange={(value) => handleAddressChange("provinceCode", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.code} value={province.code.toString()}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quận/Huyện
                                </label>
                                <Select
                                    value={address.districtCode}
                                    onValueChange={(value) => handleAddressChange("districtCode", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn quận/huyện" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district.code} value={district.code.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phường/Xã
                                </label>
                                <Select
                                    value={address.wardCode}
                                    onValueChange={(value) => handleAddressChange("wardCode", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phường/xã" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map((ward) => (
                                            <SelectItem key={ward.code} value={ward.code.toString()}>
                                                {ward.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số Nhà
                                </label>
                                <Input
                                    value={address.houseNumber}
                                    onChange={(e) => handleAddressChange("houseNumber", e.target.value)}
                                    placeholder="Nhập số nhà"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên Đường
                                </label>
                                <Input
                                    value={address.street}
                                    onChange={(e) => handleAddressChange("street", e.target.value)}
                                    placeholder="Nhập tên đường"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Địa Chỉ Đầy Đủ
                            </label>
                            <Input
                                value={address.location}
                                readOnly
                                placeholder="Địa chỉ sẽ tự động điền sau khi chọn các thông tin trên"
                                className="w-full bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Lịch hoạt động */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch Hoạt Động</h3>
                        <div className="space-y-4">
                            {schedules.map((schedule, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày
                                        </label>
                                        <div className="text-gray-900 font-medium">
                                            {daysOfWeek.find(day => day.backend === schedule.day_of_week)?.display}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giờ Mở Cửa
                                        </label>
                                        <Input
                                            type="time"
                                            value={schedule.open_time}
                                            onChange={(e) => handleScheduleChange(index, "open_time", e.target.value)}
                                            disabled={schedule.isClosed}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giờ Đóng Cửa
                                        </label>
                                        <Input
                                            type="time"
                                            value={schedule.close_time}
                                            onChange={(e) => handleScheduleChange(index, "close_time", e.target.value)}
                                            disabled={schedule.isClosed}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={schedule.isClosed}
                                                onCheckedChange={(checked) => handleScheduleChange(index, "isClosed", checked)}
                                            />
                                            <span className="text-sm text-gray-600">Ngày nghỉ</span>
                                        </div>

                                        {!schedule.isClosed && (
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={applyToRemainingDays[index]}
                                                        onCheckedChange={(checked) => handleApplyToRemainingDaysChange(index, checked as boolean)}
                                                        disabled={schedules.length === 7}
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        Áp dụng cho các ngày còn lại
                                                    </span>
                                                </div>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeScheduleDay(index)}
                                                    className="px-2 py-1"
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bảng giá */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảng Giá</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Từ Giờ
                                    </label>
                                    <Input
                                        type="time"
                                        value={currentPriceRange.from_hour}
                                        onChange={(e) => handleCurrentPriceRangeChange("from_hour", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Đến Giờ
                                    </label>
                                    <Input
                                        type="time"
                                        value={currentPriceRange.to_hour}
                                        onChange={(e) => handleCurrentPriceRangeChange("to_hour", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giá (VNĐ)
                                    </label>
                                    <Input
                                        type="number"
                                        value={currentPriceRange.price}
                                        onChange={(e) => handleCurrentPriceRangeChange("price", e.target.value)}
                                        placeholder="Nhập giá"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-md font-medium text-gray-700">Chọn ngày áp dụng</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {daysOfWeek.map((day) => {
                                        const isClosed = schedules.find(
                                            (schedule) => schedule.day_of_week === day.backend
                                        )?.isClosed;
                                        if (isClosed) return null;
                                        return (
                                            <div key={day.backend} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`apply-day-${day.backend}`}
                                                    checked={currentPriceRange.appliedDays.includes(day.backend)}
                                                    onCheckedChange={(checked) => handleDaySelection(day.backend, checked as boolean)}
                                                />
                                                <label
                                                    htmlFor={`apply-day-${day.backend}`}
                                                    className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                    {day.display}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <Button onClick={addPriceRange} className="w-full md:w-auto bg-blue-600 text-white">
                                Thêm Khung Giá
                            </Button>

                            {priceRanges.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Từ Giờ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Đến Giờ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Giá
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ngày Áp Dụng
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thao Tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {priceRanges.map((range, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {range.from_hour}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {range.to_hour}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Intl.NumberFormat('vi-VN').format(Number(range.price))} VNĐ
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {range.appliedDays.map(day => daysOfWeek.find(d => d.backend === day)?.display).join(", ")}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removePriceRange(index)}
                                                            className="px-2 py-1"
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình Ảnh</h3>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                    </div>

                    {/* Error and Submit */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-green-600">{successMessage}</p>
                        </div>
                    )}

                    <Button onClick={handleSubmit} className="w-full md:w-auto bg-blue-600 text-white">
                        Đăng Ký
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterField;