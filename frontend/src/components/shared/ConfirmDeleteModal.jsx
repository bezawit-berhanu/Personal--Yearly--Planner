import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  title = 'Delete Entry',
  message = 'Are you sure you want to delete this entry? This action cannot be undone.',
  onConfirm,
  onCancel,
  onClose
}) {
  const handleClose = onCancel || onClose || (() => {});
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="glass-modal max-w-sm w-full p-6 rounded-none space-y-4 shadow-2xl border border-[#C5A059]/40 bg-[#FFFDF7]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B0D18] leading-tight">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-[#6B1D2F]/60 hover:text-[#6B1D2F] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#3B0D18]/80 font-medium leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#C5A059]/30">
          <button
            onClick={handleClose}
            className="btn-secondary text-xs px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger text-xs px-4 py-2 cursor-pointer bg-rose-800 hover:bg-rose-900 text-white font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
