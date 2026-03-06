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
    try {
      const response = await fetch(`/api/auth/url/${platform}`);
      const { url } = await response.json();
      
      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
      
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.platform === platform) {
          // Save connection to Firestore
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
    } catch (err) {
      console.error("Connection failed", err);
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
