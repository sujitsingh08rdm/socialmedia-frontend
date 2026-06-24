import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import PostEditor from "../UploadPostComponent/PostEditor";
import { useEffect, useRef, useState } from "react";
import { editPost, getUserPostById } from "../../api/post.api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

function EditPostContainer() {
  const { postId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleUpdatePost = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      await editPost(formData, postId!);
      toast.success("Post updated successfully");
      navigate(`/profile/${user?.username}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        if (!postId) {
          toast.error("Post not found");
        }
        const res = await getUserPostById(postId!);

        setContent(res.data.content);
        setExistingImage(res.data.image);
      } catch (error) {
        console.error(error);
      }
    };

    getPost();
  }, [postId]);

  return (
    <div className="min-w-[63vw] p-2 flex flex-col user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
      <div className="neo-card bg-accent-1 mb-4">
        <h2 className="text-xl font-black uppercase tracking-wide">
          Edit Post
        </h2>
        <p className="text-sm opacity-70">
          Share your thoughts with the Film community.
        </p>
      </div>
      {/* TIP TAP TEXT EDITOR */}
      <div className="neo-card bg-accent-2">
        <p className="font-medium">Enter Post Content</p>
        <PostEditor value={content} onChange={setContent} />
      </div>

      <div className="neo-card bg-accent-1 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold">Attach Image</p>

          {image && existingImage && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="neo-button cursor-pointer bg-red-400 px-2 py-1 text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          id="fileInput"
          ref={fileInputRef}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setImage(file);
          }}
        />

        {!image && !existingImage ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="neo-file-display flex-1 min-w-0 truncate">
              No image selected
            </div>

            <label
              htmlFor="fileInput"
              className="neo-button bg-button-1 cursor-pointer text-center"
            >
              Choose Image
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={image ? URL.createObjectURL(image) : existingImage}
              alt="preview"
              className="w-20 h-20 object-cover border-2 border-black shrink-0"
              onError={() => console.log("image failed")}
              onLoad={() => console.log("image loaded")}
            />

            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">
                {image ? image.name : "Current Image"}
              </p>

              {image && (
                <p className="text-xs opacity-70">
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            <label
              htmlFor="fileInput"
              className="neo-button bg-button-1 cursor-pointer text-center text-sm"
            >
              Replace
            </label>
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleUpdatePost}
        disabled={loading}
        className="
    neo-button
    mt-4
    py-3
    text-lg
    font-black
    bg-button-2
    hover:translate-x-0.5
    hover:translate-y-0.5
    transition-all
    disabled:opacity-50
  "
      >
        {loading ? <Spinner /> : "EDIT"}
      </button>
    </div>
  );
}

export default EditPostContainer;
