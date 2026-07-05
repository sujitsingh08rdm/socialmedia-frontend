import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/auth.slice";
import { logoutUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { useState } from "react";
import { Bell, Home, LogOut, User2 } from "lucide-react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

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

  const baseClasses =
    "neo-container flex items-center justify-between px-4 hover:border";

  const activeClasses = "bg-violet-300";
  const inActiveClasses = "bg-accent-2";

  return (
    <div className="h-full w-65 shrink-0 border-r-2 border-indigo-800 shadow-indigo-900 shadow-xs flex flex-col items-center justify-between">
      <div className="flex gap-2 flex-col w-full">
        <NavLink
          to={`/`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inActiveClasses}`
          }
        >
          <Home /> Home
        </NavLink>
        <NavLink
          to={`/profile/${loggedInUser?.username}`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inActiveClasses}`
          }
        >
          <User2 /> Profile
        </NavLink>
        <NavLink
          to={`/notifications`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inActiveClasses}`
          }
        >
          <Bell /> Notifications
        </NavLink>
      </div>
      <div className="p-1 md:p-4 p2">
        <button
          type="submit"
          className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold flex items-center justify-between"
          onClick={handleLogout}
        >
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
}
