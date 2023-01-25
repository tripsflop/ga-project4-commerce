import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, removeProduct } from "../../redux/cart";

function Cart() {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleCheckout = () => {
    fetch("/api/checkout/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cart.products, user: user._id }),
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

  const handleIncrease = (e) => {
    let selectedItem = JSON.parse(
      JSON.stringify(cart.products[e.target.value])
    );
    if (selectedItem.quantity < selectedItem.sizes[selectedItem.size]) {
      selectedItem.quantity = 1;
      dispatch(addProduct({ ...selectedItem }));
    }
  };

  const handleDecrease = (e) => {
    let selectedItem = JSON.parse(
      JSON.stringify(cart.products[e.target.value])
    );
    selectedItem.quantity = 1;
    dispatch(removeProduct({ ...selectedItem }));
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
          <div>
            <button value={index} onClick={handleIncrease}>
              +
            </button>
            <button value={index} onClick={handleDecrease}>
              -
            </button>
          </div>
        </div>
      ))}
      <div>Total:${cart.total}</div>
      <button onClick={handleCheckout}>Checkout</button>
    </section>
  );
}

export default Cart;
