import './style.css';
import Review from '../../../app/Components/Reviews/Review';
import ProductCart from '../../../app/Components/Product Cart/ProductCart';
import Footer from '../../../app/Components/Footer/Footer';
import Cart from '../../../app/Components/Cart/Cart';
import Navbar from '../../../app/Components/Navbar/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../../app/Components/Loader/Loader';

interface Product {
  _id: string;
  id: string;
  image: string;
  name: string;
  deliveryType: string;
  newPrice: string;
  oldPrice: string;
  productName: string;
  price: { newPrice: string; oldPrice: string };
  rating: number;
  productImages: string[];
  relatedImages: string[];
  description: string;
  district: string;
  freshness: string;
  agricationMethod: string;
}

function ProductOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find((p) => p._id === id);
      setSelectedProduct(product);
    }
  }, [id, products]);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  return (
    <div className="overview-container">
      <Navbar />
      <hr className="sticky top-16" />
      <div className="overview-main mx-60">
        <div className="overview-carts">
          <ProductCart product={selectedProduct} />
        </div>
        <div className="related-products">
          <h2 className="text-2xl font-semibold">Related Products</h2>
          <div className="product-carts">
            {products.map((item) => (
              <Cart key={item.id} data={item} />
            ))}
          </div>
        </div>
        <Review />
      </div>
      <Footer />
    </div>
  );
}

export default ProductOverviewPage;
