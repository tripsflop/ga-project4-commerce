import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Order() {
  const user = useSelector((state) => state.user);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      await fetch(`/api/order/${user._id}`)
        .then((response) => response.json())
        .then((data) => setOrder(data));
    };
    fetchEntries();
  }, []);

  return (
    <section>
      <h1>Order</h1>
      {order.map((product, index) => (
        <div key={index}>
          <div>Payment Method: {product.payment[0].toUpperCase()}</div>
          <div>Payment Status: {product.paymentStatus.toUpperCase()}</div>
          <div>
            Order Created: {new Date(product.createdAt).toLocaleDateString()}
          </div>
          <div>Shipping Status: {product.shippingStatus.status}</div>
          <div>
            <div>Address Line 1: {product.shippingDetails.line1}</div>
            <div>Address Line 2: {product.shippingDetails.line2}</div>
            <div>Postal Code: {product.shippingDetails.postal_code}</div>
          </div>
          <div>Total: ${product.total / 100}</div>
          <br></br>
        </div>
      ))}
    </section>
  );
}

export default Order;
