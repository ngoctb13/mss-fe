import React from "react";
import { Route } from "react-router-dom";
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
];
const StaffRouter = [{ path: "/staff/customers", component: Staff_Customers }];
const AdminRouter = [];
const AppRoute = () => {
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
        <ProtectedRoute component={route.component} requiredRole={["STAFF"]} />
      }
    />
  ));
  return [
    ...OwnerRoutes,
    ...StaffRoutes,
    <Route key="/logout" path="/logout" element={<LoginForm />} />,
    <Route key="*" path="*" element={<Page404 />} />,
    <Route key="/login" path="/login" element={<LoginForm />} />,
    <Route key="/" path="/" element={<LoginForm />} />,
    <Route key="/register" path="/register" element={<RegisterForm />} />,
  ];
};

export default AppRoute;
