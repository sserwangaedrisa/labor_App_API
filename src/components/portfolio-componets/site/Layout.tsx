import React from "react";
import { Outlet } from "react-router-dom";
import type { JSX } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import ScrollProgress from "./ScrollProgress";
import RequestManpowerModal from "./RequestManpowerModal";

const Layout: React.FC = (): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-titanium">
      <ScrollProgress />

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <FloatingActions />
      <RequestManpowerModal />
    </div>
  );
};

export default Layout;
