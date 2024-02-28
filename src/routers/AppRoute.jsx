import React from "react";
import { Route } from "react-router-dom";
import LoginForm from "../pages/common/Login.jsx";
import Page404 from "../pages/ErrorPage/Page404";
import RegisterForm from "../pages/common/Register.jsx";
import Home from "../pages/Home.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreateStore from "../pages/StoreOwner/CreateStore.jsx";
import Customer from "../pages/Customer/Customer.jsx";

const AppRoute = () => {
  return [
    <Route key="/logout" path="/logout" element={<LoginForm />} />,
    <Route key="*" path="*" element={<Page404 />} />,
    <Route key="/login" path="/login" element={<LoginForm />} />,
    <Route
      key="/create-store"
      path="/create-store"
      element={<CreateStore />}
    />,
    <Route key="/register" path="/register" element={<RegisterForm />} />,
    <Route key="/customer" path="/customer" element={<Customer />} />,
    <Route
      key="/home"
      path="/home"
      element={
        <ProtectedRoute
          component={Home}
          requiredRole={["STORE_OWNER", "STAFF"]}
        />
      }
    />,
    <Route key="" path="" element={<LoginForm />} />,
  ];
};

export default AppRoute;
