import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import UserProfileContainer from "../components/ProfilePageComponent/UserProfileContainer";

function ProfilePage() {
  return (
    <div className="bg-primary overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 p-1 w-full overflow-hidden">
        <Sidebar />

        <UserProfileContainer />

        <Chatbar />
      </div>
    </div>
  );
}

export default ProfilePage;
