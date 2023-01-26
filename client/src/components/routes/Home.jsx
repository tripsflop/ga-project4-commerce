import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import History from "../blocks/History";
import Header from "../blocks/Header";
import Newsletter from "../blocks/Newsletter";
import Footer from "../blocks/Footer";

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
      <Header />
      <div className="title text-center">
        <h2 className="position-relative d-inline-block pt-5">New Releases</h2>
        <div className="container pb-5">
          <div className="collection-list mt-4 row gx-0 gy-3">
            {items.map((item) => (
              <div className="col-md-6 col-lg-4 col-xl-3 p-2" key={item._id}>
                <div className="collection-img position-relative">
                  <Link
                    to={`/explore/${item.urlKey}`}
                    state={{ from: item._id }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.urlKey}
                      className="img-thumbnail"
                    />
                  </Link>
                </div>
                <div className="text-center">
                  <p className="text-capitalize my-1">{item.shoeName}</p>
                  <span className="fw-bold">$ {item.retailPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Newsletter />
      <History />
      <Footer />
    </section>
  );
}

export default Home;
