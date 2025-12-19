import DashboardLayout from "@/components/DashboardLayout";

export default function MyProfile() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h1 className="text-5xl font-medium text-[#18203c] mb-8" style={{ fontFamily: "Poppins" }}>
            My Profile
          </h1>

          {/* Profile Information */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Full Name</label>
              <input
                type="text"
                value="Maria Thompson"
                readOnly
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Email</label>
              <input
                type="email"
                value="maria@example.com"
                readOnly
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Phone</label>
              <input
                type="tel"
                value="+1 (555) 123-4567"
                readOnly
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#18203c] mb-2">Date of Birth</label>
              <input
                type="date"
                value="1965-03-15"
                readOnly
                className="w-full px-4 py-3 bg-white rounded-2xl border border-[#4b4e4d]/60 text-sm text-[#18203c]"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors" style={{ fontFamily: "Poppins" }}>
              Edit Profile
            </button>
            <button className="px-8 py-3 bg-[#95d5b2] text-[#18203c] rounded-lg font-medium hover:bg-[#7dc99f] transition-colors" style={{ fontFamily: "Poppins" }}>
              Cancel
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h2 className="text-2xl font-medium text-[#18203c] mb-6" style={{ fontFamily: "Poppins" }}>
            My Beneficiaries
          </h2>

          <div className="space-y-4">
            {[
              { name: "Daniel Thompson", relationship: "Spouse", percentage: "50%" },
              { name: "Anna Thompson", relationship: "Child", percentage: "25%" },
              { name: "José Martinez", relationship: "Parent", percentage: "25%" },
            ].map((beneficiary, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#f1f2f9] rounded-lg">
                <div>
                  <p className="font-medium text-[#18203c]">{beneficiary.name}</p>
                  <p className="text-xs text-[#18203c]/60">{beneficiary.relationship}</p>
                </div>
                <span className="font-medium text-[#1b4332]">{beneficiary.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

