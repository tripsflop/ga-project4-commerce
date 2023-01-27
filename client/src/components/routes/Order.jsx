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
    <div className="container mt-5 pt-5">
      <table className="table align-middle mb-0 bg-white">
        <thead className="bg-light">
          <tr>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Order Created</th>
            <th>Shipping Status</th>
            <th>Address Line 1</th>
            <th>Address Line 2</th>
            <th>Postal Code</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {order.map((product, index) => (
            <tr key={index}>
              <td>
                <div>{product.payment[0].toUpperCase()}</div>
              </td>
              <td>
                <div>{product.paymentStatus.toUpperCase()}</div>
              </td>
              <td>
                <div>{new Date(product.createdAt).toLocaleDateString()}</div>
              </td>
              <td>
                <div>{product.shippingStatus.status}</div>
              </td>
              <td>
                <div>{product.shippingDetails.line1}</div>
              </td>
              <td>
                <div>
                  {product.shippingDetails.line2 == null
                    ? "nil"
                    : product.shippingDetails.line2}
                </div>
              </td>
              <td>
                <div>{product.shippingDetails.postal_code}</div>
              </td>
              <td>
                <div>${product.total / 100}</div>
              </td>
              <td>
                <button
                  id={product._id}
                  type="button"
                  onClick={handleCancel}
                  hidden={
                    product.isDeleted ||
                    product.shippingStatus.status == "Completed" ||
                    product.shippingStatus.status == "Returned" ||
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Order;
