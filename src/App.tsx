import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { setUser, setAuthLoad } from "./store/slices/auth.slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        console.log({ response }, "from app");

        dispatch(setUser(response.data));
      } catch (error) {
      } finally {
        dispatch(setAuthLoad());
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
