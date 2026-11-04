import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Check,
  Trash2,
  Reply,
  X,
  History,
  CheckCheck,
  XCircle,
  Eye,
} from 'lucide-react';
import { DocumentComment, TrackChangeItem } from '../types/document';
import { Editor } from '@tiptap/react';

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DocumentComment[];
  onAddComment: (text: string, selectedText: string) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onAddReply: (commentId: string, replyText: string) => void;
  trackChangesActive: boolean;
  onToggleTrackChanges: () => void;
  trackChangesList: TrackChangeItem[];
  onAcceptTrackChange: (id: string) => void;
  onRejectTrackChange: (id: string) => void;
  onAcceptAllTrackChanges: () => void;
  onRejectAllTrackChanges: () => void;
  editor: Editor | null;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onAddReply,
  trackChangesActive,
  onToggleTrackChanges,
  trackChangesList,
  onAcceptTrackChange,
  onRejectTrackChange,
  onAcceptAllTrackChanges,
  onRejectAllTrackChanges,
  editor,
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'track'>('comments');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const handleCreateComment = () => {
    if (!newCommentText.trim()) return;
    const selection = editor?.state.selection;
    let selectedText = '';
    if (selection && !selection.empty) {
      selectedText = editor?.state.doc.textBetween(selection.from, selection.to) || '';
    }
    onAddComment(newCommentText, selectedText);
    setNewCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;
    onAddReply(commentId, replyText);
    setReplyText('');
    setReplyInputId(null);
  };

  return (
    <aside className="no-print w-80 bg-white border-l border-neutral-300 text-black flex flex-col h-full shadow-xs shrink-0 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-300 bg-neutral-100">
        <span className="font-bold text-xs uppercase tracking-wide">Review & Collaboration</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-neutral-200 rounded text-neutral-600 hover:text-black"
          title="Close Review Panel"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Tabs: Comments vs Track Changes */}
      <div className="flex border-b border-neutral-200 text-xs font-bold text-neutral-600 bg-neutral-50">
        <button
          type="button"
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'comments' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Comments ({comments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'track' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
          }`}
        >
          Track Changes ({trackChangesList.length})
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3">
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* Add Comment Box */}
            <div className="bg-neutral-50 p-3 rounded border border-neutral-300 space-y-2">
              <span className="font-bold text-black text-xs block">New Comment</span>
              <textarea
                placeholder="Type your comment here..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded p-2 text-xs focus:outline-none focus:border-black resize-none h-16"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateComment}
                  disabled={!newCommentText.trim()}
                  className="px-3 py-1 bg-black text-white font-bold text-xs rounded hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-neutral-400 text-center py-6">
                No comments on this document yet. Select text and post a comment above.
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded border space-y-2 transition-colors ${
                    c.resolved ? 'bg-neutral-50 border-neutral-200 opacity-60' : 'bg-white border-neutral-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">{c.author}</span>
                    <span className="text-[10px] text-neutral-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {c.selectedText && (
                    <div className="border-l-2 border-black pl-2 py-0.5 text-neutral-500 italic text-[11px] truncate">
                      "{c.selectedText}"
                    </div>
                  )}

                  <p className="text-neutral-800 leading-relaxed">{c.text}</p>

                  {/* Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="space-y-1.5 pl-3 border-l border-neutral-200 mt-2">
                      {c.replies.map((r) => (
                        <div key={r.id} className="text-[11px] space-y-0.5">
                          <span className="font-bold text-black">{r.author}: </span>
                          <span className="text-neutral-700">{r.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-200 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setReplyInputId(replyInputId === c.id ? null : c.id)}
                      className="text-neutral-600 hover:text-black font-semibold flex items-center gap-1"
                    >
                      <Reply className="w-3 h-3" /> Reply
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onResolveComment(c.id)}
                        className={`flex items-center gap-1 font-semibold ${c.resolved ? 'text-black font-bold' : 'text-neutral-500 hover:text-black'}`}
                      >
                        <Check className="w-3 h-3" /> {c.resolved ? 'Resolved' : 'Resolve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(c.id)}
                        className="text-neutral-400 hover:text-black"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Reply Input Box */}
                  {replyInputId === c.id && (
                    <div className="pt-2 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(c.id);
                        }}
                        className="flex-1 bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(c.id)}
                        className="px-2.5 py-1 bg-black text-white font-bold rounded text-xs"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'track' && (
          <div className="space-y-4">
            {/* Toggle Track Changes */}
            <div className="p-3 bg-neutral-50 border border-neutral-300 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-black block">Track Changes</span>
                <span className="text-[11px] text-neutral-500">Record all edits made to text</span>
              </div>
              <button
                type="button"
                onClick={onToggleTrackChanges}
                className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${
                  trackChangesActive ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                }`}
              >
                {trackChangesActive ? 'Active (ON)' : 'Disabled (OFF)'}
              </button>
            </div>

            {/* Bulk Actions */}
            {trackChangesList.length > 0 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onAcceptAllTrackChanges}
                  className="flex-1 py-1.5 bg-black text-white font-bold rounded text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
                <button
                  type="button"
                  onClick={onRejectAllTrackChanges}
                  className="flex-1 py-1.5 bg-neutral-200 text-black font-bold rounded text-xs hover:bg-neutral-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject All</span>
                </button>
              </div>
            )}

            {/* List of Revisions */}
            {trackChangesList.length === 0 ? (
              <div className="text-neutral-400 text-center py-6">
                No tracked revisions pending review.
              </div>
            ) : (
              trackChangesList.map((item) => (
                <div key={item.id} className="p-3 bg-white border border-neutral-300 rounded shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black uppercase text-[10px]">{item.type}</span>
                    <span className="text-[10px] text-neutral-400">{item.author}</span>
                  </div>
                  <div className={`p-1.5 rounded font-mono text-[11px] ${item.type === 'addition' ? 'bg-neutral-100 text-black font-bold' : 'line-through text-neutral-400 bg-neutral-50'}`}>
                    {item.text}
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onAcceptTrackChange(item.id)}
                      className="px-2 py-1 bg-black text-white rounded font-bold text-[11px]"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectTrackChange(item.id)}
                      className="px-2 py-1 bg-neutral-200 text-black rounded font-bold text-[11px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
