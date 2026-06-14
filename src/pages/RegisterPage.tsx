import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm";

function RegisterPage() {
  return (
    <div className="bg-primary min-h-screen flex flex-col items-center gap-6 pt-10">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-4xl  font-black text-black neo-card bg-accent-1 inline-block">
          Welcome To bingeHub
        </h1>

        <p className="mt-4  w-[80%] text-black font-medium neo-card bg-accent-2 inline-block">
          A Place to flex your movie knowledge
        </p>
      </div>

      {/* Form Container */}
      <div className="w-[90%] sm:w-1/2 md:w-1/2 neo-card bg-secondary">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">
          Create your account
        </h2>

        <RegisterUserForm />
      </div>
    </div>
  );
}

export default RegisterPage;

// function RegisterPage() {
//   return (
//     <div className="bg-[#9FA1FF] h-screen flex flex-col gap-4 md:gap-8 items-center">
//       <div className="flex flex-col items-center md:gap-4 text-primary pt-12">
//         <h1 className="md:text-4xl text-[#AEE2FF] drop-shadow-[0_0_15px_#AEE2FF] font-semibold">
//           Welcome To bingeHub.
//         </h1>
//         <p className="text-[#D9F9DF] md:text-2xl">
//           A Place to flex your movie knowledge
//         </p>
//       </div>
//       <div className="flex flex-col border border-[#D9F9DF] md:w-1/2 md:p-4 rounded-2xl">
//         <h2 className="text-[#D9F9DF] text-xl">Create your account</h2>
//         <RegisterUserForm />
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;

// function RegisterPage() {
//   return (
//     <div className="bg-[#9FA1FF] min-h-screen flex flex-col items-center gap-6 pt-10">
//       <div className="text-center">
//         <h1 className="text-4xl font-black text-black border-2 border-black bg-[#9FA1FF] px-4 py-2 shadow-[4px_4px_0px_#000]">
//           Welcome To bingeHub
//         </h1>

//         <p className="mt-4 text-black font-medium border-2 border-black bg-[#D9F9DF] px-3 py-1 inline-block shadow-[4px_4px_0px_#000]">
//           A Place to flex your movie knowledge
//         </p>
//       </div>

//       <div className="w-full md:w-1/2 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000]">
//         <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">
//           Create your account
//         </h2>

//         <RegisterUserForm />
//       </div>
//     </div>
//   );
// }
