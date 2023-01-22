import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { addProduct } from "../../redux/cart";
import { useDispatch } from "react-redux";

function Product() {
  const [product, setProduct] = useState([]);
  const [size, setSize] = useState("");
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

  const handleSize = (e) => {
    setSize(e.target.value);
  };

  const increase = () => {
    setQuantity((count) => count + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity((count) => count - 1);
    }
  };

  return (
    <div key={product._id}>
      <Link to="/explore">Back to Explore</Link>
      <img
        src={product.thumbnail}
        alt={product.urlKey}
        style={{ width: "40%", height: "40%" }}
      />
      <h2>{product.brand}</h2>
      <h4>{product.shoeName}</h4>
      <h4>${product.retailPrice}</h4>
      <h4>{product.description}</h4>
      <button
        type="button"
        disabled={!size && quantity}
        onClick={handleDispatch}
      >
        Add to cart
      </button>
      <ul>
        {product.sizes &&
          Object.entries(product.sizes).map(([key, value]) => (
            <button
              key={key}
              type="button"
              disabled={value == 0 ? true : false}
              value={key}
              onClick={handleSize}
            >
              {key}
            </button>
          ))}
      </ul>
      <div className="counter">
        <div>{`Selected Size:${size}`}</div>
        <span>{quantity}</span>
        <div>
          <button onClick={increase}>+</button>
          <button onClick={decrease}>-</button>
        </div>
      </div>
    </div>
  );
}

export default Product;
