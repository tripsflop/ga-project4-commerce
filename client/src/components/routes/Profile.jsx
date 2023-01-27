import React from "react";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state) => state.user);
  const { response, loading, error } = useFetch(`/api/user/${user._id}`);

  const handleLogout = async () => {
    const response = await fetch("/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(localStorage.removeItem("persist:root"))
      .then(window.location.reload(false));
  };

  return (
    <section>
      <section className="vh-100" style={{ backgroundColor: "#f4f5f7" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-6 mb-4 mb-lg-0">
              <div className="card mb-3" style={{ borderRadius: "0.5rem" }}>
                <div className="row g-0">
                  <div
                    className="col-md-4 text-center text-black"
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                      alt="Avatar"
                      className="img-fluid my-5"
                      style={{ width: "80px" }}
                    />
                    {response && <h5 className="text-bold">{response.name}</h5>}
                    {response && (
                      <p className="text-muted">{response.username}</p>
                    )}
                    <div className="mx-1 my-2">
                      <button
                        className="btn btn-dark btn-sm btn-block"
                        type="button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body p-4">
                      {loading && <p>Loading...</p>}
                      {error && <p>Something went wrong...</p>}
                      <h6>Profile Information</h6>
                      <hr className="mt-0 mb-4" />
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Email</h6>
                          {response && (
                            <p className="text-muted">{response.email}</p>
                          )}
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Phone</h6>
                          {response && (
                            <p className="text-muted">{response.mobile}</p>
                          )}
                        </div>
                      </div>
                      <h6>Shipping Information</h6>
                      <hr className="mt-0 mb-4" />
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Street Name</h6>
                          {response && (
                            <p className="text-muted">{response.streetName}</p>
                          )}
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Postal Code</h6>
                          {response && (
                            <p className="text-muted">{response.postalCode}</p>
                          )}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Profile;
