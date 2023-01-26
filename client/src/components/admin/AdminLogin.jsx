import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addUserId } from "../../redux/user";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import "./admin.css";
import Role from "../helper/roles.js";

const schema = yup.object().shape({
  username: yup.string().min(5).max(32).required(),
  password: yup.string().min(8).max(32).required(),
});

function AdminLogin() {
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
    dispatch(addUserId({ _id: _id, role: Role.Admin }));
  };

  const onSubmit = async (data) => {
    setMsg("");
    const response = await fetch("/api/admin/login", {
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
          navigate("/dashboard");
        }
        if (data.msg) {
          setMsg(data.msg);
        }
      });
  };

  return (
    <div className="container-fluid ps-md-0">
      <div className="row g-0">
        <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
        <div className="col-md-8 col-lg-6">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <h3 className="login-heading mb-4">Admin Login</h3>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        type="text"
                        {...register("username")}
                        placeholder="Username"
                        required
                        onChange={() => {
                          setMsg("");
                        }}
                      />
                      <label htmlFor="floatingInput">Username</label>
                    </div>
                    <Form.Text>{errors.username?.message}</Form.Text>

                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        {...register("password")}
                        onChange={() => {
                          setMsg("");
                        }}
                        required
                      />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <Form.Text>{errors.password?.message}</Form.Text>
                    <Form.Text>{msg.length > 0 && msg}</Form.Text>

                    <div className="d-grid">
                      <button
                        className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2"
                        type="submit"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
