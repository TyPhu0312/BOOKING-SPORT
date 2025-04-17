"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import axios from "axios";
import { Switch } from "../ui/switch"
const fieldOptions = [
  { id: "option-uuid-00000000000000000000001", label: "Sân 5" },
  { id: "option-uuid-00000000000000000000002", label: "Sân 7" },
  // Thêm các tùy chọn khác nếu cần
];

export const FormSchema = z.object({
  fieldName: z.string().min(2, {
    message: "Tên sân phải có ít nhất 2 ký tự.",
  }),
  fieldType: z.string({
    required_error: "Vui lòng chọn loại sân.",
  }),

  cityCode: z.string({
    required_error: "Vui lòng chọn tỉnh/thành phố"
  }).min(1, "Vui lòng chọn tỉnh/thành phố"),

  fieldOptions: z.array(z.string(), {
    required_error: "Vui lòng chọn ít nhất một tuỳ chọn"
  }).min(1, "Vui lòng chọn ít nhất một tuỳ chọn"),

  districtCode: z.string({
    required_error: "Vui lòng chọn quận/huyện"
  }).min(1, "Vui lòng chọn quận/huyện"),

  wardCode: z.string({
    required_error: "Vui lòng chọn phường/xã"
  }).min(1, "Vui lòng chọn phường/xã"),

  description: z
    .string()
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự." })
    .max(500, { message: "Mô tả không vượt quá 500 ký tự." }),
  halfHour: z.string().optional(), // Thêm trường này vào
});


type Ward = {
  code: string;
  name: string;
};

type District = {
  code: string;
  name: string;
  wards: Ward[];
};

type City = {
  code: string;
  name: string;
  districts: District[];
};

export default function FormDemo() {

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fieldName: "",
      categoryID: "",
      description: "",
      halfHour: false,
      cityCode: "",
      districtCode: "",
      wardCode: "",
      street: "",
    },
  });
  const [allCities, setAllCities] = useState<City[]>([]);
  const cityCode = form.watch("cityCode");
  const districtCode = form.watch("districtCode");
  const [street, setStreet] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [ward, setWard] = useState<Ward[]>([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState<District[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/category/get")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        toast.error("Lỗi tải danh sách loại sân!");
      });
    axios.get("https://provinces.open-api.vn/api/?depth=3")
      .then(res => {
        setAllCities(res.data);
      })
      .catch(err => {
        toast.error("Lỗi tải dữ liệu tỉnh/thành phố!");
      });
  }, []);


  function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = {
      name: data.fieldName,
      category: data.fieldType,
      option: data.fieldOptions,
      description: data.description,
      half_hour: data.halfHour === "mentions", // boolean nếu backend là vậy
      address: {
        cityCode: data.cityCode,
        districtCode: data.districtCode,
        wardCode: data.wardCode,
        street: street
      }
    };

    axios.post('localhost:5000/api/admin/fields/create', payload)
      .then(response => {
        toast.success('Tạo sân thành công!');
      })
      .catch(error => {
        console.error(error);
        toast.error('Lỗi tạo sân!');
      });
  }

  const handleCityChange = (cityCode: string) => {
    form.setValue('cityCode', cityCode);
    const selected = allCities.find(c => String(c.code) === cityCode);
    if (selected) {
      setSelectedCity(selected);
      setDistricts(selected.districts || []);
    } else {
      setSelectedCity(null);
      setDistricts([]);
    }
    form.setValue('districtCode', '');
    form.setValue('wardCode', '');
  };

  const handleDistrictChange = (districtCode: string) => {
    form.setValue('districtCode', districtCode);
    console.log(districtCode);
    const selectedDistrict = selectedCity?.districts.find(d => d.code == districtCode);
    if (!selectedDistrict) {
      console.log('Không tìm thấy quận:');
    }
    const selectedWards = selectedDistrict?.wards || [];
    setWard(selectedWards);
    form.setValue('wardCode', '');
  };

  const handleWardChange = (wardCode: string) => {
    form.setValue('wardCode', wardCode);
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full max-w-screen  gap-6 md:grid-cols-3 custom-form"
      >
        <div className="col-span-3 grid gap-3 md:grid-cols-3 items-start">
          {/* Tên sân */}
          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sân</FormLabel>
                <FormControl>
                  <Input placeholder="Sân thể thao" {...field} />
                </FormControl>
                <FormDescription className="ml-2">
                  Đây sẽ là tên thương hiệu sân của bạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Loại sân */}
          <FormField
            control={form.control}
            name="fieldType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại sân</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border border-black focus:ring-0 focus:border-black">
                      <SelectValue placeholder="Chọn loại sân" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sancaulong">Sân cầu lông</SelectItem>
                    <SelectItem value="Sân bóng rổ">Sân bóng rổ</SelectItem>
                    <SelectItem value="Sân bóng đá">Sân bóng đá</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Chọn loại sân của bạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tuỳ chọn */}
          <FormField
            control={form.control}
            name="fieldType"
            render={() => (
              <FormItem>
                <div className="flex gap-1 items-center">
                  <FormLabel className="text-base">Thông tin tuỳ chọn của sân</FormLabel>
                  <FormDescription>(Nếu có)</FormDescription>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {fieldOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="fieldType"
                      render={({ field }) => (
                        <FormItem key={option.id} className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              className="border-black rounded-lg"
                              checked={Array.isArray(field.value) && field.value.includes(option.id)}
                              onCheckedChange={(checked) => {
                                const valueArray = Array.isArray(field.value) ? field.value : []
                                return checked
                                  ? field.onChange([...valueArray, option.id])
                                  : field.onChange(valueArray.filter((val) => val !== option.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-3 grid gap-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="pl-1">Mô tả và giới thiệu sân</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="halfHour"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3">
                <FormLabel>Cách tính giờ</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={field.value === "mentions"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "mentions" : "all")
                      }
                      className="border border-black data-[state=checked]:bg-black"
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value === "mentions"
                        ? "Tính nửa giờ"
                        : "Không tính nửa giờ"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

            )}
          />
          <FormItem>
            <FormLabel>Địa chỉ sân</FormLabel>

            <div className="flex gap-3 flex-col md:flex-row">
              {/* Thành phố */}
              <Select onValueChange={handleCityChange} value={cityCode}>
                <SelectTrigger className="border border-black focus:ring-0 focus:border-black">
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {allCities.map((city) => (
                    <SelectItem key={city.code} value={city.code.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quận/Huyện */}
              <Select onValueChange={handleDistrictChange} value={districtCode} disabled={!districts.length}>
                <SelectTrigger className="border border-black focus:ring-0 focus:border-black">
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

              {/* Phường/Xã */}
              <Select
                onValueChange={handleWardChange}
                value={form.watch('wardCode')}
                disabled={!ward.length}
              >
                <SelectTrigger className="border border-black focus:ring-0 focus:border-black">
                  <SelectValue placeholder="Chọn phường/xã">
                    {ward.find((w) => w.code == form.watch('wardCode'))?.name || ''}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ward.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Số nhà */}
              <Input placeholder="Số nhà, tên đường..." value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
          </FormItem>
        </div>
        <div className="col-span-3 flex justify-center ">
          <Button type="submit" className="cursor-pointer">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
