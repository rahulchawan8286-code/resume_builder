import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { ZoomIn, ZoomOut, Download, Printer, Loader2 } from 'lucide-react';
import ResumeDocument from './ResumeDocument';
import { pdfAPI } from '@/services/apiServices';
import toast from 'react-hot-toast';

export default function PreviewPanel({ resumeId }) {
  const { zoomLevel, setZoomLevel } = useResumeStore();
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  const adjustZoom = (delta) => {
    const next = Math.min(150, Math.max(50, zoomLevel + delta));
    setZoomLevel(next);
  };

  const handleExportPdf = async () => {
    if (!resumeId) { toast.error('Save your resume first before exporting.'); return; }
    setExporting(true);
    try {
      const res = await pdfAPI.generate({ resumeId });
      // Create a blob and trigger browser download
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error(err.response?.data?.message || 'PDF generation failed');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = async () => {
    if (!resumeId) { toast.error('Save your resume first before printing.'); return; }
    setPrinting(true);
    try {
      const res = await pdfAPI.print({ resumeId });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      // Open in new tab so the browser print dialog launches
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('Print error:', err);
      toast.error(err.response?.data?.message || 'Print failed');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-sm">
        <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
        <div className="flex items-center gap-2">
          <button onClick={() => adjustZoom(-10)} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[40px] text-center text-xs font-semibold">{zoomLevel}%</span>
          <button onClick={() => adjustZoom(10)} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-border" />
          <button
            onClick={handlePrint}
            disabled={printing}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-60"
          >
            {printing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
            Print
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {exporting ? 'Generating…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Preview canvas */}
      <div className="flex-1 overflow-auto bg-muted/40 p-6 flex justify-center">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            width: '210mm',
          }}
        >
          <ResumeDocument />
        </div>
      </div>
    </div>
  );
}
