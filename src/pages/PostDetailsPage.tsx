import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import PostDetailContainer from "../components/PostDetailsComponent/PostDetailContainer";
import { useParams } from "react-router-dom";

function PostDetailsPage() {
  const { postId } = useParams<{
    postId: string;
  }>();

  return (
    <div className="bg-primary overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 p-1 w-full overflow-hidden">
        <Sidebar />

        <PostDetailContainer postId={postId} />

        <Chatbar />
      </div>
    </div>
  );
}

export default PostDetailsPage;
