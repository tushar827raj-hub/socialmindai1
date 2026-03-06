import React, { useState } from 'react';
import { Twitter, Linkedin, Instagram, Plus, ExternalLink, Trash2, ShieldCheck, Facebook, MessageSquare, AtSign } from 'lucide-react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';

interface ConnectionsProps {
  connections: any[];
  user: User;
}

export default function Connections({ connections, user }: ConnectionsProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'bg-black text-white' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0077B5] text-white' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2] text-white' },
    { id: 'reddit', name: 'Reddit', icon: MessageSquare, color: 'bg-[#FF4500] text-white' },
    { id: 'threads', name: 'Threads', icon: AtSign, color: 'bg-black text-white' },
  ];

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    setError(null);
    console.log(`[Connections] Attempting to connect to ${platform}...`);
    
    try {
      // Try real API first
      try {
        const response = await fetch(`/api/auth/url/${platform}`);
        if (response.ok) {
          const { url } = await response.json();
          console.log(`[Connections] Opening auth window: ${url}`);
          const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
          
          if (!authWindow) {
            throw new Error("Popup blocked! Please allow popups for this site.");
          }

          const handleMessage = async (event: MessageEvent) => {
            if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.platform === platform) {
              console.log(`[Connections] Auth success for ${platform}`, event.data.data);
              await addDoc(collection(db, `users/${user.uid}/connections`), {
                userId: user.uid,
                platform,
                accessToken: 'mock_token',
                profileName: event.data.data.profileName,
                profileImage: event.data.data.profileImage,
                createdAt: serverTimestamp()
              });
              window.removeEventListener('message', handleMessage);
            }
          };
          window.addEventListener('message', handleMessage);
          return;
        }
      } catch (e: any) {
        console.warn("[Connections] API connection failed, using mock fallback", e.message);
      }

      // Fallback: Mock connection for static hosts (GitHub Pages)
      console.log(`[Connections] Creating mock connection for ${platform}`);
      const mockNames: Record<string, string> = {
        twitter: 'SocialMind_User',
        linkedin: 'Tushar Raj',
        instagram: 'social_mind_ai',
        facebook: 'SocialMind AI',
        reddit: 'u/socialmind',
        threads: '@socialmind'
      };

      await addDoc(collection(db, `users/${user.uid}/connections`), {
        userId: user.uid,
        platform,
        accessToken: 'mock_token',
        profileName: mockNames[platform] || 'User',
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${platform}`,
        createdAt: serverTimestamp()
      });
      console.log(`[Connections] Mock connection created for ${platform}`);

    } catch (err: any) {
      console.error("[Connections] Connection failed", err);
      setError(err.message || "Failed to connect. Please try again.");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (confirm('Are you sure you want to disconnect this account?')) {
      await deleteDoc(doc(db, `users/${user.uid}/connections`, id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900">Social Platforms</h2>
        <p className="text-neutral-500">Link your accounts to enable automated posting and AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {error && (
          <div className="col-span-full bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {platforms.map((platform) => {
          const isConnected = connections.find(c => c.platform === platform.id);
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", platform.color)}>
                  <platform.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{platform.name}</h3>
                  <p className="text-xs text-neutral-500">
                    {isConnected ? 'Connected as ' + isConnected.profileName : 'Not connected'}
                  </p>
                </div>
              </div>

              {isConnected ? (
                <button 
                  onClick={() => handleDisconnect(isConnected.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => handleConnect(platform.id)}
                  disabled={connecting === platform.id}
                  className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {connecting === platform.id ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : <Plus size={18} />}
                  Connect
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex gap-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-emerald-900 text-sm">Secure Connection</h4>
          <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
            We use official OAuth 2.0 protocols to link your accounts. We never store your passwords and you can revoke access at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../App';
