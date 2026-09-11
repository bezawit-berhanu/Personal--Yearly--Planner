import { useState, useEffect } from 'react';
import api from '../api/client';
import SectionHeader from '../components/shared/SectionHeader';
import ConfirmDeleteModal from '../components/shared/ConfirmDeleteModal';
import { FileText, Upload, Trash2, ExternalLink, Image as ImageIcon, File, Loader2 } from 'lucide-react';

function parseErrorText(err) {
  if (!err) return '';
  const e = err.response?.data?.error ?? err.response?.data ?? err.message ?? err;
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && e !== null) {
    return e.message || e.error || (e.code ? `Error (${e.code}): ${e.message || JSON.stringify(e)}` : JSON.stringify(e));
  }
  return 'File operation failed.';
}

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('General');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data.files || []);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) setFileName(file.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result;
          await api.post('/files/upload', {
            file_base64: base64data,
            file_name: fileName || selectedFile.name,
            section_category: category,
            notes
          });

          setSelectedFile(null);
          setFileName('');
          setNotes('');
          setUploading(false);
          fetchFiles();
        } catch (err) {
          setError(parseErrorText(err));
          setUploading(false);
        }
      };
    } catch (err) {
      setError(parseErrorText(err));
      setUploading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/files/${deleteTargetId}`);
      setFiles(files.filter(f => f.id !== deleteTargetId));
    } catch (err) {
      console.error('Failed to delete file:', err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const targetFileToDelete = files.find(f => f.id === deleteTargetId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Files & Scanned Documents Tracker"
        description="Upload scanned pictures, receipts, contracts, or documents to track and access anytime."
      />

      {/* Upload Form */}
      <div className="p-6 rounded-sm bg-white/40 backdrop-blur-md border-b border-pink-100/50">
        <h3 className="font-serif text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-pink-600" />
          Upload New File / Scanned Picture
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-rose-50/90 text-rose-800 text-xs font-bold rounded-sm border-l-2 border-rose-500">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Select File / Scan
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="modal-input text-xs cursor-pointer font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                File Display Name
              </label>
              <input
                type="text"
                className="modal-input font-semibold"
                placeholder="e.g. Passport Scan, Rent Receipt..."
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Category / Section
              </label>
              <select
                className="modal-select font-semibold"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General Document</option>
                <option value="Personal ID">Personal ID / Passports</option>
                <option value="Receipts & Finance">Receipts & Finance</option>
                <option value="Health & Medical">Health & Medical Scans</option>
                <option value="Certificates & Education">Certificates & Education</option>
                <option value="Legal & Contracts">Legal & Contracts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Notes & Description
            </label>
            <input
              type="text"
              className="modal-input font-semibold"
              placeholder="Additional notes about this file..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="btn-primary text-xs justify-center"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloud...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload & Track File
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-pink-100/50 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-slate-900">
            Uploaded Files ({files.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-600 text-xs font-semibold">Loading tracked files...</div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium italic text-sm">
            No files tracked yet. Use the form above to upload scanned pictures or documents.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.id} className="p-4 rounded-sm bg-white/60 backdrop-blur-xs border-b-2 border-pink-100 hover:border-pink-300 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {file.file_url?.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                        <ImageIcon className="w-5 h-5 text-pink-600 shrink-0" />
                      ) : (
                        <File className="w-5 h-5 text-slate-600 shrink-0" />
                      )}
                      <h4 className="font-bold text-sm text-slate-900 truncate" title={file.file_name}>
                        {file.file_name}
                      </h4>
                    </div>
                    <button
                      onClick={() => setDeleteTargetId(file.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="badge badge-pink mb-2">{file.section_category || 'General'}</span>

                  {file.notes && (
                    <p className="text-xs font-semibold text-slate-700 mb-3 line-clamp-2">{file.notes}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-pink-100/40 flex items-center justify-between mt-2">
                  <span className="text-[11px] font-bold text-slate-600">
                    {new Date(file.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs py-1 px-2.5"
                  >
                    View / Download <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDeleteFile}
        title="Delete Uploaded File"
        message={`Are you sure you want to delete file "${targetFileToDelete?.file_name || 'selected file'}"? This action cannot be undone.`}
      />
    </div>
  );
}
