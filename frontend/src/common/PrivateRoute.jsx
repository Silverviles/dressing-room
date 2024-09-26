import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {

    const user = useSelector((state) => state.user);

    if (user.user === null) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
}

export default PrivateRoute;
