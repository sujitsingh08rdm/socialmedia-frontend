import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUserSchema,
  type RegisterUserFormData,
} from "../../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { registerUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import Spinner from "../General/Spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/auth.slice";

function RegisterUserForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("No file chosen");
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = async (data: RegisterUserFormData) => {
    console.log(data, "data");
    try {
      setLoading(true);
      setServerError(null);

      const response = await registerUser(data);

      toast.success("Account created successfully");
      reset();

      navigate("/login");
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;

    const timer = setTimeout(() => {
      clearErrors();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errors, clearErrors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Username */}
      <div>
        <label className="neo-label">Username</label>
        <input
          {...register("username")}
          onChange={() => {
            clearErrors("username");
          }}
          type="text"
          placeholder="create your username"
          className="neo-input neo-input:focus bg-accent-1"
        />
        {errors.username && (
          <p className={`neo-error neo-error-animate`}>
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="neo-label">Email</label>
        <input
          {...register("email")}
          onChange={() => {
            clearErrors("email");
          }}
          type="email"
          placeholder="enter your email"
          className="neo-input neo-input:focus bg-accent-2"
        />
        {errors.email && (
          <p className={`neo-error neo-error-animate`}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="neo-label">Password</label>
        <input
          {...register("password")}
          onChange={() => {
            clearErrors("password");
          }}
          type="password"
          placeholder="enter your password"
          className="neo-input neo-input:focus bg-accent-1"
        />
        {errors.password && (
          <p className={`neo-error neo-error-animate`}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        {/* File Upload */}
        <div className="w-full lg:flex-1 min-w-0">
          <div className="neo-file w-full bg-accent-2">
            <input
              // {...register("profileImage")}
              onChange={(e) => {
                const files = e.target.files;

                if (!files || files.length === 0) return;

                console.log(files);

                const fileName = files[0].name;
                clearErrors("profileImage");

                setValue("profileImage", files, { shouldValidate: true });
                setFileName(fileName);
              }}
              accept="image/*"
              type="file"
              id="fileInput"
              className="hidden"
            />
            <div className="flex w-full flex-row gap-2">
              <div className="neo-file-display flex-1  min-w-0 truncate">
                {fileName}
              </div>
              <label htmlFor="fileInput" className="neo-file-btn sm:w-auto">
                Upload Image
              </label>
            </div>
          </div>
          {errors.profileImage && (
            <p className={`neo-error mt-1 neo-error-animate`}>
              {errors.profileImage.message}
            </p>
          )}
        </div>
        <div className="neo-container bg-accent-2 flex-1 whitespace-nowrap p-4">
          <span>Already have an account </span>
          <Link
            className="text-blue-400 font-bold hover:font-extrabold hover:text-blue-600"
            to={"/login"}
          >
            Login here
          </Link>
        </div>
      </div>

      {/* Button */}
      {serverError && (
        <div className="neo-error neo-error-animate">{serverError}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold cursor-pointer"
      >
        {loading ? <Spinner /> : "Register your account"}
      </button>
    </form>
  );
}

export default RegisterUserForm;

// function RegisterUserForm() {
//   return (
//     <form className="border border-[#AEE2FF] rounded p-2 flex flex-col mg:gap-4">
//       <div className="flex flex-col p-1 md:gap-2">
//         <label className="text-[#AEE2FF] pl-1">Username</label>
//         <input
//           type="text"
//           placeholder="create your username"
//           className="text-[#AEE2FF] md:p-1 border rounded"
//         />
//       </div>
//       <div className="flex flex-col  p-1 md:gap-2">
//         <label className="text-[#AEE2FF] pl-1">Email</label>
//         <input
//           type="email"
//           placeholder="enter your email"
//           className="text-[#AEE2FF] md:p-1 border rounded"
//         />
//       </div>
//       <div className="flex flex-col  p-1 md:gap-2">
//         <label className="text-[#AEE2FF] pl-1">Password</label>
//         <input
//           type="password"
//           placeholder="enter your password"
//           className="text-[#AEE2FF] md:p-1 border rounded"
//         />
//       </div>
//       <div className="flex flex-col  p-1 md:gap-2">
//         <label className="text-[#AEE2FF] pl-1">Upload your avatar</label>
//         <input
//           type="file"
//           className="text-[#AEE2FF] md:p-1 border rounded hover:bg-[#b5baff]"
//         />
//       </div>
//       <button className="bg-[#b5baff] text-[#AEE2FF] md:py-2 rounded-xl cursor-pointer hover:text-[#b5baff] hover:bg-[#AEE2FF]">
//         Register your account
//       </button>
//     </form>
//   );
// }

// export default RegisterUserForm;
