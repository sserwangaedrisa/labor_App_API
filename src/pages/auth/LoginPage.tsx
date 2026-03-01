import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import authorizePatchRequestWOT from "../../api/authorizePatchRequestWOT";
import authorizePostRequestWOT from "../../api/authorizePostRequestWOT";
import { motion } from "framer-motion";
import { useAuth } from "../../app/providers";
import type { User, Tokens } from "../../app/providers";

interface LoginResponse {
  user: User;
  tokens: Tokens;
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgotPWD, setForgotPWD] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [isErr, setIsErr] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsErr(false);
    setMsg("");

    try {
      if (forgotPWD) {
        const response = await authorizePatchRequestWOT<ForgotPasswordResponse>(
          "users/forgotPassword",
          { email },
        );
        setMsg(response.message);
        setIsErr(false);
      } else {
        const response = await authorizePostRequestWOT<LoginResponse>(
          "users/login",
          { email, password },
        );

        const { user, tokens, message } = response;
        const allowedRoles = ["OWNER", "FOREMAN", "LABORER"];

        if (user && allowedRoles.includes(user.role || "")) {
          login(user, tokens);
          setMsg(message);
          setIsErr(false);
          if (user?.role === "FOREMAN") {
            navigate("/foreman/dashboard");
          } else if (user?.role === "LABORER") {
            navigate("/laborer");
          } else if (user?.role === "OWNER") {
            navigate("/owner/dashboard");
          }
        } else {
          setMsg(
            "Unauthorized role, you are not permitted to use this platform",
          );
          setIsErr(true);
        }
      }
    } catch (error) {
      // Type-safe error handling
      const errorMessage =
        error?.message || "Something went wrong, please try again";
      setMsg(errorMessage);
      setIsErr(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <img
            src="../../assets/logo.png"
            alt="logo"
            className="mx-auto h-20 w-auto rounded-full shadow-md"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your account
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-md p-4 ${
                  isErr
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
                role="alert"
              >
                {msg}
              </motion.div>
            )}
            <div className="rounded-md shadow-sm mb-8 -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              {!forgotPWD && (
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              )}
            </div>

            {!forgotPWD && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setForgotPWD(true)}
                  className="text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {forgotPWD && (
              <div className="flex items-center justify-start mb-4">
                <button
                  type="button"
                  onClick={() => setForgotPWD(false)}
                  className="text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:underline transition duration-150 ease-in-out flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Login
                </button>
              </div>
            )}
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
              >
                {forgotPWD ? "Reset Password" : "Sign in"}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
