import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toast, setToast } = useAuth();

  if (!toast) return null;

  const { message, type } = toast;

  const bgColors = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-rose-500 text-white',
    info: 'bg-primary-500 text-white',
    warning: 'bg-amber-500 text-slate-900',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 mr-2 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />,
    info: <Info className="w-5 h-5 mr-2 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce md:animate-none">
      <div className={`flex items-center px-4 py-3 rounded-lg shadow-2xl transition-all duration-300 ${bgColors[type] || bgColors.info}`}>
        {icons[type]}
        <span className="font-medium mr-4">{message}</span>
        <button
          onClick={() => setToast(null)}
          className="hover:opacity-75 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
