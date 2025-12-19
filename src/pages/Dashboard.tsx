import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const [, navigate] = useLocation();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <div className="mb-8">
            <h1 className="text-5xl font-medium text-[#18203c] mb-2" style={{ fontFamily: "Poppins" }}>
              Welcome back, Maria
            </h1>
            <p className="text-sm font-medium text-[#18203c]">
              Here's your MemoraCare overview
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#f1f2f9] rounded-lg p-6">
              <p className="text-xs font-medium text-[#18203c] mb-2">Protected Members</p>
              <p className="text-3xl font-bold text-[#1b4332]">7</p>
            </div>
            <div className="bg-[#f1f2f9] rounded-lg p-6">
              <p className="text-xs font-medium text-[#18203c] mb-2">Active Plans</p>
              <p className="text-3xl font-bold text-[#1b4332]">3</p>
            </div>
            <div className="bg-[#f1f2f9] rounded-lg p-6">
              <p className="text-xs font-medium text-[#18203c] mb-2">Next Payment</p>
              <p className="text-sm font-medium text-[#18203c]">Dec 15, 2025</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/members")}
              className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors"
              style={{ fontFamily: "Poppins" }}
            >
              View Protected Members
            </button>
            <button
              onClick={() => navigate("/plans")}
              className="px-8 py-3 bg-[#95d5b2] text-[#18203c] rounded-lg font-medium hover:bg-[#7dc99f] transition-colors"
              style={{ fontFamily: "Poppins" }}
            >
              Explore Plans
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h2 className="text-2xl font-medium text-[#18203c] mb-6" style={{ fontFamily: "Poppins" }}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
              <div>
                <p className="font-medium text-[#18203c]">Profile Updated</p>
                <p className="text-xs text-[#18203c]/60">2 days ago</p>
              </div>
              <span className="text-[#95d5b2] font-medium">✓</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
              <div>
                <p className="font-medium text-[#18203c]">Payment Processed</p>
                <p className="text-xs text-[#18203c]/60">5 days ago</p>
              </div>
              <span className="text-[#95d5b2] font-medium">✓</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
              <div>
                <p className="font-medium text-[#18203c]">New Member Added</p>
                <p className="text-xs text-[#18203c]/60">1 week ago</p>
              </div>
              <span className="text-[#95d5b2] font-medium">✓</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

