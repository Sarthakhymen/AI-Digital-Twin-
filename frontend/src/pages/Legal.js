import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

const Legal = () => {
  const { pathname } = useLocation();
  const type = pathname.split('/').pop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const content = {
    privacy: {
      title: 'Privacy Policy',
      description: 'How we handle and protect your personal data.',
      icon: <Shield className="w-12 h-12 text-indigo-500" />,
      sections: [
        {
          title: 'Information Collection',
          content: 'We collect information you provide directly to us, such as when you create an account, create a digital twin, or contact support. This includes your name, email address, and any data provided for twin training.'
        },
        {
          title: 'Use of Information',
          content: 'We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect AI Twin and our users.'
        },
        {
          title: 'Data Security',
          content: 'We use industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, and destruction.'
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      description: 'The rules and guidelines for using our platform.',
      icon: <FileText className="w-12 h-12 text-violet-500" />,
      sections: [
        {
          title: 'Service Usage',
          content: 'By using AI Twin, you agree to comply with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account.'
        },
        {
          title: 'Intellectual Property',
          content: 'The content, features, and functionality of the platform are owned by AI Twin and are protected by international copyright, trademark, and other intellectual property laws.'
        },
        {
          title: 'Limitation of Liability',
          content: 'AI Twin shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.'
        }
      ]
    },
    security: {
      title: 'Security Overview',
      description: 'Our commitment to keeping your data safe.',
      icon: <Lock className="w-12 h-12 text-emerald-500" />,
      sections: [
        {
          title: 'Infrastructure Security',
          content: 'Our systems are hosted on secure, industry-leading cloud providers with SOC2 compliance and 24/7 monitoring.'
        },
        {
          title: 'Encryption',
          content: 'All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Your training data is isolated and never shared between users.'
        },
        {
          title: 'Access Control',
          content: 'We implement strict least-privilege access policies and multi-factor authentication for all internal systems.'
        }
      ]
    }
  };

  const activeContent = content[type] || content.privacy;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LandingNavbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl mb-6 border border-slate-800">
            {activeContent.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {activeContent.title}
          </h1>
          <p className="text-xl text-slate-400">
            {activeContent.description}
          </p>
        </motion.div>

        <div className="space-y-12">
          {activeContent.sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l border-slate-800"
            >
              <div className="absolute left-0 top-0 w-1 h-8 bg-indigo-500 -ml-0.5 rounded-full" />
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                {section.title}
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Have questions?</h3>
          <p className="text-slate-400 mb-6">Our legal team is here to help you understand our policies.</p>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
            Contact Support
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Legal;
