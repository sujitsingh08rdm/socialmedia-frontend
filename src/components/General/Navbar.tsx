import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import defaultImage from "../../assets/default-profileImage.png";
import { logoutUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { logout } from "../../store/slices/auth.slice";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [serverError, setServerError] = useState<string | null>(null);
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

  return (
    <nav className="flex px-6 py-2 justify-between items-center border-b-2 border-indigo-800 md:px-12 md:py-4 sticky shadow-indigo-900 shadow-xs">
      <Link
        to="/"
        className="text-2xl 2xl md:text-4xl font-black text-black neo-card bg-accent-1 inline-block"
      >
        bingeHub
      </Link>
      <div className="neo-container w-auto bg-accent-2 flex flex-row items-center">
        <div className="p-1 md:p-2 gap-2 w-auto bg-accent-2 flex items-center justify-center">
          <img
            className="w-[48px] border-2 border-primary aspect-square rounded-full bg-cover"
            src={user?.profileImage ? user?.profileImage : defaultImage}
          />
          <span className="text-black font-medium">{user?.username}</span>
        </div>
        <div className="p-1 md:p-2">
          <button
            type="submit"
            className="neo-button p-0.5 md:p-1 bg-button-1 hover-bg-button-1 ease-in-out font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
