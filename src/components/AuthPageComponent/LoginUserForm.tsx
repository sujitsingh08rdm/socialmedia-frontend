import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../schemas/auth.schema";
import type { LoginUserFormData } from "../../schemas/auth.schema";
import { useEffect, useState } from "react";

function LoginUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginUserFormData>({ resolver: zodResolver(loginUserSchema) });

  const onSubmit = (data: LoginUserFormData) => {
    console.log(data);
    // data.indentifier =username or email
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
      {/* Button */}
      <button
        type="submit"
        className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold"
      >
        Login
      </button>
    </form>
  );
}

export default LoginUserForm;
