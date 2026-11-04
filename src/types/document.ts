/**
 * Comprehensive document and editor types for DocEditor Word Processor
 */

export type DocumentMargin = 'normal' | 'narrow' | 'moderate' | 'wide' | 'custom';
export type PaperSize = 'a4' | 'letter' | 'legal' | 'a3' | 'executive';
export type ViewMode = 'page' | 'continuous' | 'read' | 'outline' | 'focus';
export type DocumentTheme = 'classic' | 'modern' | 'editorial' | 'minimal' | 'academic';

export interface DocumentMetadata {
  id: string;
  title: string;
  author: string;
  company: string;
  subject: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isReadOnly: boolean;
  isPasswordProtected: boolean;
  passwordHash?: string;
  isFinal: boolean;
  folder?: string;
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  estimatedPages: number;
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  title: string;
  author: string;
  summary: string;
  content: string;
  wordCount: number;
}

export interface DocumentComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  selectedText: string;
  createdAt: string;
  resolved: boolean;
  replies: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
}

export interface TrackChangeItem {
  id: string;
  author: string;
  type: 'addition' | 'deletion';
  text: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CitationItem {
  id: string;
  type: 'book' | 'article' | 'website' | 'report';
  title: string;
  author: string;
  year: string;
  publisher?: string;
  url?: string;
  journal?: string;
}

export interface RecipientItem {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'General' | 'Business' | 'Academic' | 'Personal' | 'Marketing' | 'Certificates';
  content: string;
}

export interface PageLayoutSettings {
  marginPreset: DocumentMargin;
  paperSize: PaperSize;
  isLandscape: boolean;
  columns: 1 | 2 | 3;
  pageColor: string;
  pageBorder: 'none' | 'box' | 'double' | 'dashed';
  watermark: string;
  lineNumbers: boolean;
  hyphenation: boolean;
  textDirection: 'ltr' | 'rtl';
  headerText: string;
  footerText: string;
  showPageNumbers: boolean;
}
