import React, { useState } from 'react';
import {
  X,
  Mail,
  Users,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Download,
  Printer,
} from 'lucide-react';
import { RecipientItem } from '../types/document';
import { Editor } from '@tiptap/react';

interface MailMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  recipients: RecipientItem[];
  onUpdateRecipients: (recipients: RecipientItem[]) => void;
}

const DEFAULT_RECIPIENTS: RecipientItem[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    company: 'Apex Corporation',
    email: 'sarah.j@apex.example',
    address: '100 Innovation Way',
    city: 'San Francisco',
    country: 'USA',
  },
  {
    id: '2',
    firstName: 'Arthur',
    lastName: 'Vance',
    company: 'Horizon Logistics',
    email: 'a.vance@horizon.example',
    address: '1200 Harbor Blvd',
    city: 'Seattle',
    country: 'USA',
  },
  {
    id: '3',
    firstName: 'Elena',
    lastName: 'Rostova',
    company: 'Vanguard Dynamics',
    email: 'elena@vanguard.example',
    address: '450 King Street',
    city: 'Toronto',
    country: 'Canada',
  },
];

export const MailMergeModal: React.FC<MailMergeModalProps> = ({
  isOpen,
  onClose,
  editor,
  recipients,
  onUpdateRecipients,
}) => {
  const [activeStep, setActiveStep] = useState<'recipients' | 'fields' | 'preview'>('recipients');
  const [previewIndex, setPreviewIndex] = useState(0);

  // Form for adding new recipient
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');

  if (!isOpen || !editor) return null;

  const currentList = recipients.length > 0 ? recipients : DEFAULT_RECIPIENTS;

  const handleAddRecipient = () => {
    if (!newFirst && !newCompany) return;
    const item: RecipientItem = {
      id: Date.now().toString(),
      firstName: newFirst.trim() || 'Valued',
      lastName: newLast.trim() || 'Client',
      company: newCompany.trim() || 'Enterprise Partner',
      email: newEmail.trim() || 'client@example.com',
      address: newAddress.trim() || '100 Main Street',
      city: 'Metropolis',
      country: 'USA',
    };
    onUpdateRecipients([...currentList, item]);
    setNewFirst('');
    setNewLast('');
    setNewCompany('');
    setNewEmail('');
    setNewAddress('');
  };

  const handleDeleteRecipient = (id: string) => {
    onUpdateRecipients(currentList.filter((r) => r.id !== id));
  };

  const handleInsertField = (fieldName: string) => {
    editor.chain().focus().insertContent(`<strong>«${fieldName}»</strong> `).run();
  };

  // Compute merged HTML preview for active recipient
  const activeRecipient = currentList[previewIndex] || currentList[0];
  const originalHtml = editor.getHTML();
  const mergedHtml = originalHtml
    .replace(/«First_Name»/g, activeRecipient.firstName)
    .replace(/«Last_Name»/g, activeRecipient.lastName)
    .replace(/«Company»/g, activeRecipient.company)
    .replace(/«Email»/g, activeRecipient.email)
    .replace(/«Address»/g, activeRecipient.address)
    .replace(/«City»/g, activeRecipient.city);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-black border border-neutral-700 text-white rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-white stroke-[2.2]" />
            <div>
              <h3 className="font-bold text-base">Mail Merge Wizard</h3>
              <p className="text-xs text-neutral-400">
                Personalize document letters for batch recipients.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Wizard Step Navigation */}
        <div className="flex border-b border-neutral-800 text-xs font-bold text-neutral-400 bg-neutral-950 p-1 rounded">
          <button
            type="button"
            onClick={() => setActiveStep('recipients')}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              activeStep === 'recipients' ? 'bg-white text-black shadow-xs font-extrabold' : 'hover:text-white'
            }`}
          >
            1. Recipients ({currentList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('fields')}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              activeStep === 'fields' ? 'bg-white text-black shadow-xs font-extrabold' : 'hover:text-white'
            }`}
          >
            2. Insert Merge Fields
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('preview')}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              activeStep === 'preview' ? 'bg-white text-black shadow-xs font-extrabold' : 'hover:text-white'
            }`}
          >
            3. Preview & Merge
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-2 text-xs space-y-4">
          {/* STEP 1: RECIPIENTS */}
          {activeStep === 'recipients' && (
            <div className="space-y-4">
              {/* Add Recipient Form */}
              <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-lg space-y-2.5">
                <span className="font-bold text-white text-xs block">Add New Recipient</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newFirst}
                    onChange={(e) => setNewFirst(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newLast}
                    onChange={(e) => setNewLast(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Address / Street"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white col-span-2"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddRecipient}
                    className="px-3.5 py-1.5 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors"
                  >
                    + Add Recipient
                  </button>
                </div>
              </div>

              {/* Recipient Table */}
              <div className="space-y-1.5">
                <span className="font-bold text-neutral-400 text-xs block">Recipient Database:</span>
                <div className="border border-neutral-800 rounded overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Company</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Address</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {currentList.map((r) => (
                        <tr key={r.id} className="hover:bg-neutral-900/50">
                          <td className="p-2 font-bold text-white">{r.firstName} {r.lastName}</td>
                          <td className="p-2 text-neutral-300">{r.company}</td>
                          <td className="p-2 text-neutral-400">{r.email}</td>
                          <td className="p-2 text-neutral-400">{r.address}</td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteRecipient(r.id)}
                              className="text-neutral-500 hover:text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INSERT FIELDS */}
          {activeStep === 'fields' && (
            <div className="space-y-4">
              <p className="text-neutral-400 text-xs leading-relaxed">
                Click any placeholder field below to insert it at your cursor in the document. When generating or printing, each placeholder will be automatically substituted with each recipient's specific data.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: 'First Name', field: 'First_Name' },
                  { label: 'Last Name', field: 'Last_Name' },
                  { label: 'Company / Org', field: 'Company' },
                  { label: 'Email Address', field: 'Email' },
                  { label: 'Street Address', field: 'Address' },
                  { label: 'City', field: 'City' },
                ].map((f) => (
                  <button
                    key={f.field}
                    type="button"
                    onClick={() => handleInsertField(f.field)}
                    className="p-3 bg-neutral-900 border border-neutral-700 hover:border-white rounded text-left transition-colors font-bold text-xs flex items-center justify-between group"
                  >
                    <span>«{f.field}»</span>
                    <Plus className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                  </button>
                ))}
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded text-neutral-400 text-[11px]">
                Tip: Type standard greeting lines like: <em>"Dear «First_Name»,"</em> or company headings like: <em>"Attention: «Company»"</em>.
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & MERGE */}
          {activeStep === 'preview' && (
            <div className="space-y-4">
              {/* Recipient Pager */}
              <div className="flex items-center justify-between p-2.5 bg-neutral-900 border border-neutral-800 rounded">
                <span className="font-bold text-xs text-white">
                  Previewing Record {previewIndex + 1} of {currentList.length}: {activeRecipient.firstName} {activeRecipient.lastName} ({activeRecipient.company})
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                    disabled={previewIndex === 0}
                    className="p-1 hover:bg-neutral-800 disabled:opacity-30 rounded text-white"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewIndex((prev) => Math.min(currentList.length - 1, prev + 1))}
                    disabled={previewIndex === currentList.length - 1}
                    className="p-1 hover:bg-neutral-800 disabled:opacity-30 rounded text-white"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Rendered Preview Container */}
              <div className="bg-white text-black p-6 rounded shadow-inner max-h-60 overflow-y-auto text-xs border border-neutral-400">
                <div dangerouslySetInnerHTML={{ __html: mergedHtml }} />
              </div>

              {/* Merge Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Update document with currently previewed recipient
                    editor.commands.setContent(mergedHtml);
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors text-xs text-center"
                >
                  Apply Current Record to Document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white"
          >
            Close
          </button>

          {activeStep !== 'preview' ? (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep === 'recipients' ? 'fields' : 'preview')}
              className="px-4 py-2 text-xs font-bold bg-white text-black rounded hover:bg-neutral-200"
            >
              Next Step ➔
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-white text-black rounded hover:bg-neutral-200"
            >
              Finish Wizard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
