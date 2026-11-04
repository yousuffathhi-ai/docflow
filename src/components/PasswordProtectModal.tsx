import React, { useState } from 'react';
import { X, Lock, Unlock, ShieldAlert, Key } from 'lucide-react';

interface PasswordProtectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProtected: boolean;
  onSetPassword: (password: string) => void;
  onRemovePassword: () => void;
}

export const PasswordProtectModal: React.FC<PasswordProtectModalProps> = ({
  isOpen,
  onClose,
  isProtected,
  onSetPassword,
  onRemovePassword,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!password) {
      setError('Password cannot be empty.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    onSetPassword(password);
    setPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-sm w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-white stroke-[2.2]" />
            <h3 className="font-bold text-sm">
              {isProtected ? 'Document Protection Active' : 'Encrypt with Password'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {isProtected ? (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded space-y-1">
              <span className="font-bold text-white block">Password Protection is Active</span>
              <p className="text-neutral-400 text-[11px]">
                This document requires verification before modification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onRemovePassword();
                onClose();
              }}
              className="w-full py-2 bg-neutral-800 hover:bg-white hover:text-black font-bold rounded text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Remove Password Protection</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Set a document password. Caution: If you lose or forget the password, it cannot be recovered.
            </p>

            <div>
              <label className="text-neutral-300 font-bold block mb-1">Enter Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-bold block mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-white"
              />
            </div>

            {error && <div className="text-white bg-neutral-900 p-2 rounded border border-white text-[11px]">{error}</div>}

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200"
              >
                Protect Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
