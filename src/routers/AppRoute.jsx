import React from "react";
import { Navigate, Route } from "react-router-dom";
import LoginForm from "../pages/common/Login.jsx";
import Page404 from "../pages/ErrorPage/Page404";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreateStore from "../pages/StoreOwner/CreateStore.jsx";
import Customers from "../pages/StoreOwner/Customers.jsx";
import Staff_Customers from "../pages/Staff/Customers.jsx";
import Home from "../pages/StoreOwner/Home.jsx";
import Products from "../pages/StoreOwner/Products.jsx";
import Suppliers from "../pages/StoreOwner/Suppliers.jsx";
import Sale from "../pages/StoreOwner/Sale.jsx";
import Staffs from "../pages/StoreOwner/Staffs.jsx";
import CustomerDebtNote from "../pages/StoreOwner/CustomerDebtNote.jsx";
import SupplierDebtNote from "../pages/StoreOwner/SupplierDebtNote.jsx";
import SaleInvoiceReport from "../pages/StoreOwner/SaleReport/SaleInvoiceReport.jsx";
import StockExportReport from "../pages/StoreOwner/SaleReport/StockExportReport.jsx";
import ImportProduct from "../pages/StoreOwner/ImportProduct.jsx";
import RegisterForm from "../pages/common/Register.jsx";
import ImportInvoiceTabs from "../pages/StoreOwner/ImportInvoiceTabs.jsx";
import SaleInvoiceTabs from "../pages/StoreOwner/SaleInvoiceTabs.jsx";
import ImportInvoiceReport from "../pages/StoreOwner/ImportReport/ImportInvoiceReport.jsx";
import ImportInvoiceDetailReport from "../pages/StoreOwner/SaleReport/SaleInvoiceDetailReport.jsx";
import SaleInvoiceDetailReport from "../pages/StoreOwner/SaleReport/SaleInvoiceDetailReport.jsx";
import StaffHome from "../pages/Staff/Home.jsx";
import Staff_Products from "../pages/Staff/Products.jsx";
import Staff_Suppliers from "../pages/Staff/Suppliers.jsx";
import Staff_SaleTabs from "../pages/Staff/SaleInvoiceTabs.jsx";
import Staff_ImportTabs from "../pages/Staff/ImportInvoiceTabs.jsx";
import AdminHome from "../pages/SystemAdmin/Home.jsx";
import ForgotPasswordEmail from "../pages/common/ForgotPasswordEmail.jsx";
import ResetPassword from "../pages/common/ResetPassord.jsx";

const checkTokenValidity = () => {
  const token = localStorage.getItem("accessToken");
  const expiryTime = localStorage.getItem("token_expiry");
  return token && expiryTime && new Date().getTime() < expiryTime;
};

const StoreOwnerRouter = [
  { path: "/owner/home", component: Home },
  { path: "/owner/create-store", component: CreateStore },
  { path: "/owner/customers", component: Customers },
  { path: "/owner/products", component: Products },
  { path: "/owner/suppliers", component: Suppliers },
  { path: "/owner/staff-list", component: Staffs },
  { path: "/owner/debt-note/customer", component: CustomerDebtNote },
  { path: "/owner/debt-note/supplier", component: SupplierDebtNote },
  {
    path: "/owner/sale-report/sale-invoice-report",
    component: SaleInvoiceReport,
  },
  {
    path: "/owner/sale-report/stock-export-report",
    component: StockExportReport,
  },
  { path: "/owner/sale", component: Sale },
  { path: "/owner/import-tabs", component: ImportInvoiceTabs },
  { path: "/owner/sale-tabs", component: SaleInvoiceTabs },
  { path: "/owner/import-product", component: ImportProduct },
  {
    path: "/owner/import-report/import-invoice-report",
    component: ImportInvoiceReport,
  },
  {
    path: "/owner/sale-report/sale-invoice-detail-report",
    component: SaleInvoiceDetailReport,
  },
];
const StaffRouter = [
  { path: "/staff/home", component: StaffHome },
  { path: "/staff/products", component: Staff_Products },
  { path: "/staff/customers", component: Staff_Customers },
  { path: "/staff/suppliers", component: Staff_Suppliers },
  { path: "/staff/import-tabs", component: Staff_ImportTabs },
  { path: "/staff/sale-tabs", component: Staff_SaleTabs },
];
const AdminRouter = [{ path: "/admin/home", component: AdminHome }];
const AppRoute = () => {
  const tokenValid = checkTokenValidity();

  const redirectToHome = () => {
    let role = "";
    if (tokenValid) {
      role = localStorage.getItem("userRole");
    }
    switch (role) {
      case "STORE_OWNER":
        return <Navigate to="/owner/home" />;
      case "STAFF":
        return <Navigate to="/staff/home" />;
      case "SYSTEM_ADMIN":
        return <Navigate to="/admin/home" />;
      default:
        return <LoginForm />;
    }
  };

  const OwnerRoutes = StoreOwnerRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute
          component={route.component}
          requiredRole={"STORE_OWNER"}
        />
      }
    />
  ));

  const StaffRoutes = StaffRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute component={route.component} requiredRole={"STAFF"} />
      }
    />
  ));

  const AdminRoutes = AdminRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute
          component={route.component}
          requiredRole={"SYSTEM_ADMIN"}
        />
      }
    />
  ));

  return [
    ...OwnerRoutes,
    ...StaffRoutes,
    ...AdminRoutes,
    <Route key="/logout" path="/logout" element={<LoginForm />} />,
    <Route key="*" path="*" element={<Page404 />} />,
    <Route key="/login" path="/login" element={redirectToHome()} />,
    <Route key="/" path="/" element={redirectToHome()} />,
    <Route
      key="/register"
      path="/register"
      element={tokenValid ? redirectToHome() : <RegisterForm />}
    />,
    <Route
      key="/forgot-password"
      path="/forgot-password"
      element={<ForgotPasswordEmail />}
    />,
    <Route
      key="/reset-password"
      path="/reset-password"
      element={<ResetPassword />}
    />,
  ];
};

export default AppRoute;
