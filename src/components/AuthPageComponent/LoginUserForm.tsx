import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../schemas/auth.schema";
import type { LoginUserFormData } from "../../schemas/auth.schema";
import { useEffect, useState } from "react";
import { loginUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import Spinner from "../General/Spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/auth.slice";

function LoginUserForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<LoginUserFormData>({ resolver: zodResolver(loginUserSchema) });

  const onSubmit = async (data: LoginUserFormData) => {
    // data.indentifier =username or email
    try {
      setLoading(true);
      setServerError(null);
      const response = await loginUser(data);

      dispatch(setUser(response.data.user));
      toast.success(response.message);
      reset();
      navigate("/home");
    } catch (error: any) {
      console.log("Catch block hit:", error);
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
        <label className="neo-label">Username/Email</label>
        <input
          {...register("identifier")}
          onChange={() => clearErrors("identifier")}
          type="text"
          placeholder="Enter your username/email"
          className="neo-input neo-input:focus bg-accent-1"
        />
        {errors.identifier && (
          <p className={`neo-error neo-error-animate`}>
            {errors.identifier.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="neo-label">Password</label>
        <input
          {...register("password")}
          onChange={() => clearErrors("password")}
          type="password"
          placeholder="Enter your password"
          className="neo-input neo-input:focus bg-accent-2"
        />
        {errors.password && (
          <p className={`neo-error neo-error-animate`}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="mt-2 p-1">
        <p className="neo-container bg-accent-2">
          Don't have an account{" "}
          <Link
            className="text-blue-400 font-bold hover:font-extrabold hover:text-blue-600"
            to={"/register"}
          >
            Register here
          </Link>
        </p>
      </div>
      {serverError && (
        <div className="neo-error neo-error-animate">{serverError}</div>
      )}
      {/* Button */}
      <button
        type="submit"
        className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold"
      >
        {loading ? <Spinner /> : "Login"}
      </button>
    </form>
  );
}

export default LoginUserForm;
