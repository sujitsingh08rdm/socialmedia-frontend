import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import ChatContainer from "../components/ChatPageComponent/ChatContainer";
import NotificationComponent from "../components/NotificationComponent/NotificationComponent";

function NotificationPage() {
  return (
    <div className="bg-primary overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 p-1 w-full overflow-hidden">
        <Sidebar />

        <NotificationComponent />

        <Chatbar />
      </div>
    </div>
  );
}

export default NotificationPage;
