import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { setUser, setAuthLoad } from "./store/slices/auth.slice";
import ProctectedRoute from "./routes/ProctectedRoute";
import PublicRoute from "./routes/PublicRoute";
import FeedPage from "./pages/FeedPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();

        dispatch(setUser(response.data));
      } catch (error) {
      } finally {
        dispatch(setAuthLoad());
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <div className="bg-primary h-screen">
      <Routes>
        <Route
          index
          element={
            <ProctectedRoute>
              <FeedPage />
            </ProctectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
