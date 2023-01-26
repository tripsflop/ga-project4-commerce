import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";

function Explore() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      await fetch("/api/product/all")
        .then((response) => response.json())
        .then((data) => setItems(data));
    };
    fetchEntries();
  }, []);

  return (
    <section>
      <div className="text-left container py-5 mt-5">
        <div className="row">
          {items.map((item) => (
            <div
              key={item._id}
              className="col-lg-4 col-md-12 mb-4 d-flex align-items-stretch"
            >
              <div className="card">
                <Link to={`/explore/${item.urlKey}`} state={{ from: item._id }}>
                  <img
                    src={item.thumbnail}
                    alt={item.urlKey}
                    className="card-img-top"
                  />
                </Link>
                <div className="card-body ">
                  <h5 className="card-title mb-3">{item.shoeName}</h5>
                  <h6 className="mb-3">
                    <strong>${item.retailPrice}</strong>
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination className="justify-content-center">
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Ellipsis />

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item>
          <Pagination.Item active>{12}</Pagination.Item>
          <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item disabled>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
    </section>
  );
}

export default Explore;
