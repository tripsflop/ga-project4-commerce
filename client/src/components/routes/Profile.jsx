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
      <h1>Profile</h1>
      <div className="App">
        {loading && <p>Loading...</p>}
        {error && <p>Something went wrong...</p>}
        {response && <p>{response.username}</p>}
        {response && <p>{response.email}</p>}
        {response && <p>{response.streetName}</p>}
        {response && <p>{response.mobile}</p>}
      </div>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </section>
  );
}

export default Profile;
