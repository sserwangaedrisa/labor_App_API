import type { ReactNode } from "react";
import Sidebar from "./Slidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const OwnerLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default OwnerLayout;
