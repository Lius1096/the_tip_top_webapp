import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexHome from "./pages/Home/Index";
import Register from "./pages/Client/Register";
import LoginClient from "./pages/Client/Login";
import Dashboard from "./pages/Client/Admin/Dashboard";
import WinningHistory from "./pages/Client/Admin/WinningHistory";
import Profile from "./pages/Client/Admin/Profile";
import LoginAdmin from "./pages/Admin/Login";
import RevealYourGift from "./pages/Client/RevealYourGift";
import Congratulation from "./pages/Client/Congratulation";
import EditProfile from "./pages/Client/Admin/EditProfile";
import AdminDashboard from "./pages/Admin/Dashboard";

import EditAdminProfile from "./pages/Admin/EditProfile";
import AdminProfile from "./pages/Admin/Profile";
import UserList from "./pages/Admin/UserList";
import WinningList from "./pages/Admin/WinningList";
import AddUser from "./pages/Admin/AddUser";
import EditUser from "./pages/Admin/EditUser";
import DetailProfile from "./pages/Admin/DetailProfile";
import Cgu from "./pages/Rgpd/Cgu";
import PolitiqueDeConfidentialie from "./pages/Rgpd/PolitiqueDeConfidentialie";
import RegleDuJeu from "./pages/Rgpd/RegleDuJeu";
import Setting from "./pages/Admin/Setting";
import EmployeeList from "./pages/Admin/Employee";
import NotFound from "./pages/NotFound";
import Draw from "./pages/Admin/Draw";


const RoutesOverlay = () => {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<IndexHome />} />
        <Route path="/cgu" element={<Cgu />} />
        <Route path="/regledujeu" element={<RegleDuJeu />} />
        <Route path="/politiquedeconfidentialie" element={<PolitiqueDeConfidentialie />} />
        <Route path="client">
          <Route path="/client/register" element={<Register />} />
          <Route path="/client/login" element={<LoginClient />} />
          <Route path="/client/gift" element={<RevealYourGift />} />
          <Route path="/client/dashboard" element={<Dashboard />} />
          <Route path="/client/giveaway" element={<WinningHistory />} />
          <Route path="/client/congratulation" element={<Congratulation />} />
          <Route path="/client/profile" element={<Profile />} />
       
          <Route path="/client/edit" element={<EditProfile />} />
        </Route>

        <Route path="admin">
          <Route path="/admin" element={<LoginAdmin />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/winningList" element={<WinningList />} />
          <Route path="/admin/user" element={<UserList />} />
          <Route path="/admin/employee_list" element={<EmployeeList />} />
          <Route path="/admin/edit" element={<EditAdminProfile />} />
          <Route path="/admin/newUser" element={<AddUser />} />
          <Route path="/admin/editUser" element={<EditUser />} />
          <Route path="/admin/detailProfile" element={<DetailProfile />} />
          <Route path="/admin/settings" element={<Setting />} />
          <Route path="/admin/draw" element={<Draw />} />
        </Route>
       
        
      </Routes>
    // </BrowserRouter>
  );
};

export default RoutesOverlay;
