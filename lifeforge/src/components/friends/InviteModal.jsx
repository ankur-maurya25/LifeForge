import React, { useState, useEffect } from 'react';

export default function InviteModal({ isOpen, onClose, onSendInvite, prefillFriend = null, defaultPartyName = 'Code Warriors' }) {
  const [targetName, setTargetName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (prefillFriend) {
      setTargetName(prefillFriend.name);
      setMessage(`Hey ${prefillFriend.name}, let's conquer quests and level up together!`);
    } else {
      setTargetName(defaultPartyName);
      setMessage('Join our party to battle procrastination bosses together!');
    }
  }, [prefillFriend, defaultPartyName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetName.trim()) return;
    onSendInvite({ targetName, message });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-purple-500/30 bg-neutral-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <h3 className="font-serif text-lg font-bold text-white">
              {prefillFriend ? `Invite ${prefillFriend.name}` : 'Create / Invite Party'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Friend name or party name
            </label>
            <input
              type="text"
              required
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. Aryan or Code Warriors"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Short message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your invitation message..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 transition-all"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
