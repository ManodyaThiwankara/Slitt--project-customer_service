// src/App.js

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"; // Correct import
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ShopHomePage } from "./ShopRoutes.js";
import { getAllEvents } from "./redux/actions/event.js";
import { getAllProducts, getAllProductsShop } from "./redux/actions/product.js";
import { loadSeller } from "./redux/actions/seller.js";
import { loadUser } from "./redux/actions/user.js";
import store from "./redux/store.js";
import {
  AdminDashboardEvents,
  AdminDashboardOrders,
  AdminDashboardPage,
  AdminDashboardProducts,
  AdminDashboardReviews,
  AdminDashboardSellers,
  AdminDashboardUsers,
  AdminDashboardWithdraw
} from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import {
  ActivationPage,
  BestSellingPage,
  CheckoutPage,
  EventsPage,
  FaqPage,
  HomePage,
  LoginPage,
  OrderDetailsPage,
  OrderSuccessPage,
  PaymentPage,
  ProductDetailsPage,
  ProductsPage,
  ProfilePage,
  SellerActivationPage,
  ShopCreatePage,
  ShopLoginPage,
  SignupPage,
  TrackOrderPage,
  UserInbox,
} from "./routes/Routes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";
import {
  ShopAllCoupoun,
  ShopAllEvents,
  ShopAllOrderDetails,
  ShopAllOrders,
  ShopAllProducts,
  ShopAllRefunds,
  ShopCreateEvents,
  ShopCreateProduct,
  ShopDashboardPage,
  ShopEditProducts,
  ShopInboxPage,
  ShopPreviewPage,
  ShopSettingPage,
  ShopWithDrawMoneyPage,
} from "./routes/ShopRoute";
import { server } from "./server.js";

const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");

  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadSeller());
    store.dispatch(getAllProducts());
    store.dispatch(getAllProductsShop());
    store.dispatch(getAllEvents());
    getStripeApikey();
  }, []);
  return (
    <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />

        <Route path="/order/success" element={<OrderSuccessPage />} />
        {/* shop Routes */}
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />

        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <SellerProtectedRoute>
              <ShopSettingPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <ShopAllOrderDetails />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <SellerProtectedRoute>
              <ShopEditProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coupouns"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupoun />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="dashboard-withdraw-money"
          element={
            <SellerProtectedRoute>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          }
        />
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
        <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
          }
        ></Route>
        {/* admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <protectedAdminRoute>
              <AdminDashboardPage />
            </protectedAdminRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <protectedAdminRoute>
              <AdminDashboardUsers />
            </protectedAdminRoute>
          }
        />
        <Route
          path="/admin-sellers"
          element={
            <protectedAdminRoute>
              <AdminDashboardSellers />
            </protectedAdminRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <protectedAdminRoute>
              <AdminDashboardOrders />
            </protectedAdminRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <protectedAdminRoute>
              <AdminDashboardProducts />
            </protectedAdminRoute>
          }
        />
          <Route
          path="/admin-events"
          element={
            <protectedAdminRoute>
              <AdminDashboardEvents />
            </protectedAdminRoute>
          }
        />
         <Route
          path="/admin-withdraw-request"
          element={
            <protectedAdminRoute>
              <AdminDashboardWithdraw />
            </protectedAdminRoute>
          }
        />
        <Route
           path="/admin-reviews"
           element={
             <protectedAdminRoute>
               <AdminDashboardReviews /> {/*  the admin review dashboard */}
             </protectedAdminRoute>
           }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
