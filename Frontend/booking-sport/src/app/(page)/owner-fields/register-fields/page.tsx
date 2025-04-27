"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/app/hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Option {
    option_field_id: string;
    option_name: string;
    CategoryID: string;
}

interface Category {
    category_id: string;
    category_name: string;
    optionFields: Option[];
}

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

const RegisterField = () => {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, loading, isLoggedIn } = useAuth();
    const [form, setForm] = useState({
        category: "",
        options: [] as string[],
        field_name: "",
        location: "",
        description: "",
        half_hour: false,
    });
    const [schedules, setSchedules] = useState<Schedule[]>([
        { day_of_week: "Mon", open_time: "06:00", close_time: "22:00", isClosed: false },
    ]);
    const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
    const [currentPriceRange, setCurrentPriceRange] = useState<PriceRange>({
        from_hour: "",
        to_hour: "",
        price: "",
        appliedDays: [],
    });
    const [applyToRemainingDays, setApplyToRemainingDays] = useState<boolean[]>([true]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [openDays, setOpenDays] = useState<string[]>([]); // State để lưu danh sách các ngày không phải ngày nghỉ

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Cập nhật openDays mỗi khi schedules thay đổi
    useEffect(() => {
        const openDaysList = schedules
            .filter((schedule) => !schedule.isClosed)
            .map((schedule) => schedule.day_of_week);
        setOpenDays(openDaysList);
    }, [schedules]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/category/get");
            setCategories(response.data);
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            console.error("Lỗi khi lấy danh mục:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Lấy danh mục thất bại. Vui lòng thử lại.");
        }
    };

    const fetchOptions = async (categoryId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/category/getById/${categoryId}`);
            setOptions(response.data.optionFields || []);
            console.log("Fetched options:", response.data.optionFields);
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            console.error("Lỗi khi lấy options:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Lấy options thất bại. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleCategoryChange = (value: string) => {
        setForm({ ...form, category: value, options: [] });
        fetchOptions(value);
    };

    const handleOptionChange = (optionId: string, checked: boolean) => {
        setForm((prev) => {
            const newOptions = checked
                ? [...prev.options, optionId]
                : prev.options.filter((id) => id !== optionId);
            return { ...prev, options: newOptions };
        });
    };

    const handleScheduleChange = (index: number, field: keyof Schedule, value: Schedule[keyof Schedule]) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
        setSchedules(updatedSchedules);

        if (applyToRemainingDays[index]) {
            const { open_time, close_time, isClosed } = updatedSchedules[index];
            const currentDays = updatedSchedules.map((s) => s.day_of_week);
            const remainingDays = daysOfWeek.filter((day) => !currentDays.includes(day));
            const newSchedules = [
                ...updatedSchedules,
                ...remainingDays.map((day) => ({
                    day_of_week: day,
                    open_time,
                    close_time,
                    isClosed,
                })),
            ];
            setSchedules(newSchedules);
            setApplyToRemainingDays([...applyToRemainingDays.slice(0, index + 1), ...remainingDays.map(() => false)]);
        }
    };

    const handleApplyToRemainingDaysChange = (index: number, checked: boolean) => {
        const updatedApplyToRemainingDays = [...applyToRemainingDays];
        updatedApplyToRemainingDays[index] = checked;
        setApplyToRemainingDays(updatedApplyToRemainingDays);

        if (checked) {
            const { open_time, close_time, isClosed } = schedules[index];
            const currentDays = schedules.map((s) => s.day_of_week);
            const remainingDays = daysOfWeek.filter((day) => !currentDays.includes(day));
            const newSchedules = [
                ...schedules,
                ...remainingDays.map((day) => ({
                    day_of_week: day,
                    open_time,
                    close_time,
                    isClosed,
                })),
            ];
            setSchedules(newSchedules);
            setApplyToRemainingDays([...updatedApplyToRemainingDays, ...remainingDays.map(() => false)]);
        } else if (index === 0) {
            const currentDays = schedules.map((s) => s.day_of_week);
            const missingDays = daysOfWeek.filter((day) => !currentDays.includes(day));
            const newSchedules = [
                ...schedules,
                ...missingDays.map((day) => ({
                    day_of_week: day,
                    open_time: "06:00",
                    close_time: "22:00",
                    isClosed: false,
                })),
            ];
            setSchedules(newSchedules);
            setApplyToRemainingDays([...updatedApplyToRemainingDays, ...missingDays.map(() => false)]);
        }
    };

    const addScheduleDay = () => {
        const currentDays = schedules.map((s) => s.day_of_week);
        const nextDay = daysOfWeek.find((day) => !currentDays.includes(day));
        if (nextDay) {
            setSchedules([...schedules, { day_of_week: nextDay, open_time: "06:00", close_time: "22:00", isClosed: false }]);
            setApplyToRemainingDays([...applyToRemainingDays, false]);
        }
    };

    const handleCurrentPriceRangeChange = (field: keyof PriceRange, value: string) => {
        setCurrentPriceRange((prev) => ({
            ...prev,
            [field]: value,
        }));

        const updatedErrors = { ...fieldErrors };
        if (!value) {
            updatedErrors[field] = "Trường này không được để trống.";
        } else {
            delete updatedErrors[field];
            if (!currentPriceRange.from_hour) updatedErrors["from_hour"] = "Trường này không được để trống.";
            if (!currentPriceRange.to_hour) updatedErrors["to_hour"] = "Trường này không được để trống.";
            if (!currentPriceRange.price) updatedErrors["price"] = "Trường này không được để trống.";
        }
        setFieldErrors(updatedErrors);
    };

    const handleDaySelection = (day: string, checked: boolean) => {
        setCurrentPriceRange((prev) => ({
            ...prev,
            appliedDays: checked
                ? [...prev.appliedDays, day]
                : prev.appliedDays.filter((d) => d !== day),
        }));
    };

    const addPriceRange = () => {
        if (!currentPriceRange.from_hour || !currentPriceRange.to_hour || !currentPriceRange.price) {
            setError("Vui lòng điền đầy đủ thông tin khung giờ trước khi thêm.");
            return;
        }

        // Kiểm tra chỉ yêu cầu chọn ít nhất một ngày trong số các ngày không phải ngày nghỉ
        const selectedOpenDays = currentPriceRange.appliedDays.filter((day) => openDays.includes(day));
        if (selectedOpenDays.length === 0 && openDays.length > 0) {
            setError("Vui lòng chọn ít nhất một ngày áp dụng (không bao gồm ngày nghỉ).");
            return;
        }

        const from = new Date(`1970-01-01T${currentPriceRange.from_hour}:00`);
        const to = new Date(`1970-01-01T${currentPriceRange.to_hour}:00`);
        if (from >= to) {
            setError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
            return;
        }

        for (const range of priceRanges) {
            const rangeFrom = new Date(`1970-01-01T${range.from_hour}:00`);
            const rangeTo = new Date(`1970-01-01T${range.to_hour}:00`);
            if (
                (from <= rangeTo && to >= rangeFrom) ||
                (rangeFrom <= to && rangeTo >= from)
            ) {
                const commonDays = currentPriceRange.appliedDays.filter((day) =>
                    range.appliedDays.includes(day)
                );
                if (commonDays.length > 0) {
                    toast.error("Khung giờ và ngày bạn chọn đã bị trùng, vui lòng chọn lại.", {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    setError(`Khung giờ này trùng với khung giờ ${range.from_hour} - ${range.to_hour} ở các ngày: ${commonDays.join(", ")}.`);
                    return;
                }
            }
        }

        setPriceRanges([...priceRanges, currentPriceRange]);
        setCurrentPriceRange({ from_hour: "", to_hour: "", price: "", appliedDays: [] });
        setFieldErrors({});
        setError(null);
    };

    const removePriceRange = (index: number) => {
        setPriceRanges(priceRanges.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccessMessage(null);
        if (
            !form.field_name ||
            !form.location ||
            !form.category ||
            !form.options.length ||
            !imageFile
        ) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc, bao gồm danh mục, ít nhất một loại sân và hình ảnh sân.");
            return;
        }

        const currentDays = schedules.map((s) => s.day_of_week);
        if (currentDays.length !== 7) {
            setError("Vui lòng điền giờ mở/đóng cửa cho tất cả 7 ngày trong tuần.");
            return;
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        for (const schedule of schedules) {
            if (!daysOfWeek.includes(schedule.day_of_week)) {
                setError(`Ngày không hợp lệ: ${schedule.day_of_week}`);
                return;
            }
            if (!schedule.isClosed) {
                if (!schedule.open_time || !schedule.close_time) {
                    setError(`Vui lòng điền đầy đủ giờ mở/đóng cửa cho ngày ${schedule.day_of_week}, hoặc đánh dấu ngày đó là ngày nghỉ.`);
                    return;
                }
                if (!timeRegex.test(schedule.open_time) || !timeRegex.test(schedule.close_time)) {
                    setError(`Định dạng giờ mở/đóng không hợp lệ (HH:mm) cho ngày ${schedule.day_of_week}`);
                    return;
                }
                const from = new Date(`1970-01-01T${schedule.open_time}:00`);
                const to = new Date(`1970-01-01T${schedule.close_time}:00`);
                if (from >= to) {
                    setError(`Giờ mở cửa phải nhỏ hơn giờ đóng cửa cho ngày ${schedule.day_of_week}.`);
                    return;
                }
            }
        }

        const finalSchedules = schedules.map((schedule) => ({
            day_of_week: schedule.day_of_week,
            open_time: schedule.isClosed ? null : schedule.open_time,
            close_time: schedule.isClosed ? null : schedule.close_time,
            isClosed: schedule.isClosed,
        }));

        const dayPriceRanges = daysOfWeek.map((day) => ({
            day_of_week: day,
            priceRanges: priceRanges
                .filter((range) => range.appliedDays.includes(day))
                .map(({ from_hour, to_hour, price }) => ({
                    from_hour,
                    to_hour,
                    price,
                    appliedDays: [],
                })),
        }));

        for (const dayPriceRange of dayPriceRanges) {
            const isDayClosed = schedules.find((schedule) => schedule.day_of_week === dayPriceRange.day_of_week)?.isClosed;
            if (!isDayClosed && dayPriceRange.priceRanges.length === 0) {
                setError(`Vui lòng thêm ít nhất một khung giờ cho ngày ${dayPriceRange.day_of_week} (không phải ngày nghỉ).`);
                return;
            }
        }

        try {
            if (!user?.user_id) {
                setError("Vui lòng đăng nhập trước khi đăng ký chủ sân.");
                router.push("/login");
                return;
            }

            const formData = new FormData();
            formData.append("user_id", user.user_id);
            formData.append("category_id", form.category);
            formData.append("option_ids", JSON.stringify(form.options));
            formData.append("field", JSON.stringify({
                field_name: form.field_name,
                location: form.location,
                description: form.description,
                half_hour: form.half_hour,
            }));
            formData.append("schedules", JSON.stringify(finalSchedules));
            formData.append("day_price_ranges", JSON.stringify(dayPriceRanges));
            if (imageFile) {
                formData.append("image", imageFile);
            }

            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await axios.post(
                "http://localhost:5000/api/admin/fields/create",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log("Response from backend:", response.data);
            if (response.status === 201) {
                toast.success("Đăng ký chủ sân thành công! Vui lòng chờ admin phê duyệt.", {
                    onClose: () => router.push("/"),
                });
            }
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            console.error("Error from backend:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-gray-50 px-4 pt-10"
            suppressHydrationWarning
        >
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="bg-amber-50 rounded-xl shadow-lg p-8 w-full max-w-screen-xl mx-auto border-black">
                <h1 className="text-2xl font-bold mb-6 text-center">Đăng Ký Chủ Sân</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin sân</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        id="field_name"
                                        value={form.field_name}
                                        onChange={(e) => setForm({ ...form, field_name: e.target.value })}
                                        className="peer w-full px-4 py-2 border rounded-md h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="field_name"
                                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200 
                                            ${form.field_name ? "top-0 text-sm text-blue-600 translate-y-0" : "peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:translate-y-0"}`}
                                    >
                                        Tên sân
                                    </label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="location"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        className="peer w-full px-4 py-2 border rounded-md h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="location"
                                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200 
                                            ${form.location ? "top-0 text-sm text-blue-600 translate-y-0" : "peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:translate-y-0"}`}
                                    >
                                        Địa điểm
                                    </label>
                                </div>
                                <Textarea
                                    placeholder="Mô tả sân"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="h-[100px]"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh mục và tùy chọn</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-3">
                                    <Select
                                        onValueChange={handleCategoryChange}
                                        value={form.category}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.category_id} value={category.category_id}>
                                                    {category.category_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-700 font-medium">Chọn loại sân:</label>
                                        {options.length > 0 ? (
                                            options.map((option) => (
                                                <div key={option.option_field_id} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={option.option_field_id}
                                                        checked={form.options.includes(option.option_field_id)}
                                                        onCheckedChange={(checked) =>
                                                            handleOptionChange(option.option_field_id, checked as boolean)
                                                        }
                                                        disabled={!form.category}
                                                    />
                                                    <label
                                                        htmlFor={option.option_field_id}
                                                        className="text-gray-700 cursor-pointer"
                                                    >
                                                        {option.option_name}
                                                    </label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">
                                                {form.category
                                                    ? "Không có loại sân nào cho danh mục này"
                                                    : "Vui lòng chọn danh mục trước"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-700 font-medium">Hình ảnh sân:</label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    {imageFile && (
                                        <p className="text-gray-500">Đã chọn: {imageFile.name}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-700 font-medium">Tính giá theo 30 phút:</label>
                                    <Switch
                                        checked={form.half_hour}
                                        onCheckedChange={(checked) => setForm({ ...form, half_hour: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Giờ mở/đóng cửa */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Giờ mở/đóng cửa</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-4 py-2 text-left">Ngày</th>
                                        <th className="border px-4 py-2 text-left">Ngày nghỉ</th>
                                        <th className="border px-4 py-2 text-left">Giờ mở cửa</th>
                                        <th className="border px-4 py-2 text-left">Giờ đóng cửa</th>
                                        <th className="border px-4 py-2 text-left">Áp dụng cho các ngày còn lại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map((schedule, index) => (
                                        <tr key={schedule.day_of_week} className="border-b">
                                            <td className="border px-4 py-2">{schedule.day_of_week}</td>
                                            <td className="border px-4 py-2">
                                                <Checkbox
                                                    id={`is-closed-${index}`}
                                                    checked={schedule.isClosed}
                                                    onCheckedChange={(checked) =>
                                                        handleScheduleChange(index, "isClosed", checked as boolean)
                                                    }
                                                />
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="relative">
                                                    <Input
                                                        type="time"
                                                        value={schedule.open_time}
                                                        onChange={(e) =>
                                                            handleScheduleChange(index, "open_time", e.target.value)
                                                        }
                                                        className="w-full px-4 py-2 border rounded-md h-[40px]"
                                                        disabled={schedule.isClosed}
                                                    />
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="relative">
                                                    <Input
                                                        type="time"
                                                        value={schedule.close_time}
                                                        onChange={(e) =>
                                                            handleScheduleChange(index, "close_time", e.target.value)
                                                        }
                                                        className="w-full px-4 py-2 border rounded-md h-[40px]"
                                                        disabled={schedule.isClosed}
                                                    />
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`apply-remaining-days-${index}`}
                                                        checked={applyToRemainingDays[index]}
                                                        onCheckedChange={(checked) =>
                                                            handleApplyToRemainingDaysChange(index, checked as boolean)
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`apply-remaining-days-${index}`}
                                                        className="text-gray-700"
                                                    >
                                                        Áp dụng
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {schedules.length < 7 && (
                            <Button
                                onClick={addScheduleDay}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Thêm ngày khác
                            </Button>
                        )}
                    </div>

                    {/* Giá theo khung giờ */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Giá theo khung giờ (VND)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-md font-medium text-gray-600">Thêm khung giờ mới</h4>
                                <div className="flex items-start gap-4">
                                    <div className="w-1/3 relative">
                                        <Input
                                            type="time"
                                            value={currentPriceRange.from_hour}
                                            onChange={(e) =>
                                                handleCurrentPriceRangeChange("from_hour", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border rounded-md h-[40px]"
                                        />
                                        <label className="absolute left-4 top-0 text-sm text-blue-600">
                                            Từ
                                        </label>
                                        {fieldErrors["from_hour"] && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors["from_hour"]}</p>
                                        )}
                                    </div>
                                    <div className="w-1/3 relative">
                                        <Input
                                            type="time"
                                            value={currentPriceRange.to_hour}
                                            onChange={(e) =>
                                                handleCurrentPriceRangeChange("to_hour", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border rounded-md h-[40px]"
                                        />
                                        <label className="absolute left-4 top-0 text-sm text-blue-600">
                                            Đến
                                        </label>
                                        {fieldErrors["to_hour"] && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors["to_hour"]}</p>
                                        )}
                                    </div>
                                    <div className="w-1/3 relative">
                                        <Input
                                            type="number"
                                            value={currentPriceRange.price}
                                            onChange={(e) =>
                                                handleCurrentPriceRangeChange("price", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border rounded-md h-[40px]"
                                        />
                                        <label className="absolute left-4 top-0 text-sm text-blue-600">
                                            Giá (VND)
                                        </label>
                                        {fieldErrors["price"] && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors["price"]}</p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={addPriceRange}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Thêm khung giờ
                                </Button>
                                {priceRanges.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-md font-medium text-gray-600 mb-2">Danh sách khung giờ</h4>
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="border px-4 py-2 text-left">Từ</th>
                                                    <th className="border px-4 py-2 text-left">Đến</th>
                                                    <th className="border px-4 py-2 text-left">Giá (VND)</th>
                                                    <th className="border px-4 py-2 text-left">Ngày áp dụng</th>
                                                    <th className="border px-4 py-2 text-left">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {priceRanges.map((range, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="border px-4 py-2">{range.from_hour}</td>
                                                        <td className="border px-4 py-2">{range.to_hour}</td>
                                                        <td className="border px-4 py-2">{range.price}</td>
                                                        <td className="border px-4 py-2">{range.appliedDays.join(", ")}</td>
                                                        <td className="border px-4 py-2">
                                                            <Button
                                                                onClick={() => removePriceRange(index)}
                                                                className="bg-red-500 text-white px-2 py-1 rounded-md"
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
                            <div className="space-y-4">
                                <h4 className="text-md font-medium text-gray-600">Chọn ngày áp dụng</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {daysOfWeek.map((day) => {
                                        const isClosed = schedules.find((schedule) => schedule.day_of_week === day)?.isClosed;
                                        if (isClosed) return null; // Ẩn ngày nghỉ
                                        return (
                                            <div key={day} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`apply-day-${day}`}
                                                    checked={currentPriceRange.appliedDays.includes(day)}
                                                    onCheckedChange={(checked) =>
                                                        handleDaySelection(day, checked as boolean)
                                                    }
                                                />
                                                <label
                                                    htmlFor={`apply-day-${day}`}
                                                    className="text-gray-700 cursor-pointer"
                                                >
                                                    {day}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full mt-6 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Đăng Ký Chủ Sân
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterField;