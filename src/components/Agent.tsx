import React, { useState } from 'react';
import { Bot, Sparkles, Send, Calendar, CheckCircle2, Loader2, Wand2, Zap, Settings2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { generateSocialContent, generateDailyPlan } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../App';

interface AgentProps {
  connections: any[];
  user: User;
}

export default function Agent({ connections, user }: AgentProps) {
  const [mode, setMode] = useState<'manual' | 'automated'>('manual');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  // Automated Mode State
  const [dailyTheme, setDailyTheme] = useState('');
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({
    twitter: 1,
    linkedin: 1,
    instagram: 0,
    facebook: 0,
    reddit: 0,
    threads: 0
  });

  const handleGenerate = async () => {
    if (!prompt || selectedPlatforms.length === 0) return;
    setGenerating(true);
    try {
      const content = await generateSocialContent(prompt, selectedPlatforms);
      setResult(content);
    } catch (err) {
      console.error("Generation failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateDaily = async () => {
    if (!dailyTheme) return;
    setGenerating(true);
    try {
      const plan = await generateDailyPlan(dailyTheme, platformCounts);
      
      // Save theme to user profile
      await updateDoc(doc(db, 'users', user.uid), {
        dailyTheme,
        postsPerDay: platformCounts
      });

      // Schedule all posts
      const batch = plan.posts.map(post => 
        addDoc(collection(db, `users/${user.uid}/posts`), {
          userId: user.uid,
          content: post.content,
          platforms: post.platforms,
          scheduledTime: post.suggestedTime,
          status: 'pending',
          aiGenerated: true,
          createdAt: serverTimestamp()
        })
      );
      
      await Promise.all(batch);
      alert(`Successfully scheduled ${plan.posts.length} posts for your daily theme!`);
      setDailyTheme('');
    } catch (err) {
      console.error("Daily generation failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSchedule = async () => {
    if (!result) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/posts`), {
        userId: user.uid,
        content: result.content,
        platforms: result.platforms,
        scheduledTime: result.suggestedTime,
        status: 'pending',
        aiGenerated: true,
        createdAt: serverTimestamp()
      });
      setResult(null);
      setPrompt('');
      alert('Post scheduled successfully!');
    } catch (err) {
      console.error("Scheduling failed", err);
    }
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updateCount = (platform: string, delta: number) => {
    setPlatformCounts(prev => ({
      ...prev,
      [platform]: Math.max(0, Math.min(5, prev[platform] + delta))
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">AI Content Agent</h2>
          <p className="text-neutral-500">Choose how you want to create today.</p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('manual')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
              mode === 'manual' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            Manual
          </button>
          <button
            onClick={() => setMode('automated')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
              mode === 'automated' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            Automated
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {mode === 'manual' ? (
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <label className="text-sm font-medium text-neutral-700">What's on your mind?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Write a post about our new product launch next Monday. It's a sustainable water bottle."
                className="w-full h-32 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all resize-none"
              />
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700">Select Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {['twitter', 'linkedin', 'instagram', 'facebook', 'reddit', 'threads'].map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-medium border transition-all capitalize",
                        selectedPlatforms.includes(p)
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !prompt || selectedPlatforms.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {generating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                {generating ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                  <Zap size={20} className="text-amber-500" />
                  <h3>Daily Automation</h3>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Set a theme for the day and decide how many posts you want on each platform. 
                  Our AI will generate and schedule everything at once.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-neutral-700">Today's Theme</label>
                <input
                  type="text"
                  value={dailyTheme}
                  onChange={(e) => setDailyTheme(e.target.value)}
                  placeholder="e.g. Productivity Tips for Remote Workers"
                  className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-neutral-700">Posts per Platform</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(platformCounts).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <span className="text-xs font-medium capitalize text-neutral-600">{platform}</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateCount(platform, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{count}</span>
                        <button 
                          onClick={() => updateCount(platform, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateDaily}
                disabled={generating || !dailyTheme}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white py-4 rounded-2xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {generating ? 'Generating Daily Plan...' : 'Generate & Schedule All'}
              </button>
            </div>
          )}

          <AnimatePresence>
            {result && mode === 'manual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Sparkles size={18} />
                    <span className="text-sm font-semibold">AI Generated Draft</span>
                  </div>
                  <div className="flex gap-2">
                    {result.platforms.map((p: string) => (
                      <span key={p} className="text-[10px] px-2 py-1 bg-neutral-100 rounded-lg text-neutral-500 capitalize">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="prose prose-neutral max-w-none text-neutral-800 text-sm leading-relaxed">
                  <ReactMarkdown>{result.content}</ReactMarkdown>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar size={16} />
                    <span className="text-xs">Suggested: {new Date(result.suggestedTime).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleSchedule}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Send size={16} />
                    Schedule Post
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
            <h3 className="font-semibold text-neutral-900 text-sm mb-4 flex items-center gap-2">
              <Bot size={18} className="text-neutral-500" />
              Agent Tips
            </h3>
            <ul className="space-y-4">
              {[
                "Use emojis to increase engagement on Twitter.",
                "LinkedIn posts perform better with professional insights.",
                "Always include a call to action (CTA).",
                "Daily themes help build a consistent brand voice."
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-xs text-neutral-600 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-neutral-900 p-6 rounded-3xl text-white">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Settings2 size={16} />
              Quick Setup
            </h3>
            <p className="text-[11px] text-neutral-400 mb-4">Make sure your platforms are connected before using Automated mode.</p>
            <a href="#platforms" className="text-[11px] font-medium underline underline-offset-4 hover:text-white transition-colors">
              Go to Platforms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
