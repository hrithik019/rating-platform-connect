
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 20,
  interactive = false,
  onChange
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  // Create an array from 1 to maxRating
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className="flex">
      {stars.map((star) => {
        const isFilled = interactive 
          ? star <= (hoverRating || rating)
          : star <= rating;
          
        return (
          <div 
            key={star} 
            className={`cursor-${interactive ? 'pointer' : 'default'}`}
            onClick={() => interactive && onChange && onChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            <Star
              size={size}
              className={`${isFilled ? 'fill-rating-filled text-rating-filled' : 'fill-rating-empty text-rating-empty'}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
