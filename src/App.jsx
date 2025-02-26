import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn, SignUp } from "./pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      {/* <Route path="/auth/*" element={<Auth />} /> */}
      {/* <Route path="/sign-up" element={<SignUp />} /> */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
  );
}

export default App;
