import "./App.css";
import Navigation from "./Navigation";
import Home from "../routes/Home";
import Explore from "../routes/Explore";
import Account from "../routes/Account";
import Profile from "../routes/Profile";
import NotFound from "../misc/NotFound";
import Product from "../product/Product";
import Register from "../routes/Register";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:id" element={<Product />} />
          <Route path="account" element={<Account />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
