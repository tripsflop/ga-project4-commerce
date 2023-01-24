import React from "react";
import { useSelector } from "react-redux";

function Cart() {
  const cart = useSelector((state) => state.cart);

  const handleCheckout = () => {
    fetch("/api/checkout/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart.products),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((json) => Promise.reject(json));
        }
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  return (
    <section>
      <h1>Cart</h1>
      {cart.products.map((product, index) => (
        <div key={index}>
          <img
            src={product.thumbnail}
            alt={product.urlKey}
            style={{ width: "40%", height: "40%" }}
          />
          <div>{product.shoeName}</div>
          <div>Size:{product.size}</div>
          <div>${product.retailPrice}</div>
          <div>Quantity:{product.quantity}</div>
        </div>
      ))}
      <div>Total:${cart.total}</div>
      <button onClick={handleCheckout}>Checkout</button>
    </section>
  );
}

export default Cart;
