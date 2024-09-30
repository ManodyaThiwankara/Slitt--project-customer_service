import React from 'react';
import AllReviews from "../components/Admin/AllReviews.jsx"; // Import your AllReviews component
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import AdminHeader from '../components/Layout/AdminHeader';

const AdminDashboardReviews = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={5} /> {/* Adjust the active prop according to your sidebar setup */}
          </div>
          <AllReviews /> {/* This will render the AllReviews component */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardReviews;
