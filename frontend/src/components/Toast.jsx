import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Toast({ message, visible }) {
  if (!visible || !message) return null;

  return (
    <div className={`toast-notice ${visible ? 'show' : ''}`}>
      <Sparkles size={16} />
      <span>{message}</span>
    </div>
  );
}
