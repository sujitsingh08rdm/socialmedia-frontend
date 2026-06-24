import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createPost } from "../../api/post.api";
import PostEditor from "./PostEditor";
import Spinner from "../General/Spinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

function UploadPostContainer() {
  const [content, setContent] = useState<string | null>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFilename, setImageFilename] = useState<string | undefined | null>(
    null,
  );
  const [previewImage, setPreviewImage] = useState<string | undefined | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCreatePost = async () => {
    if (!content || content === "<p></p>") {
      toast.error("Post Content Cannot Be Empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }
      setLoading(true);
      await createPost(formData);
      toast.success("Post uploaded Succesfully");

      setContent(null);
      setImage(null);
      setImageFilename(null);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!image) {
      setPreviewImage(null);
      return;
    }

    const url = URL.createObjectURL(image);

    setPreviewImage(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <div className="min-w-[63vw] p-2 flex flex-col user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
      <div className="neo-card bg-accent-1 mb-4">
        <h2 className="text-xl font-black uppercase tracking-wide">
          Create Post
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

      {/* Image */}

      {/* My way or highway */}
      {/* <div className="neo-card bg-accent-3 mt-4 bg-accent-1">
        <p className="font-bold mb-2">Attach Image</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="neo-file-display flex-1 min-w-0 truncate">
            {imageFilename || "No image selected"}
          </div>

          <label
            htmlFor="fileInput"
            className="neo-button bg-button-1 cursor-pointer text-center"
          >
            Choose Image
          </label>
        </div>
      </div> */}

      {/* {image && (
        <div className="neo-card bg-accent-1 mt-4">
          <div className="font-bold mb-2">Preview</div>

          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-full object-cover"
          />
        </div>
      )} */}

      <div className="neo-card bg-accent-1 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold">Attach Image</p>

          {image && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImageFilename(null);
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
            setImageFilename(file.name);
          }}
        />

        {!image ? (
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
              src={previewImage || ""}
              alt="preview"
              className="w-20 h-20 object-cover border-2 border-black shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{image.name}</p>

              <p className="text-xs opacity-70">
                {(image.size / 1024 / 1024).toFixed(2)} MB
              </p>
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
        onClick={handleCreatePost}
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
        {loading ? <Spinner /> : "POST"}
      </button>
    </div>
  );
}

export default UploadPostContainer;
