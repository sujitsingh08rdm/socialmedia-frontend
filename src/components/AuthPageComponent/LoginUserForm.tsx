import { Link } from "react-router-dom";

function LoginUserForm() {
  return (
    <form className="flex flex-col gap-4">
      {/* Username */}
      <div>
        <label className="neo-label">Username/Email</label>
        <input
          type="text"
          placeholder="Enter your username/email"
          className="neo-input neo-input:focus bg-accent-1"
        />
      </div>

      {/* Password */}
      <div>
        <label className="neo-label">Password</label>
        <input
          type="password"
          placeholder="enter your password"
          className="neo-input neo-input:focus bg-accent-2"
        />
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
      <button className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold">
        Login
      </button>
    </form>
  );
}

export default LoginUserForm;
