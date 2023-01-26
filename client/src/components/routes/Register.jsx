import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import BootStrapForm from "react-bootstrap/Form";

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
    <section className="vh-100 pt-5 center">
      <div className="container py-5 h-100">
        <div className="card-body p-4 p-lg-5 text-black">
          <h2 className="fw-bold mb-2 pb-3">Let's get started!</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
              <input
                type="text"
                placeholder="Username"
                {...register("username", { required: true })}
                className="form-control"
              />
              <label htmlFor="floatingInput">Username</label>
            </div>
            {errors.username && (
              <BootStrapForm.Text>
                {errors.username?.message}
              </BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                {...register("password", { required: true })}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            {errors.password && (
              <BootStrapForm.Text>
                {errors.password?.message}
              </BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control"
                {...register("cpassword", { required: true })}
              />
              <label htmlFor="floatingPassword">Confirm Password</label>
            </div>
            {errors.cpassword && (
              <BootStrapForm.Text>
                {errors.cpassword?.message}
              </BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                {...register("name", { required: true })}
              />
              <label htmlFor="floatingInput">Name</label>
            </div>
            {errors.name && (
              <BootStrapForm.Text>{errors.name?.message}</BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="number"
                placeholder="Mobile"
                className="form-control"
                {...register("mobile", { required: true })}
              />
              <label htmlFor="floatingInput">Mobile</label>
            </div>
            {errors.mobile && (
              <BootStrapForm.Text>{errors.mobile?.message}</BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                placeholder="Email"
                className="form-control"
                {...register("email", { required: true })}
              />
              <label htmlFor="floatingInput">Email</label>
            </div>
            {errors.email && (
              <BootStrapForm.Text>{errors.email?.message}</BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                placeholder="Street Name"
                className="form-control"
                {...register("streetName", { required: true })}
              />
              <label htmlFor="floatingInput">Street Name</label>
            </div>
            {errors.streetName && (
              <BootStrapForm.Text>
                {errors.streetName?.message}
              </BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                placeholder="Unit No"
                className="form-control"
                {...register("unitNo", { required: true })}
              />
              <label htmlFor="floatingInput">Unit No</label>
            </div>
            {errors.unitNo && (
              <BootStrapForm.Text>{errors.unitNo?.message}</BootStrapForm.Text>
            )}

            <div className="form-floating mb-3">
              <input
                type="number"
                placeholder="Postal Code"
                className="form-control"
                {...register("postalCode", { required: true })}
              />
              <label htmlFor="floatingInput">Postal Code</label>
            </div>
            {errors.postalCode && (
              <BootStrapForm.Text>
                {errors.postalCode?.message}
              </BootStrapForm.Text>
            )}

            <div className="pt-1 mb-4">
              <button className="btn btn-dark btn-lg btn-block" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
export default Register;
