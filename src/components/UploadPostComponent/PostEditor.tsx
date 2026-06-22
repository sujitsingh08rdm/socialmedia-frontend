import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { FontSize } from "../../utils/FontSize";

type Props = {
  value: string | null;
  onChange: (html: string) => void;
};

function PostEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,

      Link.configure({
        openOnClick: false,
      }),

      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "min-h-[180px] p-4 outline-none prose prose-invert max-w-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL");

    if (!url) return;

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="neo-container border bg-accent-2 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b p-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border rounded ${
            editor.isActive("bold") ? "bg-black text-white" : ""
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border rounded ${
            editor.isActive("italic") ? "bg-black text-white" : ""
          }`}
        >
          I
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 border rounded ${
            editor.isActive("underline") ? "bg-black text-white" : ""
          }`}
        >
          U
        </button>

        {/* Font Size */}
        <select
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
          className="border rounded px-2 py-1"
          defaultValue=""
        >
          <option value="">Size</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="24">24px</option>
          <option value="32">32px</option>
        </select>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

export default PostEditor;
