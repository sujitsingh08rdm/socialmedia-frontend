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
import ProfilePage from "./pages/ProfilePage";
import UploadPostPage from "./pages/UploadPostPage";

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
    <div className="bg-primary min-h-screen">
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
          path="/profile/:username"
          element={
            <ProctectedRoute>
              <ProfilePage />
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
        <Route
          path="/upload-post"
          element={
            <ProctectedRoute>
              <UploadPostPage />
            </ProctectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
