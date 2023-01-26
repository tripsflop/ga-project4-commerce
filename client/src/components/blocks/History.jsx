import React from "react";

function History() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <div className="row gy-lg-5 align-items-center">
          <div className="col-lg-6 order-lg-1 text-center text-lg-start">
            <div className="title pt-3 pb-5">
              <h2 className="position-relative d-inline-block">Our History</h2>
            </div>
            <p className="lead text-muted">
              From humble beginnings as a small shop,
            </p>
            <p>
              STRIDES has grown to become a destination for sneaker enthusiasts
              around the world. We pride ourselves on our extensive selection of
              the latest and greatest kicks, as well as our commitment to
              delivering the best customer service possible. Whether you're a
              serious collector or just looking for a new pair of everyday
              sneakers, you'll find what you're looking for at our online store.
            </p>
          </div>
          <div className="col-lg-6 order-lg-0">
            <img src="/nike-1984.webp" alt="" className="img-fluid" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default History;
