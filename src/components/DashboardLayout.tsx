import { useLocation } from "wouter";
import { LayoutDashboard, User, Users, Zap, CreditCard, HelpCircle, Settings, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, navigate] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/members", label: "Protected Members", icon: Users },
    { href: "/plans", label: "Life Plans", icon: Zap },
    { href: "/payments", label: "Life Payments", icon: CreditCard },
    { href: "/help", label: "Help Center", icon: HelpCircle },
    { href: "/settings", label: "My Settings", icon: Settings },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen bg-[#faf3e0] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#d4a574] text-[#18203c] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl font-bold">
            MT
          </div>
          <div>
            <h2 className="font-semibold text-sm">Maria Thompson</h2>
            <p className="text-xs text-[#18203c]/60">Welcome to your Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-[#1b4332] text-white"
                    : "text-[#18203c] hover:bg-[#c99a6e]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-3">
          <button className="w-full bg-[#1b4332] text-white py-2 rounded-lg font-medium text-sm hover:bg-[#0f2818] transition-colors flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-[#18203c] py-2 rounded font-medium text-xs hover:bg-gray-100 transition-colors">
              English
            </button>
            <button className="flex-1 bg-[#c99a6e] text-[#18203c] py-2 rounded font-medium text-xs hover:bg-[#b8885d] transition-colors">
              Español
            </button>
          </div>
          <p className="text-xs text-[#18203c]/50 text-center">
            © 2025 Memoracare | Privacy Policy
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

