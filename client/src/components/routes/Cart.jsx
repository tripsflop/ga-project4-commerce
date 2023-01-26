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
    <section className="h-100 mt-5 h-custom">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="h5">
                      Item
                    </th>
                    <th scope="col">Size</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit Price</th>
                  </tr>
                  {cart.products.map((product, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <div className="d-flex align-items-center">
                          <img
                            src={product.thumbnail}
                            alt={product.urlKey}
                            className="img-fluid rounded-3"
                            style={{ width: 120 }}
                          />
                          <div className="flex-column ms-5 hide-desc">
                            <p className="mb-2">{product.brand}</p>
                            <p className="mb-0">{product.shoeName}</p>
                          </div>
                        </div>
                      </th>
                      <td className="align-middle">
                        <p className="mb-0">{product.size}</p>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex flex-row">
                          <button
                            className="btn btn-outline-dark"
                            value={index}
                            onClick={handleDecrease}
                          >
                            -
                          </button>

                          <div className="mx-2 my-2">{product.quantity}</div>

                          <button
                            className="btn btn-outline-dark"
                            value={index}
                            onClick={handleIncrease}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="align-middle">
                        <p className="mb-0">${product.retailPrice}</p>
                      </td>
                    </tr>
                  ))}
                </thead>
                <tbody></tbody>
              </table>
            </div>

            <div
              className="card shadow-2-strong mb-5 mb-lg-0"
              style={{ borderRadius: 16 }}
            >
              <div className="card-body p-4">
                <div className="row justify-content-end">
                  <div className="col-lg-4 col-xl-3">
                    <div className="d-flex justify-content-between">
                      <p className="mb-2">Subtotal</p>
                      <p className="mb-2">${cart.total}</p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="mb-0">Shipping</p>
                      <p className="mb-0 text-muted">To be calculated</p>
                    </div>

                    <hr className="my-4" />

                    <div className="d-flex justify-content-between mb-4">
                      <p className="mb-2">Total (tax included)</p>
                      <p className="mb-2">${cart.total}</p>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="btn btn-dark btn-lg"
                      >
                        <div className="d-flex justify-content-between">
                          <span>Checkout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
