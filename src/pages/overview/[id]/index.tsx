import './style.css';
import Review from '../../../../Components/Reviews/Review';
import ProductCart from '../../../../Components/Product Cart/ProductCart';
import Footer from '../../../../Components/Footer/Footer';
import Cart from '../../../../Components/Cart/Cart';
import Navbar from '../../../../Components/Navbar/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
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
  const [product, setProduct] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post('/api/product/get-product', {
          productId: id
        });
        setProduct(response.data.product);
        const product = response.data.product
        setSelectedProduct(product)
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);
  console.log(selectedProduct)

  useEffect(() => {
    // Fetch real product data from API using Axios
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product'); // Replace with your real API endpoint
        setProducts(response.data); // Assuming the response returns an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
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
