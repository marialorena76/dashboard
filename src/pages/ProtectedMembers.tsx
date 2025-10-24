import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProtectedMembers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);

  const members = [
    { id: 1, name: "Daniel Thompson", relationship: "Spouse", status: "PROTECTED" },
    { id: 2, name: "Anna Thompson", relationship: "Child", status: "PROTECTED" },
    { id: 3, name: "José Martinez", relationship: "Parent", status: "PROTECTED" },
    { id: 4, name: "Robert Smith", relationship: "Cousin", status: "PROTECTED" },
    { id: 5, name: "Susan Thompson", relationship: "Grandparent", status: "PROTECTED" },
    { id: 6, name: "John Thompson", relationship: "Grandparent", status: "PROTECTED" },
    { id: 7, name: "Lucía Gonzalez", relationship: "Family Friend", status: "PROTECTED" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Protected Members Card */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <div className="mb-8">
            <h1 className="text-5xl font-medium text-[#18203c] mb-2" style={{ fontFamily: "Poppins" }}>
              Protected Members
            </h1>
            <p className="text-sm font-medium text-[#18203c]">
              Manage the loved ones you wish to include in your coverage
            </p>
          </div>

          {/* Who's Protected Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-[#18203c] mb-4" style={{ fontFamily: "Poppins" }}>
              Who's Protected
            </h2>

            {/* Controls */}
            <div className="bg-[#f1f2f9] rounded-lg p-4 mb-6 flex items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#18203c]">Show</span>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                  className="px-2 py-1 bg-white rounded-lg border border-[#4b4e4d]/60 text-xs font-medium text-[#18203c]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm font-medium text-[#18203c]">entries</span>
              </div>

              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-3 w-4 h-4 text-[#18203c]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#faf3e0] text-base text-[#18203c] placeholder-[#18203c]/40"
                  />
                </div>
              </div>

              <button className="bg-[#1b4332] text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-[#0f2818] transition-colors">
                + Add Member
              </button>
            </div>

            {/* Table Header */}
            <div className="bg-white border-b border-[#f1f2f9] px-4 py-6 flex items-center gap-4 mb-0">
              <div className="w-64 flex items-center gap-2">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>
                  Name
                </span>
              </div>
              <div className="w-64 flex items-center gap-2">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>
                  Relationship
                </span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>
                  Status
                </span>
              </div>
              <div className="w-40 text-center">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>
                  Edit/Remove
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {members.slice(0, showEntries).map((member) => (
              <div
                key={member.id}
                className="bg-white border-b border-[#f1f2f9] px-4 py-4 flex items-center gap-4"
              >
                <div className="w-64">
                  <p className="text-sm font-medium text-black">{member.name}</p>
                </div>
                <div className="w-64">
                  <p className="text-sm font-medium text-black">{member.relationship}</p>
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="bg-[#95d5b2] text-[#18203c] px-6 py-3 rounded-lg font-semibold text-base uppercase" style={{ fontFamily: "Poppins" }}>
                    {member.status}
                  </span>
                </div>
                <div className="w-40 flex justify-center gap-4">
                  <button className="text-[#18203c] hover:text-[#1b4332] transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="text-[#18203c] hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#18203c]" />
            </button>
            <button className="w-8 h-8 bg-[#1b4332] text-white rounded font-medium text-sm hover:bg-[#0f2818] transition-colors">
              1
            </button>
            <button className="w-8 h-8 bg-[#95d5b2] text-[#18203c] rounded font-medium text-sm hover:bg-[#7dc99f] transition-colors">
              2
            </button>
            <button className="w-8 h-8 bg-[#95d5b2] text-[#18203c] rounded font-medium text-sm hover:bg-[#7dc99f] transition-colors">
              3
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <ChevronRight className="w-5 h-5 text-[#18203c]" />
            </button>
          </div>
        </div>

        {/* Add New Member Section */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h2 className="text-2xl font-medium text-[#18203c] mb-8" style={{ fontFamily: "Poppins" }}>
            Add New Family Member
          </h2>

          <form className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Full Name</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  className="px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d]"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Relationship</label>
              <input
                type="text"
                placeholder="Relationship"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d]"
              />
            </div>
          </form>

          <div className="flex gap-4 mt-8">
            <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors" style={{ fontFamily: "Poppins" }}>
              Cancel
            </button>
            <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors" style={{ fontFamily: "Poppins" }}>
              Add Member
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

