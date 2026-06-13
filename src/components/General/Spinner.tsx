import { ClipLoader } from "react-spinners";

type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 16 }: SpinnerProps) {
  return <ClipLoader size={size} />;
}
