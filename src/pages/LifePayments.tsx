import DashboardLayout from "@/components/DashboardLayout";

export default function LifePayments() {
  const payments = [
    { date: "Oct 15, 2025", amount: "$59.00", status: "Completed", plan: "Premium Plan" },
    { date: "Sep 15, 2025", amount: "$59.00", status: "Completed", plan: "Premium Plan" },
    { date: "Aug 15, 2025", amount: "$59.00", status: "Completed", plan: "Premium Plan" },
    { date: "Jul 15, 2025", amount: "$59.00", status: "Completed", plan: "Premium Plan" },
    { date: "Jun 15, 2025", amount: "$59.00", status: "Completed", plan: "Premium Plan" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h1 className="text-5xl font-medium text-[#18203c] mb-8" style={{ fontFamily: "Poppins" }}>
            Life Payments
          </h1>

          {/* Payment Method */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-[#18203c] mb-4" style={{ fontFamily: "Poppins" }}>
              Current Payment Method
            </h2>
            <div className="bg-[#f1f2f9] rounded-lg p-6">
              <p className="font-medium text-[#18203c] mb-2">Visa Card ending in 4242</p>
              <p className="text-sm text-[#18203c]/60">Expires 12/2027</p>
              <button className="mt-4 px-6 py-2 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors text-sm">
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h2 className="text-2xl font-medium text-[#18203c] mb-4" style={{ fontFamily: "Poppins" }}>
              Payment History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f2f9]">
                    <th className="text-left px-4 py-3 font-semibold text-[#18203c]">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#18203c]">Plan</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#18203c]">Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#18203c]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr key={idx} className="border-b border-[#f1f2f9]">
                      <td className="px-4 py-3 text-sm text-[#18203c]">{payment.date}</td>
                      <td className="px-4 py-3 text-sm text-[#18203c]">{payment.plan}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#18203c]">{payment.amount}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#95d5b2] text-[#18203c] px-3 py-1 rounded-full text-xs font-medium">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

