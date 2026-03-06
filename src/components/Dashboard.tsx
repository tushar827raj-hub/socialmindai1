import React from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Users, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { cn } from '../App';

interface DashboardProps {
  connections: any[];
  posts: any[];
}

export default function Dashboard({ connections, posts }: DashboardProps) {
  const stats = [
    { label: 'Active Platforms', value: connections.length, icon: Users, color: 'text-blue-600' },
    { label: 'Scheduled Posts', value: posts.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-amber-600' },
    { label: 'Total Published', value: posts.filter(p => p.status === 'posted').length, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900">Welcome back</h2>
        <p className="text-neutral-500">Here's what's happening across your social accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm"
          >
            <div className={clsx("w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center mb-4", stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <p className="text-3xl font-semibold text-neutral-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-neutral-900">Recent Activity</h3>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-900">View all</button>
          </div>
          
          <div className="space-y-6">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex gap-4">
                  <div className={clsx(
                    "w-2 h-2 rounded-full mt-2",
                    post.status === 'posted' ? 'bg-emerald-500' : 
                    post.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                        {new Date(post.scheduledTime).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        {post.platforms.map((p: string) => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500 capitalize">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400">
                <p className="text-sm">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <Sparkles className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Your engagement is up 12% this week. Try posting more visual content on LinkedIn between 9 AM and 11 AM for maximum reach.
            </p>
            <button className="bg-white text-neutral-900 px-6 py-2 rounded-xl text-sm font-medium hover:bg-neutral-100 transition-colors">
              Generate Strategy
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
