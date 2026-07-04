import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import ChatContainer from "../components/ChatPageComponent/ChatContainer";

function ChatPage() {
  return (
    <div className="bg-primary overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 p-1 w-full overflow-hidden">
        <Sidebar />

        <ChatContainer />

        <Chatbar />
      </div>
    </div>
  );
}

export default ChatPage;
