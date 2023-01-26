import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();

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
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogout = async () => {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.text();
      })
      .then(localStorage.removeItem("persist:root"))
      .then(navigate("/admin"))
      .catch((e) => {
        console.error(e.error);
      });
  };

  return (
    <div>
      <table className="table align-middle mb-0 bg-white">
        <thead className="bg-light">
          <tr>
            <th>User</th>
            <th>Payment Intent</th>
            <th>Shipping Status</th>
            <th>Total</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {order.map((product, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{product.user.username}</p>
                    <p className="text-muted mb-0">{product.user._id}</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">Stripe</p>
                <p className="text-muted mb-0">{product.paymentIntent}</p>
              </td>
              <td>
                <span
                  className={
                    product.shippingStatus.status === "Returned"
                      ? "badge rounded-pill bg-success"
                      : "badge rounded-pill bg-warning text-dark"
                  }
                >
                  {product.shippingStatus.status}
                </span>
              </td>
              <td>${product.total / 100}</td>
              <td>
                <button
                  type="button"
                  className={
                    product.paymentStatus === "Refunded"
                      ? "badge bg-secondary rounded-pill text-dark"
                      : "badge bg-primary rounded-pill text-dark"
                  }
                  data-mdb-ripple-color="dark"
                  id={product._id}
                  disabled={product.paymentStatus === "Refunded" ? true : false}
                  onClick={handleRefund}
                >
                  {product.paymentStatus === "Refunded"
                    ? "Refunded"
                    : "Refund User"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
