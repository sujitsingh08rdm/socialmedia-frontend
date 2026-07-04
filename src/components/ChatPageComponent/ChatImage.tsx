import { useState } from "react";
import Spinner from "../General/Spinner";

export const ChatImage = ({ src }: { src: string }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-fit">
      <div className="relative min-h-[180px] min-w-[180px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border-2 bg-transparent">
            <Spinner size={24} />
          </div>
        )}

        <img
          src={src}
          onLoad={() => setLoading(false)}
          className={`rounded-xl border-2 max-h-72 object-cover transition-opacity duration-200 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
};
