import React from "react";
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addUserId } from "../../redux/user";
import { useDispatch } from "react-redux";
import BootStrapForm from "react-bootstrap/Form";

const schema = yup.object().shape({
  username: yup.string().min(8).max(32).required(),
  password: yup.string().min(8).max(32).required(),
});

function Account() {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleDispatch = (_id) => {
    dispatch(addUserId({ _id }));
  };

  const onSubmit = async (data) => {
    setMsg("");
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data._id) {
          handleDispatch(data._id);
          navigate("/explore");
        }
        if (data.msg) {
          setMsg(data.msg);
        }
      });
  };

  return (
    <section className="vh-100 pt-5">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="/yeezy-unsplash-connor-houtman.jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <h4 className="fw-bold mb-2 pb-3">Have an account?</h4>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          {...register("username")}
                          placeholder="username"
                          className="form-control"
                          required
                          onChange={() => {
                            setMsg("");
                          }}
                        />
                        <label htmlFor="floatingInput">Username</label>
                      </div>
                      <BootStrapForm.Text>
                        {errors.username?.message}
                      </BootStrapForm.Text>

                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          {...register("password")}
                          placeholder="password"
                          className="form-control"
                          onChange={() => {
                            setMsg("");
                          }}
                          required
                        />
                        <label htmlFor="floatingPassword">Password</label>
                      </div>
                      <BootStrapForm.Text>
                        {errors.password?.message}
                      </BootStrapForm.Text>
                      {msg.length > 0 && (
                        <BootStrapForm.Text>{msg}</BootStrapForm.Text>
                      )}

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>

                      <p className="mb-5 pb-lg-2">
                        Don't have an account?{" "}
                        <Link to="/register">Register Here!</Link>
                      </p>
                    </form>
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

export default Account;
