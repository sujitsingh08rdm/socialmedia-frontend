import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Spinner from "../components/General/Spinner";
import type { JSX } from "react/jsx-runtime";
import { useState } from "react";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
