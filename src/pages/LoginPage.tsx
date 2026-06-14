import LoginUserForm from "../components/AuthPageComponent/LoginUserForm";

function LoginPage() {
  return (
    <div className="bg-primary min-h-screen flex flex-col items-center gap-6 pt-10">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-4xl font-black text-black neo-card bg-accent-1 inline-block">
          Welcome To bingeHub
        </h1>

        <p className="mt-4 w-[80%] text-black font-medium neo-card bg-accent-2 inline-block">
          A Place to flex your movie knowledge
        </p>
      </div>

      {/* Form Container */}
      <div className="w-[90%] sm:w-1/2 md:w-1/2 neo-card bg-secondary">
        <h2 className="text-xl md:text-2xl font-bold mb-4 border-b-2 border-black pb-2">
          Login to your account
        </h2>

        <LoginUserForm />
      </div>
    </div>
  );
}

export default LoginPage;
