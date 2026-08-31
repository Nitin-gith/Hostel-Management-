import { Navigate, Outlet } from "react-router-dom";

export default function StudentGuard() {
    const isLogin = localStorage.getItem("isLogin") === "true";
    const userType = localStorage.getItem("userType");

    if (!isLogin || userType !== "2") {
        // If not logged in or not a student, redirect to login page
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
