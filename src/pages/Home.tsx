import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Search } from "lucide-react";

export default function Home() {
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

        <nav className="flex-1 space-y-4">
          <a href="#" className="block text-sm font-medium hover:text-[#1b4332]">
            My Account
            <span className="ml-2">›</span>
          </a>
          <a href="#" className="block text-sm font-medium hover:text-[#1b4332]">
            Payments
          </a>
          <a href="#" className="block text-sm font-medium hover:text-[#1b4332]">
            Help
          </a>
          <a href="#" className="block text-sm font-medium hover:text-[#1b4332]">
            Settings
            <span className="ml-2">›</span>
          </a>
        </nav>

        <div className="space-y-3">
          <button className="w-full bg-[#1b4332] text-white py-2 rounded-lg font-medium text-sm hover:bg-[#0f2818]">
            Log Out
          </button>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-[#18203c] py-2 rounded font-medium text-xs hover:bg-gray-100">
              English
            </button>
            <button className="flex-1 bg-[#c99a6e] text-[#18203c] py-2 rounded font-medium text-xs hover:bg-[#b8885d]">
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
        {/* Protected Members Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-medium text-[#18203c] mb-8" style={{ fontFamily: "Poppins" }}>Protected Members</h1>

          {/* Who's Protected Card */}
          <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12 mb-8">
            <div className="mb-8">
              <h2 className="text-4xl font-medium text-[#18203c] mb-2" style={{ fontFamily: "Poppins" }}>Who's Protected</h2>
              <p className="text-sm font-medium text-[#18203c]">
                Add the loved ones you wish to include in your coverage and update them anytime.
              </p>
            </div>

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

              <button className="bg-[#1b4332] text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-[#0f2818]">
                + Add Member
              </button>
            </div>

            {/* Table Header */}
            <div className="bg-white border-b border-[#f1f2f9] px-4 py-6 flex items-center gap-4 mb-0">
              <div className="w-64 flex items-center gap-2">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>Name</span>
              </div>
              <div className="w-64 flex items-center gap-2">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>Relationship</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>Status</span>
              </div>
              <div className="w-40 text-center">
                <span className="text-lg font-semibold text-[#18203c]" style={{ fontFamily: "Poppins" }}>Edit/Remove</span>
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

        {/* Add New Family Member Section */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h2 className="text-4xl font-medium text-[#18203c] mb-8" style={{ fontFamily: "Poppins" }}>Add New Family Member</h2>

          <form className="grid grid-cols-2 gap-8">
            {/* Full Name */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Full Name
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Susana"
                  className="px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
                />
                <input
                  type="text"
                  placeholder="Martinez"
                  className="px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Address
              </label>
              <input
                type="text"
                placeholder="123 Main Street"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Relationship
              </label>
              <input
                type="text"
                placeholder="Parent"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                placeholder="Address Line 2"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="maria@email.com"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-base font-medium text-[#18203c] mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Miami"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#18203c] mb-2">
                  State
                </label>
                <select className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] focus:outline-none focus:border-[#1b4332]">
                  <option>Florida</option>
                  <option>California</option>
                  <option>Texas</option>
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                placeholder="MM/DD/YYYY"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] focus:outline-none focus:border-[#1b4332]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-base font-medium text-[#18203c] mb-2">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+1 555-123-4567"
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c] placeholder-[#4b4e4d] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </form>

          {/* Form Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors" style={{ fontFamily: "Poppins" }}>
              Cancel
            </button>
            <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors" style={{ fontFamily: "Poppins" }}>
              Add Member
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

