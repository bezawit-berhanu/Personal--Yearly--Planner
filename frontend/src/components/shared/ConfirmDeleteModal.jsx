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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="glass-modal max-w-sm w-full p-6 rounded-sm space-y-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-pink-100/50">
          <button
            onClick={handleClose}
            className="btn-secondary text-xs px-4 py-2 rounded-full cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger text-xs px-4 py-2 rounded-full cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
