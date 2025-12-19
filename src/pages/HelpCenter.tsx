import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function HelpCenter() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I add a new family member?",
      answer: "You can add a new family member by going to the Protected Members section and clicking the 'Add Member' button. Fill in their information and submit the form.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and bank transfers. You can update your payment method in the Life Payments section.",
    },
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan anytime. Changes will take effect on your next billing cycle.",
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team 24/7 via email at support@memoracare.com or through the chat feature in your dashboard.",
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect all your personal information.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-[#fffdf6]/95 rounded-xl shadow-lg border border-[#f1f2f9] p-12">
          <h1 className="text-5xl font-medium text-[#18203c] mb-2" style={{ fontFamily: "Poppins" }}>
            Help Center
          </h1>
          <p className="text-sm font-medium text-[#18203c] mb-8">
            Find answers to common questions about MemoraCare
          </p>

          {/* FAQ Section */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#f1f2f9] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 bg-[#f1f2f9] hover:bg-[#e8eaf0] transition-colors"
                >
                  <h3 className="text-lg font-medium text-[#18203c] text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#18203c] transition-transform ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="p-6 bg-white border-t border-[#f1f2f9]">
                    <p className="text-sm text-[#18203c]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-[#f1f2f9] rounded-lg p-8">
            <h2 className="text-2xl font-medium text-[#18203c] mb-4" style={{ fontFamily: "Poppins" }}>
              Still need help?
            </h2>
            <p className="text-sm text-[#18203c] mb-6">
              Contact our support team for personalized assistance
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-[#1b4332] text-white rounded-lg font-medium hover:bg-[#0f2818] transition-colors">
                Email Support
              </button>
              <button className="px-8 py-3 bg-[#95d5b2] text-[#18203c] rounded-lg font-medium hover:bg-[#7dc99f] transition-colors">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

