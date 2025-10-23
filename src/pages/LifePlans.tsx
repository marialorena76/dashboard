import DashboardLayout from "@/components/DashboardLayout";

export default function LifePlans() {
  const plans = [
    {
      name: "Basic Plan",
      price: "$29/month",
      coverage: "Up to 3 family members",
      features: ["Basic coverage", "Email support", "Monthly updates"],
    },
    {
      name: "Premium Plan",
      price: "$59/month",
      coverage: "Up to 7 family members",
      features: ["Full coverage", "24/7 support", "Monthly updates", "Priority assistance"],
    },
    {
      name: "Elite Plan",
      price: "$99/month",
      coverage: "Unlimited family members",
      features: ["Complete coverage", "24/7 priority support", "Weekly updates", "Dedicated manager"],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h1 className="text-5xl font-medium text-[#18203c] mb-2" style={{ fontFamily: "Poppins" }}>
            Life Plans
          </h1>
          <p className="text-sm font-medium text-[#18203c] mb-8">
            Choose the perfect plan for your family's protection
          </p>

          <div className="grid grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div key={idx} className="border border-[#f1f2f9] rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold text-[#18203c] mb-2" style={{ fontFamily: "Poppins" }}>
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-[#1b4332] mb-2">{plan.price}</p>
                <p className="text-sm text-[#18203c]/60 mb-6">{plan.coverage}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-[#18203c]">
                      <span className="w-2 h-2 bg-[#95d5b2] rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-[#1b4332] text-white py-3 rounded-lg font-medium hover:bg-[#0f2818] transition-colors">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

