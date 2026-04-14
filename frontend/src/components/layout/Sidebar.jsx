import { LayoutDashboard, Wallet } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 p-5 hidden md:flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-white">
        SwiftSpend
      </h1>

      <nav className="space-y-4 text-gray-300">
        <div className="flex items-center gap-3 hover:text-white cursor-pointer">
          <LayoutDashboard size={18} />
          Dashboard
        </div>

        <div className="flex items-center gap-3 hover:text-white cursor-pointer">
          <Wallet size={18} />
          Transactions
        </div>
      </nav>
    </div>
  );
}