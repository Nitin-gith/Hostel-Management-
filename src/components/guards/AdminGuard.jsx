import { Navigate, Outlet } from "react-router-dom";

export default function AdminGuard() {
    const isLogin = localStorage.getItem("isLogin") === "true";
    const userType = localStorage.getItem("userType");

    if (!isLogin || userType !== "1") {
        // If not logged in or not an admin, redirect to login page
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
