import { useEffect, useState } from "react";
import type {ReactNode} from "react";
interface ToastProps {
  message: ReactNode;
  duration?: number; // in ms
}

const Toast = ({ message, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
};

export default Toast;
