import React from "react";
import useFetch from "../hooks/useFetch";

function Profile() {
  const { response, loading, error } = useFetch(
    "/api/user/63c122801fee2534d953fd42"
  );

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
    </section>
  );
}

export default Profile;
