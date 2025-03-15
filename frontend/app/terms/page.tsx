"use client";

import React, { useState, JSX } from "react";
import {
  Lock,
  ShieldCheck,
  Globe,
  FileText,
  ChevronDown,
  User,
  Database,
  Eye,
  Key,
  Share2,
  Edit3,
  Mail,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const TermsAndPrivacy = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const [expandedSection, setExpandedSection] = useState<ExpandedSectionState>({
    terms: null,
    privacy: null,
    rights: null,
  });

interface ExpandedSectionState {
    terms: string | null;
    privacy: string | null;
    rights: string | null;
}

const toggleSection = (category: keyof ExpandedSectionState, section: string) => {
    setExpandedSection((prev: ExpandedSectionState) => ({
        ...prev,
        [category]: prev[category] === section ? null : section,
    }));
};

  const termsSections = [
    {
      id: "eligibility",
      title: "Eligibility & Account",
      icon: <User className="h-5 w-5" />,
      content:
        "You must be at least 18 years old to use our services. By creating an account, you agree to provide accurate and complete information. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.",
    },
    {
      id: "acceptable",
      title: "Acceptable Use",
      icon: <CheckCircle className="h-5 w-5" />,
      content:
        "Any misuse, hacking, or unauthorized access to the platform is strictly prohibited. You agree not to use our services for any illegal purposes or in any manner that could damage, disable, or impair our services. We reserve the right to terminate your access if you violate these terms.",
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      icon: <Globe className="h-5 w-5" />,
      content:
        "Our platform may contain links to third-party websites or services. We are not responsible for the content or practices of any third-party websites or services linked to from our platform. Your use of such websites and services is subject to those sites' terms and policies.",
    },
    {
      id: "termination",
      title: "Termination",
      icon: <AlertTriangle className="h-5 w-5" />,
      content:
        "Your account may be suspended if you violate our terms or engage in fraudulent activities. We reserve the right to terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: <Edit3 className="h-5 w-5" />,
      content:
        "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <ShieldCheck className="h-5 w-5" />,
      content:
        "In no event shall Quantum, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
    },
  ];

  const privacySections = [
    {
      id: "collection",
      title: "Information We Collect",
      icon: <Database className="h-5 w-5" />,
      content:
        "We collect data such as your name, email, and device information. This includes information you provide when registering, using our services, or contacting our support team. We also collect technical data such as IP address, browser type, and operating system information.",
    },
    {
      id: "usage",
      title: "How We Use Your Data",
      icon: <Eye className="h-5 w-5" />,
      content:
        "We use your information to provide and improve our services, process transactions, send notifications, and communicate with you. We analyze usage patterns to enhance user experience and develop new features. Your data helps us personalize content and recommendations.",
    },
    {
      id: "sharing",
      title: "Data Sharing Practices",
      icon: <Share2 className="h-5 w-5" />,
      content:
        "Your data is stored securely and not sold to third parties. We may share information with service providers who assist us in operating our platform, conducting business, or servicing you. These third parties are bound by confidentiality agreements and are prohibited from using your information for other purposes.",
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Globe className="h-5 w-5" />,
      content:
        "Cookies are used to enhance user experience. We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content:
        "We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data. We regularly review our security practices and update them as necessary to maintain the integrity of your information.",
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: <Key className="h-5 w-5" />,
      content:
        "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. When we no longer need to process your information, we will either delete it or anonymize it, unless we're legally required to retain it.",
    },
  ];

  const rightsSections = [
    {
      id: "access",
      title: "Access & Edit Your Data",
      icon: <Edit3 className="h-5 w-5" />,
      content:
        "You can request a copy of your stored data at any time through your account settings or by contacting our support team. We will provide this information within 30 days of your request.",
    },
    {
      id: "optout",
      title: "Opt-Out of Marketing",
      icon: <Mail className="h-5 w-5" />,
      content:
        "You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in our emails or updating your preferences in account settings. Please note that we may still send you service-related communications.",
    },
    {
      id: "delete",
      title: "Delete Your Account",
      icon: <User className="h-5 w-5" />,
      content:
        "Contact our support team to permanently remove your data from our systems in accordance with applicable regulations. Please note that some information may be retained for legal, security, or fraud-prevention purposes.",
    },
    {
      id: "portability",
      title: "Data Portability",
      icon: <Share2 className="h-5 w-5" />,
      content:
        "You have the right to receive a copy of your personal data in a structured, commonly used, and machine-readable format. You can also request that we transfer this data directly to another service provider where technically feasible.",
    },
    {
      id: "restriction",
      title: "Restrict Processing of Data",
      icon: <Database className="h-5 w-5" />,
      content:
        "Under certain conditions, you can request that we temporarily or permanently stop processing your data. This may apply when you contest the accuracy of your data or when the processing is unlawful but you oppose deletion.",
    },
    {
      id: "correction",
      title: "Correct Inaccurate Data",
      icon: <Key className="h-5 w-5" />,
      content:
        "If you believe that any of your personal data is incorrect, you can request a correction through your account settings or by contacting support. We will process such requests without undue delay.",
    },
  ];

interface Section {
    id: string;
    title: string;
    icon: JSX.Element;
    content: string;
}

// interface AccordionProps {
//     sections: Section[];
//     category: keyof ExpandedSectionState;
// }

const renderAccordionSection = (sections: Section[], category: keyof ExpandedSectionState) => (
    <div className="space-y-4">
        {sections.map((section) => (
            <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
            >
                <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition focus:outline-none"
                    onClick={() => toggleSection(category, section.id)}
                >
                    <div className="flex items-center">
                        {section.icon}{" "}
                        <span className="ml-3 font-medium">{section.title}</span>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                            expandedSection[category] === section.id
                                ? "transform rotate-180"
                                : ""
                        }`}
                    />
                </button>
                {expandedSection[category] === section.id && (
                    <div className="p-4 pt-2 border-t text-gray-600">
                        {section.content}
                    </div>
                )}
            </div>
        ))}
    </div>
);

//   const getTabIconColor = (tab) => {
//     switch (tab) {
//       case "terms":
//         return "text-blue-700";
//       case "privacy":
//         return "text-green-700";
//       case "rights":
//         return "text-purple-700";
//       default:
//         return "text-blue-700";
//     }
//   };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 pt-[80px]">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-blue-500 rounded-full mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Terms & Privacy Policy
          </h1>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto">
            At Quantum, we prioritize your privacy and security. Learn how we
            protect your information and the terms governing our platform.
          </p>
          <p className="mt-2 text-sm text-blue-200">Last Updated: March 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition ${
              activeTab === "terms"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            <span className="font-medium">Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition ${
              activeTab === "privacy"
                ? "bg-blue-100 text-green-700"
                : "hover:bg-gray-100"
            }`}
          >
            <Lock className="h-5 w-5 mr-2" />
            <span className="font-medium">Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab("rights")}
            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition ${
              activeTab === "rights"
                ? "bg-blue-100 text-purple-700"
                : "hover:bg-gray-100"
            }`}
          >
            <Globe className="h-5 w-5 mr-2" />
            <span className="font-medium">Your Rights</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === "terms" && (
            <>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Terms of Service
              </h2>
              <p className="text-gray-600 mb-6">
                These terms govern your use of Quantum&apos;s platform. By using our
                services, you agree to the following conditions:
              </p>
              {renderAccordionSection(termsSections, "terms")}
            </>
          )}

          {activeTab === "privacy" && (
            <>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Privacy Policy
              </h2>
              <p className="text-gray-600 mb-6">
                We value your privacy and ensure the security of your personal
                information. This policy explains how we collect, use, and
                protect your data:
              </p>
              {renderAccordionSection(privacySections, "privacy")}
            </>
          )}

          {activeTab === "rights" && (
            <>
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 mb-6">
                You have control over your personal data. Below are the rights
                you can exercise regarding your information with Quantum:
              </p>
              {renderAccordionSection(rightsSections, "rights")}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
