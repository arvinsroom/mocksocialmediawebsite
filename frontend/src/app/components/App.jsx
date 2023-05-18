import AdminLogin from './Admin/AdminLogin/AdminLogin';
import UserLogin from './User/UserLogin/UserLogin';
import UserLoginWithQualtricsId from './User/UserLogin/UserLoginWithQualtricsId';
import UserResponse from './User/UserResponse/UserResponse';
import AdminPortal from './Admin/AdminPortal/AdminPortalDrawer';
import { Route, Routes } from 'react-router-dom';
import CustomSnackbar from './Common/Snackbar';
import "./App.css";

function App() {
  return (
    <>
    <div className="wrapper">
      <CustomSnackbar />
      <Routes>
        <Route path="/admin/configure" element={<AdminPortal />}></Route>
        <Route path="/admin" element={<AdminLogin />}></Route>
        <Route path="/:accessCode/user-response" element={<UserResponse />}></Route>
        <Route path="/:accessCode/participantId" element={<UserLoginWithQualtricsId />}></Route>
        <Route path="/:accessCode/:participantId" element={<UserLogin />}></Route>
        <Route path="/:accessCode?" element={<UserLogin />}></Route>
      </Routes>
    </div>
    </>
  );
}

export default App;
