import './AddOne.css';
import { IoIosAdd } from 'react-icons/io';

interface AddOneProps {
  textContent: string;
}

const AddOne: React.FC<AddOneProps> = (props) => {
  return (
    <div className='add-container'>
      <IoIosAdd /> <p>{props.textContent}</p>
    </div>
  );
};

export default AddOne;
