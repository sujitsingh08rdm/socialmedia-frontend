import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import defaultImage from "../../assets/default-profileImage.png";
import { logoutUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { logout } from "../../store/slices/auth.slice";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SearchUser } from "../../types/searchUser";
import { searchUser } from "../../api/feed.api";
import { Search } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await searchUser(query);
        console.log(response);

        setResults(response);
        setOpen(true);
      } catch (error) {
        console.log("search error", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex px-6 py-2 justify-between items-center border-b-2 border-indigo-800 md:px-12 md:py-4 sticky shadow-indigo-900 shadow-xs">
      <Link
        to="/"
        className="text-2xl 2xl hover:scale-105 md:text-4xl font-black text-black neo-card bg-accent-1 inline-block"
      >
        bingeHub
      </Link>

      <div
        ref={searchRef}
        className="relative hidden md:flex w-full max-w-xl mx-8"
      >
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="neo-input w-full bg-accent-1 p-4 text-black font-medium outline-none"
        />
        {open && (
          <div className="absolute top-full mt-2 w-full neo-card bg-accent-2 max-h-80 overflow-y-auto z-50">
            {loading && (
              <div className="p-4 text-center font-bold">Searching...</div>
            )}

            {!loading && results?.length === 0 && query.trim() && (
              <div className="text-center font-bold bg-accent-2">
                No users found
              </div>
            )}

            {!loading &&
              results?.map((searchedUser) => (
                <Link
                  key={searchedUser._id}
                  to={`/profile/${searchedUser.username}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 p-2 border-b-2 border-black hover:bg-accent-2 transition-colors"
                >
                  <img
                    src={
                      searchedUser.profileImage
                        ? searchedUser.profileImage
                        : defaultImage
                    }
                    className="w-12 h-12 rounded-full object-cover border-2 border-black"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold">{searchedUser.username}</span>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      <div className="neo-container w-auto bg-accent-2 flex flex-row items-center">
        <Link
          className="p-1 border-2 border-transparent hover:border-2 hover:border-black hover:rounded-full md:p-2 gap-2 w-auto bg-accent-2 flex items-center justify-center"
          to={`/profile/${user?.username}`}
        >
          <img
            className="w-[48px] border-2 border-primary aspect-square rounded-full bg-cover object-cover"
            src={user?.profileImage ? user?.profileImage : defaultImage}
          />
          <span className="text-black font-medium">{user?.username}</span>
        </Link>{" "}
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
