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

  const handleCancel = (e) => {
    fetch(`/api/order/cancel/${e.target.id}`, {
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

  const handleRefund = (e) => {
    fetch(`/api/order/refund/${e.target.id}`, {
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
            <div>
              Address Line 2:{" "}
              {product.shippingDetails.line2 == null
                ? "nil"
                : product.shippingDetails.line2}
            </div>
            <div>Postal Code: {product.shippingDetails.postal_code}</div>
          </div>
          <div>Total: ${product.total / 100}</div>
          <button
            id={product._id}
            type="button"
            onClick={handleCancel}
            hidden={
              product.isDeleted ||
              product.shippingStatus.status == "Completed" ||
              product.paymentStatus == "Refund Initiated"
                ? true
                : false
            }
          >
            Cancel Order
          </button>

          <button
            id={product._id}
            type="button"
            onClick={handleRefund}
            hidden={
              product.isDeleted ||
              product.shippingStatus.status !== "Completed" ||
              product.paymentStatus == "Refund Initiated"
                ? true
                : false
            }
          >
            Initiate Refund
          </button>

          <br></br>
        </div>
      ))}
    </section>
  );
}

export default Order;
