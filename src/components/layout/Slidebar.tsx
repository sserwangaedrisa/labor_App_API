// import { Link } from "react-router-dom";
// import { useAuth } from "../../app/providers";

// const Sidebar = () => {
//   const { user } = useAuth();

//   if (!user) return null;

//   const menuItems = {
//     laborer: [
//       { label: "Dashboard", path: "/laborer/dashboard" },
//       { label: "Labor Card", path: "/laborer/labor-card" },
//       { label: "Payment History", path: "/laborer/payment-history" },
//     ],
//     foreman: [
//       { label: "Dashboard", path: "/foreman/dashboard" },
//       { label: "Workers", path: "/foreman/workers" },
//       { label: "Add Daily Record", path: "/foreman/add-daily-record" },
//       { label: "Payments", path: "/foreman/payments" },
//     ],
//     owner: [
//       { label: "Dashboard", path: "/owner/dashboard" },
//       { label: "Sites", path: "/owner/sites" },
//       { label: "Workers", path: "/owner/workers" },
//       { label: "Payments", path: "/owner/payments" },
//       { label: "Reports", path: "/owner/reports" },
//       { label: "Settings", path: "/owner/settings" },
//     ],
//   };

//   return (
//     <aside className="w-60 bg-gray-100 h-screen p-4">
//       <ul className="flex flex-col gap-2">
//         {menuItems[user.role].map((item) => (
//           <li key={item.path}>
//             <Link
//               to={item.path}
//               className="block p-2 rounded hover:bg-gray-200"
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;
