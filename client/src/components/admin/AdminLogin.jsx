import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addUserId } from "../../redux/user";
import { useDispatch } from "react-redux";

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
    dispatch(addUserId({ _id }));
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
    <section>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("username")}
          placeholder="username"
          required
          onChange={() => {
            setMsg("");
          }}
        />
        <br></br>
        <span>{errors.username?.message}</span>
        <br></br>
        <input
          type="password"
          {...register("password")}
          placeholder="password"
          onChange={() => {
            setMsg("");
          }}
          required
        />
        <br></br>
        <span>{errors.password?.message}</span>
        <br></br>
        {msg.length > 0 && <span>{msg}</span>}
        <br></br>
        <input type="submit" value="Sign In" />
      </form>
    </section>
  );
}

export default AdminLogin;
