import { Link } from "react-router-dom";
import { useAuth } from "../../app/providers";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">LaborApp</Link>
      <div className="flex items-center gap-4">
        {user && <span>Hello, {user.id}</span>}
        {user && (
          <button onClick={logout} className="underline">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
