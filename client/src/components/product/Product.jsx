import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Product() {
  const [product, setProduct] = useState([]);
  const location = useLocation();
  const { from } = location.state;
  useEffect(() => {
    const fetchEntries = async () => {
      await fetch(`/api/product/${from}`)
        .then((response) => response.json())
        .then((data) => setProduct(data));
    };
    fetchEntries();
  }, []);

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
    </div>
  );
}

export default Product;
