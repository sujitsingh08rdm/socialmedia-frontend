import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Spinner from "../components/General/Spinner";
import { logout } from "../store/slices/auth.slice";
import { logoutUser } from "../api/auth.api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
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
    <div className="bg-primary min-h-screen flex flex-col items-center gap-6 pt-10">
      {user ? (
        <div className="w-full md:w-1/2 neo-card bg-secondary">
          <h2>{user?.username}</h2>
          <button
            onClick={handleLogout}
            className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold"
          >
            Logout
          </button>
        </div>
      ) : (
        <h2>You are not logged in</h2>
      )}
    </div>
  );
}

export default HomePage;
