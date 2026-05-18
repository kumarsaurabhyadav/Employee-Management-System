import React, { useEffect, useState } from 'react';
import { Download, RefreshCcw, Search, FileText, Users } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminCertificates = () => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadRecords = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses/certificates');
      setRecords(data || []);
      setFiltered(data || []);
    } catch (error) {
      console.error('load certificate records failed', error);
      toast.error('Unable to load certificate records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(records);
      return;
    }

    const lower = query.toLowerCase();
    setFiltered(records.filter((record) =>
      record.courseTitle?.toLowerCase().includes(lower) ||
      record.userEmail?.toLowerCase().includes(lower) ||
      record.userName?.toLowerCase().includes(lower)
    ));
  }, [query, records]);

  const handleDownload = async (record) => {
    try {
      const resp = await api.get(`/courses/${record.courseId}/certificate`, {
        params: { userId: record.userId },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${record.courseTitle.replace(/\s+/g, '-')}-${record.userEmail}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded');
    } catch (error) {
      console.error('download failed', error);
      toast.error(error.response?.data?.error || 'Download failed');
    }
  };

  const handleRegenerate = async (record) => {
    try {
      await api.post(`/courses/${record.courseId}/certificate/regenerate`, { userId: record.userId });
      toast.success('Certificate regenerated');
      loadRecords();
    } catch (error) {
      console.error('regenerate failed', error);
      toast.error(error.response?.data?.error || 'Failed to regenerate certificate');
    }
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Certificate Management</h1>
          <p className="page-subtitle mt-1">View enrolled users, certificate status, and regenerate PDFs as needed.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadRecords} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <RefreshCcw size={16} />
            Refresh
          </button>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by course or employee..."
              className="card w-full py-3 pl-12 pr-4 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Certificate</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-zinc-500">Loading records...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-zinc-500">No certificate records found.</td>
              </tr>
            ) : (
              filtered.map((record) => (
                <tr key={`${record.courseId}-${record.userId}`} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-4">{record.courseTitle}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-zinc-900">{record.userName || record.userEmail}</div>
                    <div className="text-xs text-zinc-500">{record.userEmail}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{record.completed ? 'Completed' : 'In progress'}</span>
                      <span className="text-xs text-zinc-500">{record.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {record.certificatePath ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      onClick={() => handleRegenerate(record)}
                      className="btn-primary px-3 py-2 text-xs font-semibold"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => handleDownload(record)}
                      disabled={!record.certificatePath}
                      className={`btn-secondary px-3 py-2 text-xs font-semibold ${!record.certificatePath ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCertificates;
