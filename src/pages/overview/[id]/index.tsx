import './style.css';
import Review from '../../../../Components/Reviews/Review';
import ProductCart from '../../../../Components/Product Cart/ProductCart';
import Sidebar from '../../../../Components/Sidebar/Sidebar';
import Footer from '../../../../Components/Footer/Footer';
import Cart from '../../../../Components/Cart/Cart';
import Toggle from '../../../../Components/Toggle/Toggle';

import sampleData from '../../../../Data/ProductData';

import { RiMoonClearFill } from "react-icons/ri";
import { IoCartOutline } from "react-icons/io5";
import { useRouter } from 'next/router';

import { StaticImageData } from "next/image";

interface ProductData {
  id: string;
  image: string | StaticImageData;
  name: string;
  deliveryType: string;
  newPrice: string;
  oldPrice: string;
}

interface Product {
  id: string;
  image: string | StaticImageData;
  name: string;
  deliveryType: string;
  newPrice: string;
  oldPrice: string;
}

function ProductOverviewPage() {
  const { query } = useRouter();
  const id = query.id as string;

  const selectedProduct = sampleData.find((item: Product) => item.id === id);

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  return (
    <div className='overview-container'>
      <Sidebar />
      <div className='overview-main'>
        <div className='overview-carts'>
          {selectedProduct && <ProductCart key={selectedProduct.id} {...selectedProduct} />}
        </div>
        <div className="related-products">
          <h2>Related Product</h2>
          <div className='product-carts'>
            {sampleData.map((item: Product, index: number) => (
              <Cart key={index} data={item} />
            ))}
          </div>
        </div>
        <Review />
      </div>
      <Footer />
      <Toggle position={{ right: '10px' }} icon={<RiMoonClearFill />} />
      <Toggle link='/Cart' position={{ right: '60px' }} icon={<IoCartOutline />} />
    </div>
  );
}

export default ProductOverviewPage;