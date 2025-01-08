import './RatingCart.css'
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

const RatingCart: React.FC = () => {

  return (
    <div className="rating">
        <IoStar />
        <IoStar />
        <IoStar />
        <IoStarHalf />
        <IoStarOutline />
    </div>
  );
};

export default RatingCart;
