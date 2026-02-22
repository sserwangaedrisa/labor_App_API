import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../app/providers";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      if (!phone || !password) {
        throw new Error("Phone and password are required.");
      }

      // Dummy login logic
      if (phone === "2") {
        login({
          id: "2",
          name: "Foreman ",
          phone,
          role: "foreman",
          siteId: "site-123",
        });
        navigate("/foreman/dashboard");
      } else if (phone === "3") {
        login({
          id: "3",
          name: "owner",
          phone: "2",
          role: "owner",
          siteId: "site-123",
        });
        navigate("/owner/dashboard");
      } else {
        login({
          id: "1",
          name: "Worker one",
          phone,
          role: "laborer",
          siteId: "site-123",
        });
        navigate("/laborer/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <Input
          placeholder="Phone / ID"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full mt-2">
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="mt-4 text-sm text-center">
          <Link to="/auth/forgot-password" className="text-blue-600">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
