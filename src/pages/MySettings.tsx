import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function MySettings() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h1 className="text-5xl font-medium text-[#18203c] mb-8" style={{ fontFamily: "Poppins" }}>
            My Settings
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[#f1f2f9]">
            <button
              onClick={() => setActiveTab("account")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "account"
                  ? "text-[#1b4332] border-b-2 border-[#1b4332]"
                  : "text-[#18203c]/60 hover:text-[#18203c]"
              }`}
            >
              Account Settings
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "security"
                  ? "text-[#1b4332] border-b-2 border-[#1b4332]"
                  : "text-[#18203c]/60 hover:text-[#18203c]"
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "notifications"
                  ? "text-[#1b4332] border-b-2 border-[#1b4332]"
                  : "text-[#18203c]/60 hover:text-[#18203c]"
              }`}
            >
              Notifications
            </button>
          </div>

          {/* Account Settings Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#18203c] mb-2">Email Address</label>
                <input
                  type="email"
                  value="maria@example.com"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18203c] mb-2">Phone Number</label>
                <input
                  type="tel"
                  value="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18203c] mb-2">Language Preference</label>
                <select className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]">
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors">
                Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#18203c] mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18203c] mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18203c] mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
                />
              </div>
              <div className="bg-[#f1f2f9] rounded-lg p-6">
                <h3 className="font-medium text-[#18203c] mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-[#18203c]/60 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="px-6 py-2 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors text-sm">
                  Enable 2FA
                </button>
              </div>
              <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors">
                Update Password
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
                <div>
                  <p className="font-medium text-[#18203c]">Email Notifications</p>
                  <p className="text-xs text-[#18203c]/60">Receive updates via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
                <div>
                  <p className="font-medium text-[#18203c]">Payment Reminders</p>
                  <p className="text-xs text-[#18203c]/60">Get notified before payments are due</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
                <div>
                  <p className="font-medium text-[#18203c]">Member Updates</p>
                  <p className="text-xs text-[#18203c]/60">Notify when family members are added</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors">
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

