import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import axios from "axios";

function Explore() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(1);
  const [numItems, setNumItems] = useState("");
  const numItemsPerPage = 15;
  let pages = [];

  // useEffect(() => {
  //   const fetchEntries = async () => {
  //     await fetch("/api/product/all")
  //       .then((response) => response.json())
  //       .then((data) => setItems(data));
  //   };
  //   fetchEntries();
  // }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      await fetch(`/api/product/count`)
        .then((response) => response.json())
        .then((data) => {
          setNumItems(data);
          // setIndex(Array.from({ length: data }, (_, i) => i + 1));
        });
    };
    fetchEntries();
  }, []);

  for (
    let number = 1;
    number <= Math.ceil(numItems / numItemsPerPage);
    number++
  ) {
    pages.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => pagination(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    if (active === 1) {
      axios
        .get(`/api/product/item?page=${1}&limit=${numItemsPerPage}`)
        .then((data) => {
          setItems(data.data);
        });
    }
  }, [active]);

  function pagination(number) {
    setActive(number);
    axios
      .get(`/api/product/item?page=${number}&limit=${numItemsPerPage}`)
      .then((data) => {
        setItems(data.data);
      });
  }

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
        <div className="container d-flex justify-content-center">
          <Pagination size="sm">
            <Pagination.Prev
              onClick={() => {
                if (active > 1) {
                  pagination(active - 1);
                }
              }}
            />
            {pages}
            <Pagination.Next
              onClick={() => {
                if (active < Math.ceil(numItems / numItemsPerPage)) {
                  pagination(active + 1);
                }
              }}
            />
          </Pagination>
        </div>
      </div>
    </section>
  );
}

export default Explore;
