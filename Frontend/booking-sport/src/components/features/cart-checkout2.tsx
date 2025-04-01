import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCart } from '@/components/features/cart-context';
import { toast } from '../ui/use-toast';

const OrderDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();
  const router = useRouter();
  const { orderID } = router.query;

  useEffect(() => {
    if (!orderID) {
      router.push('/'); 
    }
  }, [orderID, router]);

  const handleCreateOrderDetails = async () => {
    if (!orderID) return;

    setLoading(true);

    try {
      const orderDetailsPromises = cart.map((item) => {
        return axios.post('http://localhost:5000/api/admin/orderdetail/create', {
          orderID,
          productID: item.id,
          totalPrice: item.price * item.quantity,
          quantity: item.quantity,
        });
      });

      const detailsResponses = await Promise.all(orderDetailsPromises);

      const allSuccess = detailsResponses.every(response => response.status === 200);
      if (allSuccess) {
        toast({
          title: 'Success',
          description: 'Order details created successfully!',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Some order details failed to save.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-details-page">
      <h2>Order Details for Order ID: {orderID}</h2>

      <button onClick={handleCreateOrderDetails} disabled={loading}>
        {loading ? 'Processing...' : 'Create Order Details'}
      </button>
    </div>
  );
};

export default OrderDetailsPage;
