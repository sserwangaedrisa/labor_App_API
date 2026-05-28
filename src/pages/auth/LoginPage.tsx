import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import authorizePatchRequestWOT from "../../api/authorizePatchRequestWOT";
import authorizePostRequestWOT from "../../api/authorizePostRequestWOT";
import { motion } from "framer-motion";
import { useAuth } from "../../app/providers";
import type { User, Tokens } from "../../app/providers";
import authorizePostRequest from "../../api/authorizePostRequest";
import toast from "react-hot-toast";

interface LoginResponse {
  user: User;
  tokens: Tokens;
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
  status?: string;
}

interface verificationData {
  userId?: string;
  otp?: string;
  email?: string;
  newPassword?: string;
}

interface VerifyAccountResponse {
  status: string;
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [isErr, setIsErr] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [verifyOtp, setVerifyOtp] = useState<boolean>(false);
  const [verificationData, setVerificationData] = useState<verificationData>(
    {},
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setIsErr(false);
    setMsg("");

    try {
      // STEP 1: SEND OTP
      if (verifyEmail) {
        const response = await authorizePostRequest<VerifyAccountResponse>(
          "users/verifyEmail",
          verificationData,
        );

        if (response.status === "success") {
          console.log("Password reset OTP sent successfully");
          toast.success(response.message);
          setVerificationData({
            ...verificationData,
            userId: response.user?.id,
          });
          setMsg(response.message);
          setVerifyEmail(false);
          setVerifyOtp(true);
          setNewPassword(false);
        } else {
          console.log("Failed to send password reset OTP");
          toast.error(response.message);
        }
        return;
      }

      // STEP 2: VERIFY OTP
      if (verifyOtp) {
        const response = await authorizePostRequest<VerifyAccountResponse>(
          "users/verify-account",
          verificationData,
        );

        if (response.status === "success") {
          console.log("Email verified successfully");
          toast.success(
            "OTP verified successfully, you can now set a new password",
          );
          setMsg("OTP verified successfully, you can now set a new password");
          setVerificationData({ ...verificationData, otp: "" });
          setVerifyEmail(false);
          setVerifyOtp(false);
          setNewPassword(true);
        } else if (response.status === "expired") {
          console.log("OTP expired");
          setVerificationData({ ...verificationData, otp: "" });
          toast.error(response.message);
          setMsg("OTP expired, please request a new one");
          setVerifyEmail(true);
          setVerifyOtp(false);
          setNewPassword(false);
        } else {
          console.log("Email verification failed");
          toast.error(response.message);
        }
        return;
      }

      // STEP 3: RESET PASSWORD
      if (newPassword) {
        const response = await authorizePatchRequestWOT<ForgotPasswordResponse>(
          "users/resetPassword",
          verificationData,
        );

        if (response.status === "success") {
          console.log("Password reset successfully");
          toast.success(response.message);
          setMsg(
            "Password reset successfully, you can now log in with your new password",
          );
          setVerificationData({ email: "", newPassword: "" });
          setNewPassword(false);
          setVerifyEmail(false);
          setVerifyOtp(false);
        }

        setMsg(response.message);
        setIsErr(false);

        return;
      }

      // STEP 4: LOGIN
      const response = await authorizePostRequestWOT<LoginResponse>(
        "users/login",
        { email: verificationData.email, password },
      );

      const { user, tokens, message } = response;

      const allowedRoles = ["OWNER", "FOREMAN", "LABORER"];

      if (user && allowedRoles.includes(user.role || "")) {
        login(user, tokens);
        setMsg(message);
        setIsErr(false);

        if (user.role === "FOREMAN") {
          navigate("/foreman/dashboard");
        } else if (user.role === "LABORER") {
          navigate("/laborer");
        } else if (user.role === "OWNER") {
          navigate("/owner/dashboard");
        }
      } else {
        setMsg("Unauthorized role, you are not permitted to use this platform");
        setIsErr(true);
      }
    } catch (error) {
      console.error(error);

      setMsg("Something went wrong, please try again");
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
            alt="AILAMA LABOR SUPPLY"
            className="mx-auto h-20 w-auto rounded-full shadow-md"
          />

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {verifyEmail && "Reset Password"}
            {verifyOtp && "Verify OTP"}
            {newPassword && "Set New Password"}
            {!verifyEmail && !verifyOtp && !newPassword && "Welcome Back"}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {!verifyEmail && !verifyOtp && !newPassword
              ? "Sign in to continue to your account"
              : "Follow the steps to reset your password. Submit your email to receive an OTP, then verify the OTP and set a new password."}
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

            <div className="rounded-md shadow-sm mb-8 space-y-4">
              {/* FORGOT PASSWORD VERIFICATION EMAIL INPUT */}
              {(verifyEmail || !verifyEmail) && !verifyOtp && !newPassword && (
                <input
                  name="email"
                  value={verificationData.email}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Email address"
                />
              )}

              {/* PASSWORD INPUT (LOGIN) */}
              {!verifyEmail && !verifyOtp && !newPassword && (
                <input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Password"
                />
              )}

              {/* OTP INPUT */}
              {verifyOtp && (
                <input
                  name="otp"
                  value={verificationData.otp}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      otp: e.target.value,
                    })
                  }
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter OTP"
                />
              )}

              {/* NEW PASSWORD INPUT */}
              {newPassword && (
                <input
                  name="newPassword"
                  value={verificationData.newPassword}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      newPassword: e.target.value,
                    })
                  }
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="New Password"
                />
              )}
            </div>

            {/* FORGOT PASSWORD BUTTON */}
            {!verifyEmail && !verifyOtp && !newPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setVerifyEmail(true)}
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* BACK TO LOGIN */}
            {(verifyEmail || verifyOtp || newPassword) && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setVerifyEmail(false);
                    setVerifyOtp(false);
                    setNewPassword(false);
                  }}
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  ← Back to Login
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {!verifyEmail && !verifyOtp && !newPassword && "Sign In"}
              {verifyEmail && "Send OTP"}
              {verifyOtp && "Verify OTP"}
              {newPassword && "Reset Password"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
