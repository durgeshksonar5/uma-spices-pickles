import React from 'react';
import { MessageCircle } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export const WhatsAppFloatingButton = () => {
  const cleanNumber = businessConfig.whatsAppNumber.replace(/\D/g, '');
  const whatsAppUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello! I have a question about your spices and pickles.")}`;

  return (
    <a
      href={whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Need Help? Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-xl hover:bg-[#20ba5a] transition-all transform hover:scale-105 group border border-white/30"
    >
      <MessageCircle className="w-5 h-5 fill-current shrink-0" />
      <span className="text-xs sm:text-sm tracking-wide">
        <span className="hidden sm:inline">Need Help? Chat on WhatsApp</span>
        <span className="sm:hidden font-semibold">Chat</span>
      </span>
    </a>
  );
};
