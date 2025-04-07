// src/components/Rating.tsx
import React, { useState } from 'react';

interface RatingProps {
  initialRating: number; // Điểm đánh giá ban đầu
  totalStars?: number; // Số lượng sao (mặc định là 5)
}

const Rating: React.FC<RatingProps> = ({ initialRating, totalStars = 5 }) => {
  const [rating, setRating] = useState<number>(initialRating); // Cập nhật điểm đánh giá

  // Hàm xử lý khi click vào sao
  const handleStarClick = (index: number) => {
    setRating(index + 1); // Cập nhật trạng thái rating
  };

  // Xử lý sự kiện hover để chỉ thay đổi màu khi hover
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    setHoveredRating(index + 1); // Khi hover vào sao, cập nhật hoveredRating
  };

  const handleMouseLeave = () => {
    setHoveredRating(0); // Khi rời khỏi sao, hoveredRating trở về 0
  };

  return (
    <div className="flex items-center gap-2">
      {/* Render sao */}
      <div className="flex gap-1">
        {Array.from({ length: totalStars }, (_, index) => (
          <span
            key={index}
            className={`transition-all duration-300 ease-in-out cursor-pointer 
              ${index < (hoveredRating || rating) ? 'text-red-500 scale-110' : 'text-gray-400'}
              hover:text-yellow-500 hover:scale-125`}
            onClick={() => handleStarClick(index)} // Xử lý khi click vào sao
            onMouseEnter={() => handleMouseEnter(index)} // Xử lý hover sao
            onMouseLeave={handleMouseLeave} // Xử lý khi rời chuột khỏi sao
          >
            ⭐
          </span>
        ))}
      </div>
      {/* Hiển thị điểm đánh giá */}
      <span className="text-gray-500">({rating})</span>
    </div>
  );
};

export default Rating;
