import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Spinner from "../components/General/Spinner";
import { logout } from "../store/slices/auth.slice";
import { logoutUser } from "../api/auth.api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";

function FeedPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      toast.success(response.message);
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary z-50">
        <Spinner size={78} />
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <div className="container flex">
        <Sidebar />
        <div>
          <h1>This is the feed page</h1>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
