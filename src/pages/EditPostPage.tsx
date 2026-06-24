import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import EditPostContainer from "../components/EditPostComponent/EditPostContainer";

function EditPostPage() {
  return (
    <div className="bg-primary overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 p-1 w-full overflow-hidden">
        <Sidebar />

        <EditPostContainer />

        <Chatbar />
      </div>
    </div>
  );
}

export default EditPostPage;
