import React, { useState } from 'react';
import { X, Copy, Check, Link, Mail, Globe, Lock, ShieldCheck, Users } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, documentTitle }) => {
  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState<'edit' | 'view'>('edit');
  const [emailInput, setEmailInput] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setEmailInput('');
      setSentSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-[#FAFAFA] border border-[#D4D4D8] rounded-lg shadow-2xl w-full max-w-md overflow-hidden text-[#18181B] z-10">
        {/* Header */}
        <div className="bg-[#18181B] text-white px-5 py-3.5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-300" />
            <h3 className="font-semibold text-sm tracking-tight">Share "{documentTitle}"</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Permission selector */}
          <div className="flex items-center justify-between bg-white border border-[#D4D4D8] rounded-md p-3">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-neutral-600" />
              <div>
                <p className="text-xs font-semibold text-[#18181B]">Link settings</p>
                <p className="text-[11px] text-[#71717A]">Anyone with this link can access</p>
              </div>
            </div>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'edit' | 'view')}
              className="text-xs bg-[#F4F4F5] border border-[#D4D4D8] rounded px-2.5 py-1 font-medium text-[#18181B] focus:outline-none focus:border-black"
            >
              <option value="edit">Can edit</option>
              <option value="view">Can view only</option>
            </select>
          </div>

          {/* Email Invite form */}
          <div>
            <label className="block text-xs font-semibold text-[#3F3F46] mb-1.5">
              Invite people or groups
            </label>
            <form onSubmit={handleSendInvite} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-[#D4D4D8] rounded-md text-[#18181B] placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>
              <button
                type="submit"
                disabled={!emailInput.trim()}
                className="bg-[#18181B] hover:bg-[#27272A] disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
              >
                Send
              </button>
            </form>
            {sentSuccess && (
              <p className="text-[11px] text-neutral-700 font-medium mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3 text-black" /> Invitation sent successfully
              </p>
            )}
          </div>

          {/* Copy Link Section */}
          <div className="pt-2 border-t border-[#E4E4E7]">
            <label className="block text-xs font-semibold text-[#3F3F46] mb-1.5">
              Shareable link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-xs px-3 py-2 bg-[#F4F4F5] border border-[#D4D4D8] rounded-md text-[#71717A] select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all border ${
                  copied
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-[#18181B] border-[#D4D4D8] hover:bg-neutral-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F4F4F5] px-5 py-3 border-t border-[#E4E4E7] flex items-center justify-between">
          <span className="text-[11px] text-[#71717A] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" /> End-to-end local document privacy
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-4 py-1.5 bg-white border border-[#D4D4D8] rounded hover:bg-neutral-100 text-[#18181B] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
