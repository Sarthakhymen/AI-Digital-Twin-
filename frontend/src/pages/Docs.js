import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Code, HelpCircle, LifeBuoy, Search, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

const Docs = () => {
  const { pathname } = useLocation();
  const type = pathname.split('/').pop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const content = {
    documentation: {
      title: 'Documentation',
      description: 'Comprehensive guides to build and manage your AI Digital Twin.',
      icon: <Book className="w-12 h-12 text-blue-500" />,
      categories: [
        {
          title: 'Getting Started',
          items: [
            { name: 'Platform Overview', desc: 'Understand the core concepts of AI Digital Twins.' },
            { name: 'Quick Start Guide', desc: 'Create your first twin in less than 5 minutes.' },
            { name: 'Account Setup', desc: 'Configure your profile and integration settings.' }
          ]
        },
        {
          title: 'Core Features',
          items: [
            { name: 'Knowledge Base', desc: 'Upload documents to train your twin with custom data.' },
            { name: 'Voice & Chat', desc: 'Configure how your twin interacts via voice and text.' },
            { name: 'Personalization', desc: 'Fine-tune your twin\'s personality and tone of voice.' }
          ]
        },
        {
          title: 'Advanced',
          items: [
            { name: 'Custom Integrations', desc: 'Connect AI Twin to your existing CRM or tools.' },
            { name: 'Team Collaboration', desc: 'Manage multiple twins and team permissions.' },
            { name: 'Analytics & Insights', desc: 'Track performance and interaction quality.' }
          ]
        }
      ]
    },
    'api-reference': {
      title: 'API Reference',
      description: 'Developer tools to integrate AI Twin power into your apps.',
      icon: <Code className="w-12 h-12 text-purple-500" />,
      categories: [
        {
          title: 'Authentication',
          items: [
            { name: 'API Key Management', desc: 'Generate and rotate secure access keys.' },
            { name: 'Rate Limiting', desc: 'Understanding our API usage tiers and limits.' }
          ]
        },
        {
          title: 'Twin Management',
          items: [
            { name: 'Create Twin', desc: 'POST /v1/twins' },
            { name: 'List Twins', desc: 'GET /v1/twins' },
            { name: 'Update Training', desc: 'PATCH /v1/twins/:id/train' }
          ]
        },
        {
          title: 'Interactions',
          items: [
            { name: 'Send Message', desc: 'POST /v1/chat/message' },
            { name: 'Process Voice', desc: 'POST /v1/voice/process' }
          ]
        }
      ]
    },
    guides: {
      title: 'Guides & Tutorials',
      description: 'Deep dives and practical examples for every use case.',
      icon: <HelpCircle className="w-12 h-12 text-orange-500" />,
      categories: [
        {
          title: 'Build Guides',
          items: [
            { name: 'Customer Support Bot', desc: 'Set up a twin to handle 24/7 support queries.' },
            { name: 'Personal Meeting Assistant', desc: 'Let your twin take notes and summarize meetings.' }
          ]
        },
        {
          title: 'Optimization',
          items: [
            { name: 'Improving Accuracy', desc: 'Tips for structuring your knowledge documents.' },
            { name: 'Tone Consistency', desc: 'How to maintain a professional persona.' }
          ]
        }
      ]
    },
    support: {
      title: 'Support Center',
      description: 'Help is always available whenever you need it.',
      icon: <LifeBuoy className="w-12 h-12 text-pink-500" />,
      categories: [
        {
          title: 'Self-Help',
          items: [
            { name: 'FAQ', desc: 'Common questions and quick answers.' },
            { name: 'Troubleshooting', desc: 'Solve common integration and training issues.' }
          ]
        },
        {
          title: 'Contact',
          items: [
            { name: 'Email Support', desc: 'support@aitwin.com (Typical response < 2h)' },
            { name: 'Live Chat', desc: 'Available for Pro and Enterprise users.' }
          ]
        }
      ]
    }
  };

  const activeContent = content[type] || content.documentation;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LandingNavbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Search Bar Placeholder */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder={`Search ${activeContent.title}...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xl"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-6 mb-4">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
              {activeContent.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{activeContent.title}</h1>
              <p className="text-xl text-slate-400">{activeContent.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeContent.categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
                {category.title}
              </h3>
              <ul className="space-y-6">
                {category.items.map(item => (
                  <li key={item.name}>
                    <button className="text-left group/item w-full">
                      <div className="flex items-center gap-2 text-indigo-400 font-medium mb-1 group-hover/item:text-indigo-300 transition-colors">
                        {item.name}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                      </div>
                      <div className="text-sm text-slate-500 leading-snug">
                        {item.desc}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Docs;
