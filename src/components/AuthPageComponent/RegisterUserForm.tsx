import { Link } from "react-router-dom";

function RegisterUserForm() {
  return (
    <form className="flex flex-col gap-4">
      {/* Username */}
      <div>
        <label className="neo-label">Username</label>
        <input
          type="text"
          placeholder="create your username"
          className="neo-input neo-input:focus bg-accent-1"
        />
      </div>

      {/* Email */}
      <div>
        <label className="neo-label">Email</label>
        <input
          type="email"
          placeholder="enter your email"
          className="neo-input neo-input:focus bg-accent-2"
        />
      </div>

      {/* Password */}
      <div>
        <label className="neo-label">Password</label>
        <input
          type="password"
          placeholder="enter your password"
          className="neo-input neo-input:focus bg-accent-1"
        />
      </div>

      {/* File Upload */}
      <div className="flex justify-between items-center">
        <div className="neo-file max-w-1/2 bg-accent-2">
          <input type="file" id="fileInput" className="hidden" />
          <div className="neo-file-display">No file chosen</div>
          <label htmlFor="fileInput" className="neo-file-btn">
            Select a file
          </label>
        </div>
        <div className="neo-container p-4 bg-accent-2 max-w-1/2">
          <p className="">
            <span>Already have an account </span>
            <Link
              className="text-blue-400 font-bold hover:font-extrabold hover:text-blue-600"
              to={"/login"}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Button */}
      <button className="neo-button bg-button-1 hover-bg-button-1 ease-in-out font-bold">
        Register your account
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
