import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, onSnapshot, query, where, orderBy, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { LayoutDashboard as DashboardIcon, Share2, Bot, History as HistoryIcon, LogOut, LogIn, Plus, Sparkles, Twitter, Linkedin, Instagram, Facebook, MessageSquare, AtSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Connections from './components/Connections';
import Agent from './components/Agent';
import History from './components/History';

export type View = 'dashboard' | 'connections' | 'agent' | 'history';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        setDoc(doc(db, 'users', u.uid), {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const qConn = query(collection(db, `users/${user.uid}/connections`));
    const unsubConn = onSnapshot(qConn, (snap) => {
      setConnections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qPosts = query(collection(db, `users/${user.uid}/posts`), orderBy('createdAt', 'desc'));
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubConn();
      unsubPosts();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-900" />
            <span className="font-bold text-lg tracking-tight">SocialMind</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#generate" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Generate</a>
            <a href="#platforms" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Platforms</a>
            {user ? (
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ""} className="w-8 h-8 rounded-full border border-neutral-200" alt="" />
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-600">Sign Out</button>
              </div>
            ) : (
              <button onClick={handleLogin} className="bg-neutral-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-all">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Social media, <br />
            <span className="text-neutral-400">powered by AI.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-500 max-w-2xl mx-auto mb-10"
          >
            The simplest way to draft, schedule, and manage your social presence across all major platforms.
          </motion.p>
          {!user && (
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleLogin}
              className="bg-neutral-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all shadow-xl shadow-neutral-900/10"
            >
              Get Started for Free
            </motion.button>
          )}
        </div>
      </header>

      {/* How it works */}
      <section className="py-24 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="font-bold text-neutral-900">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect</h3>
              <p className="text-neutral-500">Link your social accounts securely. We support X, LinkedIn, Instagram, Facebook, Reddit, and Threads.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="font-bold text-neutral-900">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Generate</h3>
              <p className="text-neutral-500">Describe your post. Our AI drafts the perfect content, hashtags, and suggests the best time to post.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="font-bold text-neutral-900">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Publish</h3>
              <p className="text-neutral-500">Review and schedule. Your content goes live automatically across all your selected platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {user ? (
        <div className="max-w-6xl mx-auto px-6 space-y-32 pb-32">
          {/* Tool Section */}
          <section id="generate" className="scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-3xl font-bold mb-4">AI Content Agent</h2>
                <p className="text-neutral-500 mb-6">Describe your post and let our AI handle the formatting, hashtags, and timing for each platform.</p>
                <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100">
                  <h4 className="font-semibold text-sm mb-2">Pro Tip</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">Be specific about your audience and tone. The more context you provide, the better the results.</p>
                </div>
              </div>
              <div className="lg:col-span-8">
                <Agent connections={connections} user={user} />
              </div>
            </div>
          </section>

          {/* Platforms Section */}
          <section id="platforms" className="scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-3xl font-bold mb-4">Your Platforms</h2>
                <p className="text-neutral-500">Connect your accounts to enable one-click scheduling and cross-platform posting.</p>
              </div>
              <div className="lg:col-span-8">
                <Connections connections={connections} user={user} />
              </div>
            </div>
          </section>

          {/* History Section */}
          <section id="history" className="scroll-mt-24">
            <div className="bg-neutral-50 p-8 md:p-12 rounded-[3rem] border border-neutral-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Recent Posts</h2>
                <a href="#generate" className="text-sm font-medium text-neutral-900 underline underline-offset-4">Create New</a>
              </div>
              <History posts={posts} />
            </div>
          </section>
        </div>
      ) : (
        <section className="py-24 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Supported Platforms</h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <Twitter size={40} />
              <Linkedin size={40} />
              <Instagram size={40} />
              <Facebook size={40} />
              <MessageSquare size={40} />
              <AtSign size={40} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-400" />
            <span className="font-bold text-sm text-neutral-400">SocialMind AI</span>
          </div>
          <p className="text-sm text-neutral-400">© 2026 Crafted for the modern social manager.</p>
        </div>
      </footer>
    </div>
  );
}
