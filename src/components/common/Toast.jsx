import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
              isSuccess
                ? 'bg-[#506B2F] text-white border-[#506B2F]/30'
                : isError
                ? 'bg-red-800 text-white border-red-900/30'
                : 'bg-[#7A1F1F] text-white border-[#7A1F1F]/30'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#E6A817]" />}
            {isError && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-200" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#E6A817]" />}

            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
