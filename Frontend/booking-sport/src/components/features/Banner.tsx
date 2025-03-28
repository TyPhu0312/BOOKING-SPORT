// Banner.tsx
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

type BannerProps = {
  images: string[];
};

const Banner = ({ images }: BannerProps) => {
  return (
    <div className="relative w-full h-64 md:h-full">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index} className="w-full">
              <Image
                width={1920}
                height={1080}
                src={src}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Banner;
