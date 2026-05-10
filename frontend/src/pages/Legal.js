import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock } from 'lucide-react';
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
          title: '1. Information Collection',
          content: 'We collect information you provide directly to us, such as when you create an account, create a digital twin, or contact support. This includes your name, email address, and any data provided for twin training. We also collect usage data automatically through cookies and similar technologies.'
        },
        {
          title: '2. Use of Information',
          content: 'We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect AI Twin and our users. Your training data is used exclusively to train your specific AI twin and is never shared with third parties for their own purposes.'
        },
        {
          title: '3. Data Sharing',
          content: 'We do not share your personal data with third parties except as necessary to provide our services, comply with the law, or protect our rights. This includes cloud infrastructure providers and essential service partners who are bound by strict confidentiality agreements.'
        },
        {
          title: '4. Your Rights',
          content: 'You have the right to access, correct, or delete your personal data at any time. You can also request a copy of your data or object to certain processing activities. Contact our privacy team to exercise these rights.'
        },
        {
          title: '5. Cookies & Tracking',
          content: 'We use cookies to enhance your experience, remember your preferences, and analyze our traffic. You can control cookie settings through your browser, but some features of AI Twin may not function properly without them.'
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      description: 'The rules and guidelines for using our platform.',
      icon: <FileText className="w-12 h-12 text-violet-500" />,
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing or using AI Twin, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the service.'
        },
        {
          title: '2. User Accounts',
          content: 'You are responsible for maintaining the security of your account and password. AI Twin cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.'
        },
        {
          title: '3. Intellectual Property',
          content: 'The content you provide for training your twin remains yours. However, the AI models, algorithms, and platform interface are the exclusive property of AI Twin. You may not reverse engineer or attempt to extract our proprietary code.'
        },
        {
          title: '4. Prohibited Uses',
          content: 'You may not use AI Twin for any illegal purposes or to create content that violates third-party rights, is defamatory, or promotes hate speech. We reserve the right to terminate accounts that violate these policies.'
        },
        {
          title: '5. Termination',
          content: 'We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.'
        },
        {
          title: '6. Governing Law',
          content: 'These terms shall be governed and construed in accordance with the laws of the jurisdiction in which AI Twin operates, without regard to its conflict of law provisions.'
        }
      ]
    },
    security: {
      title: 'Security Overview',
      description: 'Our commitment to keeping your data safe.',
      icon: <Lock className="w-12 h-12 text-emerald-500" />,
      sections: [
        {
          title: '1. Infrastructure Security',
          content: 'Our systems are hosted on secure, industry-leading cloud providers (AWS/GCP) with SOC2 Type II compliance. We employ automated monitoring and threat detection systems to identify and mitigate risks 24/7.'
        },
        {
          title: '2. Data Encryption',
          content: 'All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We use end-to-end encryption for sensitive communication channels to ensure that your data remains private.'
        },
        {
          title: '3. Access Control',
          content: 'We implement strict "Least Privilege" access policies. Internal access to customer data is strictly controlled, logged, and requires multi-factor authentication (MFA). Regular access reviews are conducted.'
        },
        {
          title: '4. Vulnerability Management',
          content: 'We conduct regular security audits and penetration testing by independent third-party experts. We also maintain a bug bounty program to encourage the responsible disclosure of security vulnerabilities.'
        },
        {
          title: '5. Compliance',
          content: 'AI Twin is designed to meet GDPR and CCPA requirements. We are continuously working towards further industry certifications to demonstrate our commitment to security and privacy.'
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
          <p className="text-slate-400 mb-6">Our legal and security teams are here to help you understand our policies.</p>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
            Contact Support
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Legal;
