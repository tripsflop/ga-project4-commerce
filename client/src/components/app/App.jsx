import "./App.css";
import Navigation from "./Navigation";
import Home from "../routes/Home";
import Explore from "../routes/Explore";
import Account from "../routes/Account";
import Profile from "../routes/Profile";
import NotFound from "../misc/NotFound";
import Product from "../product/Product";
import Register from "../routes/Register";
import Cart from "../routes/Cart";
import Order from "../routes/Order";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";
import { useSelector } from "react-redux";
import AdminLogin from "../admin/AdminLogin";
import Dashboard from "../admin/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const user = useSelector((state) => state.user._id);

  return (
    <div className="app">
      <Routes>
        <Route path="/admin" element={<AdminLogin />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>

        <Route element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:id" element={<Product />} />
          <Route
            path="account"
            element={
              <PublicRoute user={user}>
                <Account />
              </PublicRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route
            path="order"
            element={
              <ProtectedRoute user={user}>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
