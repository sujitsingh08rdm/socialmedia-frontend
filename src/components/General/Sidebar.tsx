import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/auth.slice";
import { logoutUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { useState } from "react";
import { Bell, Home, LogOut, Menu, User2, X } from "lucide-react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      toast.success(response.message);
      dispatch(logout());

      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const baseClasses =
    "neo-container flex items-center justify-between px-4 py-3 hover:border";

  const activeClasses = "bg-violet-300";
  const inActiveClasses = "bg-accent-2";

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between border-r-2 border-indigo-800 shadow-indigo-900 shadow-xs">
      <div className="flex flex-col gap-2 p-2">
        <NavLink
          to="/"
          end
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inActiveClasses}`
          }
        >
          <>
            <Home />
            Home
          </>
        </NavLink>

        <NavLink
          to={`/profile/${loggedInUser?.username}`}
          end
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inActiveClasses}`
          }
        >
          <>
            <User2 />
            Profile
          </>
        </NavLink>

        <NavLink
          to="/notifications"
          end
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inActiveClasses}`
          }
        >
          <>
            <Bell />
            Notifications
          </>
        </NavLink>
      </div>

      <div className="p-4">
        <button
          className="neo-button bg-button-1 hover-bg-button-1 font-bold flex items-center gap-2 w-full justify-center"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-22 left-2 z-50 md:hidden neo-button p-2 bg-accent-1"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-[72vw]
          max-w-xs
          bg-accent-2
          z-50
          transition-transform
          duration-300
          md:hidden

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="flex bg-accent-1 justify-end p-4 border-b-2 border-black">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="neo-button p-1"
            >
              <X />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-52 lg:w-64 shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
