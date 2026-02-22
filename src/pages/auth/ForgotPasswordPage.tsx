import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/input";
import Button from "../../components/ui/Button";

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!phone) throw new Error("Phone number is required.");

      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      setSuccess(
        `Password reset instructions sent to ${phone}. Check SMS or email.`,
      );
      setPhone("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset instructions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <Input
          placeholder="Phone / Email"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Instructions"}
        </Button>

        <p className="mt-4 text-sm text-center">
          <Link to="/auth/login" className="text-blue-600">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
