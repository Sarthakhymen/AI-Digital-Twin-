import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Code, HelpCircle, LifeBuoy, Search, ExternalLink } from 'lucide-react';
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
      description: 'Everything you need to know about AI Twin.',
      icon: <Book className="w-12 h-12 text-blue-500" />,
      categories: [
        {
          title: 'Getting Started',
          items: ['Quick Start Guide', 'Account Setup', 'Creating Your First Twin', 'Best Practices']
        },
        {
          title: 'Platform Features',
          items: ['Knowledge Base', 'Voice Integration', 'Meeting Assistant', 'Analytics Dashboard']
        },
        {
          title: 'Advanced Usage',
          items: ['Custom Personalities', 'Data Syncing', 'Enterprise Features', 'Security Configuration']
        }
      ]
    },
    'api-reference': {
      title: 'API Reference',
      description: 'Integrate AI Twin into your own applications.',
      icon: <Code className="w-12 h-12 text-purple-500" />,
      categories: [
        {
          title: 'Authentication',
          items: ['API Keys', 'OAuth2 Flow', 'Token Management']
        },
        {
          title: 'Endpoints',
          items: ['Twins API', 'Chat API', 'Training API', 'Analytics API']
        },
        {
          title: 'SDKs',
          items: ['JavaScript SDK', 'Python Client', 'React Hooks']
        }
      ]
    },
    guides: {
      title: 'Guides & Tutorials',
      description: 'Step-by-step instructions for common tasks.',
      icon: <HelpCircle className="w-12 h-12 text-orange-500" />,
      categories: [
        {
          title: 'Video Tutorials',
          items: ['Platform Overview', 'Training Your Twin', 'Embedding in Websites']
        },
        {
          title: 'Use Cases',
          items: ['Customer Support', 'Personal Assistant', 'Knowledge Management']
        }
      ]
    },
    support: {
      title: 'Support Center',
      description: 'We are here to help you succeed.',
      icon: <LifeBuoy className="w-12 h-12 text-pink-500" />,
      categories: [
        {
          title: 'Helpful Resources',
          items: ['Frequently Asked Questions', 'Community Forum', 'System Status']
        },
        {
          title: 'Direct Support',
          items: ['Contact Us', 'Live Chat', 'Schedule a Demo']
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
              <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                {category.title}
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </h3>
              <ul className="space-y-4">
                {category.items.map(item => (
                  <li key={item}>
                    <button className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/item:bg-indigo-500 transition-colors" />
                      {item}
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
