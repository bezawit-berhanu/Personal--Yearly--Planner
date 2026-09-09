import { useState, useEffect } from 'react';
import api from '../api/client';
import SectionHeader from '../components/shared/SectionHeader';
import { FileText, Upload, Trash2, ExternalLink, Image as ImageIcon, File, Check, Loader2 } from 'lucide-react';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('General');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

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
      };
    } catch (err) {
      setError(err.response?.data?.error || 'File upload failed.');
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(files.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Files & Scanned Documents Tracker"
        description="Upload scanned pictures, receipts, contracts, or documents to track and access anytime."
      />

      {/* Upload Box */}
      <div className="bg-white border border-pink-200 p-6 rounded-sm shadow-sm">
        <h3 className="font-serif text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-pink-500" />
          Upload New File / Scanned Picture
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Select File / Scan
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="modal-input text-xs cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                File Display Name
              </label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Passport Scan, Rent Receipt..."
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Category / Section
              </label>
              <select
                className="modal-select"
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
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Notes & Description
            </label>
            <input
              type="text"
              className="modal-input"
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
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-slate-800">
            Uploaded Files ({files.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading tracked files...</div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic text-sm">
            No files tracked yet. Use the form above to upload scanned pictures or documents.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {files.map((file) => (
              <div key={file.id} className="border border-slate-200 p-4 rounded-sm hover:border-pink-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {file.file_url?.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
                        <ImageIcon className="w-5 h-5 text-pink-500 shrink-0" />
                      ) : (
                        <File className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <h4 className="font-bold text-sm text-slate-800 truncate" title={file.file_name}>
                        {file.file_name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="badge badge-pink mb-2">{file.section_category || 'General'}</span>

                  {file.notes && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{file.notes}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-400">
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
    </div>
  );
}
