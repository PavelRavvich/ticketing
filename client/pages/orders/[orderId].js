import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const OrderView = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    }
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>Order: {order.id}</h1>
      <h4>Ticket: {order.ticket.title}</h4>
      <h4>Price: {order.ticket.price}</h4>
      <h4>Status: {order.status}</h4>
      <h4>Time left to pay: {timeLeft}</h4>
      <StripeCheckout
        email={currentUser.email}
        amount={order.ticket.price * 100}
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
      />
      {errors}
    </div>
  );
};

OrderView.getInitialProps = async function getInitialProps(context, client) {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderView;
