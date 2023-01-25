import React from "react";
import { useEffect, useState } from "react";

function Dashboard() {
  const [order, setOrder] = useState([]);

  console.log(order);

  useEffect(() => {
    const fetchEntries = async () => {
      await fetch(`/api/order/initiate`)
        .then((response) => response.json())
        .then((data) => setOrder(data));
    };
    fetchEntries();
  }, []);

  const handleRefund = (e) => {
    fetch(`/api/order/manual/${e.target.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((json) => Promise.reject(json));
        }
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {order.map((product, index) => (
        <div key={index}>
          <div>Payment Intent: {product.paymentIntent}</div>
          <div>Payment Status: {product.paymentStatus}</div>
          <div>Shipping Status: {product.shippingStatus.status}</div>
          <div>Total: ${product.total / 100}</div>
          <div>User: {product.user}</div>
          <button
            id={product._id}
            disabled={product.paymentStatus === "Refunded" ? true : false}
            type="button"
            onClick={handleRefund}
          >
            {product.paymentStatus === "Refunded" ? "Refunded" : "Refund User"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
