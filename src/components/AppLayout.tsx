import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <AppSidebar />
    <main className="ml-60 min-h-screen">
      <div className="p-5 max-w-[1400px]">
        {children}
      </div>
    </main>
  </div>
);

export default AppLayout;
