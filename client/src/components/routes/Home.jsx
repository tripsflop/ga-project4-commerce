import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      await fetch("/api/product/latest")
        .then((response) => response.json())
        .then((data) => setItems(data));
    };
    fetchEntries();
  }, []);

  return (
    <section>
      <h1>Homepage</h1>
      <div>
        {items.map((item) => (
          <div key={item._id}>
            <Link to={`/explore/${item.urlKey}`} state={{ from: item._id }}>
              <img
                src={item.thumbnail}
                alt={item.urlKey}
                style={{ width: "20%", height: "20%" }}
              />
            </Link>
            <h2>{item.brand}</h2>
            <h4>{item.shoeName}</h4>
            <h4>${item.retailPrice}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Home;
