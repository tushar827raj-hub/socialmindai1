import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../App';

interface HistoryProps {
  posts: any[];
}

export default function History({ posts }: HistoryProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Post History</h2>
          <p className="text-neutral-500">Track all your scheduled and published content.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
            />
          </div>
          <button className="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-500 hover:text-neutral-900">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-bottom border-neutral-100 bg-neutral-50/50">
              <th className="px-6 py-4 font-medium text-neutral-500">Content</th>
              <th className="px-6 py-4 font-medium text-neutral-500">Platforms</th>
              <th className="px-6 py-4 font-medium text-neutral-500">Scheduled</th>
              <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {posts.length > 0 ? (
              posts.map((post, i) => (
                <motion.tr 
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="line-clamp-1 text-neutral-900 font-medium">{post.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {post.platforms.map((p: string) => (
                        <span key={p} className="text-[10px] px-2 py-0.5 bg-neutral-100 rounded-full text-neutral-500 capitalize">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">
                    {new Date(post.scheduledTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                      post.status === 'posted' ? 'bg-emerald-50 text-emerald-700' : 
                      post.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    )}>
                      {post.status === 'posted' ? <CheckCircle2 size={10} /> : 
                       post.status === 'pending' ? <Clock size={10} /> : <AlertCircle size={10} />}
                      {post.status}
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                  No posts found in history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
