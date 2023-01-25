import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is a required field")
    .matches(/^[a-z0-9]+$/i, "Username can only be alphanumeric")
    .min(8, "Username length should be at least 8 characters")
    .max(32, "Username cannot exceed more than 32 characters")
    .test("username-exists", "Username already in use.", function (value) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/user/check/${value}`)
          .then((res) => {
            console.log(res.data.msg);
            resolve(true);
          })
          .catch((error) => {
            if (error.response.data.msg === "Username not available") {
              resolve(false);
            }
          });
        // fetch(`/api/user/check/${value}`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // })
        //   .then((res) => res.json())
        //   .then((data) => {
        //     console.log(data.msg);
        //     if (data.msg === "Username available") {
        //       resolve(true);
        //     } else {
        //       resolve(false);
        //     }
        //   });
      });
    }),
  password: yup
    .string()
    .required("Password is a required field")
    .min(8, "Password length should be at least 8 characters")
    .max(32, "Password cannot exceed more than 32 characters"),
  cpassword: yup
    .string()
    .required("Password is a required field")
    .min(8, "Password length should be at least 8 characters")
    .max(32, "Password cannot exceed more than 32 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
  name: yup
    .string()
    .required("Name is a required field")
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "Name can only contain Latin letters."
    ),
  mobile: yup
    .string()
    .required("Mobile is a required field")
    .length(8)
    .matches(/^[89]\d{7}$/, "Please enter a valid Singapore mobile number"),
  email: yup
    .string()
    .required("Email is a required field")
    .matches(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Please enter a valid email address"
    ),
  streetName: yup.string().required("Street Name is a required field"),
  unitNo: yup.string().required("Unit No is a required field"),
  postalCode: yup
    .string()
    .required("Postal Code is a required field")
    .length(6),
});

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <React.Fragment>
      <h1>Let's get started!</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username: </label>
        <input type="text" {...register("username", { required: true })} />
        {errors.username && <span>{errors.username?.message}</span>}
        <br></br>

        <label>Password: </label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <span>{errors.password?.message}</span>}
        <br></br>

        <label>Confirm Password: </label>
        <input type="password" {...register("cpassword", { required: true })} />
        {errors.cpassword && <span>{errors.cpassword?.message}</span>}
        <br></br>

        <label>Name: </label>
        <input type="text" {...register("name", { required: true })} />
        {errors.name && <span>{errors.name?.message}</span>}
        <br></br>

        <label>Mobile: </label>
        <input type="number" {...register("mobile", { required: true })} />
        {errors.mobile && <span>{errors.mobile?.message}</span>}
        <br></br>

        <label>Email: </label>
        <input type="text" {...register("email", { required: true })} />
        {errors.email && <span>{errors.email?.message}</span>}
        <br></br>

        <label>Street Name: </label>
        <input type="text" {...register("streetName", { required: true })} />
        {errors.streetName && <span>{errors.streetName?.message}</span>}
        <br></br>

        <label>Unit No: </label>
        <input type="text" {...register("unitNo", { required: true })} />
        {errors.unitNo && <span>{errors.unitNo?.message}</span>}
        <br></br>

        <label>Postal Code: </label>
        <input type="number" {...register("postalCode", { required: true })} />
        {errors.postalCode && <span>{errors.postalCode?.message}</span>}
        <br></br>

        <input type="submit" />
      </form>
    </React.Fragment>
  );
}
export default Register;
