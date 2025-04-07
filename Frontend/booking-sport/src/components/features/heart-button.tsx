// src/components/HeartButton.tsx
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa'; // Font Awesome heart icon

interface HeartButtonProps {
    size?: number;
    className?: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({ size = 40, className = '' }) => {
    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <div className={`${className}`}>
            <FaHeart
                onClick={toggleLike}
                size={size}
                className={`cursor-pointer transition-all duration-300 ease-in-out 
            ${liked ? 'text-red-500 scale-110' : 'text-gray-500 scale-100'} 
            hover:text-pink-500 hover:scale-125`}
            />
        </div>
    );
};

export default HeartButton;
