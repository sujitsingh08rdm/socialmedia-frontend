import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Spinner from "../components/General/Spinner";

function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Spinner size={78} />
      </div>
    );
  }

  return (
    <div>
      {user ? <h2>{user?.username}</h2> : <h2>You are not logged in</h2>}
    </div>
  );
}

export default HomePage;
