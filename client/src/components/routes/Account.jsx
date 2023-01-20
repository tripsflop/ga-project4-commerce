import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().min(8).max(32).required(),
  password: yup.string().min(8).max(32).required(),
});

function Account() {
  const [msg, setMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
        if (data.msg) {
          setMsg(data.msg);
        }
      });
  };

  return (
    <section>
      <h1>Have an account?</h1>
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
      <h3>Register Here!</h3>
      <Link to="/register">Create an Account</Link>
    </section>
  );
}

export default Account;
