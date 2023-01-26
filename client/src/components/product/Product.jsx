import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { addProduct } from "../../redux/cart";
import { useDispatch } from "react-redux";

function Product() {
  const [product, setProduct] = useState([]);
  const [size, setSize] = useState("");
  const [available, setAvailable] = useState("");
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const { from } = location.state;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEntries = async () => {
      await fetch(`/api/product/${from}`)
        .then((response) => response.json())
        .then((data) => setProduct(data));
    };
    fetchEntries();
  }, []);

  const handleDispatch = () => {
    dispatch(addProduct({ ...product, quantity, size }));
  };

  const handleClick = (e) => {
    setQuantity(1);
    setSize(e.target.value);
    setAvailable(product.sizes[e.target.value]);
  };

  const increase = () => {
    if (quantity < available) {
      setQuantity((count) => count + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity((count) => count - 1);
    }
  };

  return (
    <section key={product._id} className="py-5">
      <div className="container px-4 px-lg-5 my-5">
        <Link to="/explore">
          <button className="btn btn-info">Back to Explore</button>
        </Link>
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6 d-flex justify-content-center">
            <img
              className="card-img-top mb-5 mb-md-0"
              src={product.thumbnail}
              alt={product.urlKey}
            />
          </div>

          <div className="col-md-6">
            <div className="small mb-1">{product.brand}</div>
            <h1 className="display-5 fw-bolder">{product.shoeName}</h1>
            <div className="fs-5 mb-5">
              <div>${product.retailPrice}</div>
              <h6 className="mt-2">{size && `${available} Pairs Available`}</h6>
            </div>
            <div>
              {product.sizes &&
                Object.entries(product.sizes).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={value == 0 ? true : false}
                    value={key}
                    className="mx-1 my-1 px-2 py-2 btn btn-outline-dark btn-fixed-width"
                    onClick={handleClick}
                  >
                    {key}
                  </button>
                ))}
            </div>
            <p className="text-muted mt-3">{product.description}</p>
            <div className="d-flex">
              {/* <div className="fs-5 mr-3">
                <h5>{size && `Size:${size}`}</h5>
              </div> */}
              <div className="fs-5 mx-3">
                <button className="btn btn-outline-dark" onClick={increase}>
                  +
                </button>
                <span className="mx-3 my-3">{quantity}</span>
                <button className="btn btn-outline-dark" onClick={decrease}>
                  -
                </button>
              </div>
              <div className="justify-content-right">
                <button
                  className="btn btn-dark"
                  type="button"
                  disabled={!size && quantity}
                  onClick={handleDispatch}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Product;
