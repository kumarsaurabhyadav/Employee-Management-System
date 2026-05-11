import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import { Download, Loader2Icon, Building2 } from 'lucide-react'
import { jsPDF } from 'jspdf' 
import { toPng } from 'html-to-image'
import api from '../api/axios'

const PrintPayslip = () => {
  const { id } = useParams()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [isDownloading, setIsDownloading] = useState(false)
  const pdfRef = useRef()

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/payslips/${id}`);
        setPayslip(res.data?.data || res.data);
      } catch (error) {
        console.error('Failed to fetch payslip:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    if (id) {
      fetchPayslip();
    }
  }, [id])

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = pdfRef.current;
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const pdf = new jsPDF('p', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Payslip_${payslip.employee?.firstName}_${format(new Date(payslip.year, payslip.month - 1), "MMM_yyyy")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF: ", error);
      alert("PDF generate nahi ho payi."); 
    } finally {
      setIsDownloading(false);
    }
  }

  if (loading) return <Loading />

  if (!payslip) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-zinc-50">
            <p className='text-sm font-bold text-zinc-500 uppercase tracking-widest'>Payslip not found</p>
        </div>
    )
  }

  const grossEarnings = (payslip.basicSalary || 0) + (payslip.allowances || 0);
  const totalDeductions = payslip.deductions || 0;

  return (
    <div className='min-h-screen bg-zinc-100 py-12 flex flex-col items-center animate-fade-in px-4'>
      
     {/* Action Bar */}
      <div className="w-full max-w-4xl flex justify-end mb-6">
        
        {/* 🚀 THE FIX: Standard "White to Black Hover" Button */}
        <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className='group px-6 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:pointer-events-none bg-white text-zinc-700 border border-zinc-200 hover:bg-black hover:text-white hover:border-black'
        >
          {isDownloading ? (
             <>
               <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400 group-hover:text-zinc-300" />
               Generating PDF...
             </>
          ) : (
             <>
               <Download className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
               Download PDF
             </>
          )}
        </button>
      </div>

      {/* ======== ACTUAL PAYSLIP DOCUMENT ======== */}
      <div 
        ref={pdfRef} 
        className='w-full max-w-4xl bg-white shadow-xl border border-zinc-300 p-10 sm:p-14 relative'
        style={{ minHeight: '297mm' }} 
      >
        
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-zinc-800 pb-8 mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className='text-2xl font-black text-zinc-900 uppercase tracking-tight'>Acme Corporation</h1>
                    <p className='text-xs text-zinc-600 mt-0.5'>123 Business Avenue, Tech District, City - 10001</p>
                </div>
            </div>
            <div className="text-right mt-4 sm:mt-0">
                <h2 className='text-3xl font-black text-zinc-300 uppercase tracking-widest'>Payslip</h2>
                <p className='text-sm font-bold text-zinc-800 mt-1 uppercase tracking-wider'>
                    {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                </p>
            </div>
        </div>

        <div className="mb-8 border border-zinc-300 rounded-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 bg-zinc-50 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                <div className="p-3 border-r border-b border-zinc-300">Employee Name</div>
                <div className="p-3 border-r border-b border-zinc-300">Designation</div>
                <div className="p-3 border-r border-b border-zinc-300">Email ID</div>
                <div className="p-3 border-b border-zinc-300">Status</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 text-sm font-semibold text-zinc-900">
                <div className="p-3 border-r border-zinc-300 capitalize">{payslip.employee?.firstName} {payslip.employee?.lastName}</div>
                <div className="p-3 border-r border-zinc-300 capitalize">{payslip.employee?.position || 'N/A'}</div>
                <div className="p-3 border-r border-zinc-300">{payslip.employee?.email}</div>
                <div className="p-3 text-emerald-600 uppercase font-bold">Paid</div>
            </div>
        </div>

        <div className="border border-zinc-300 rounded-sm flex flex-col md:flex-row mb-8">
            <div className="w-full md:w-1/2 border-r border-zinc-300 flex flex-col">
                <div className="bg-zinc-100 p-3 text-xs font-bold text-zinc-700 uppercase tracking-wider border-b border-zinc-300 flex justify-between">
                    <span>Earnings</span>
                    <span>Amount ($)</span>
                </div>
                <div className="flex-1 p-0">
                    <div className="flex justify-between p-3 border-b border-zinc-200 text-sm">
                        <span className="text-zinc-600 font-medium">Basic Salary</span>
                        <span className="font-semibold text-zinc-900">{payslip.basicSalary?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between p-3 border-b border-zinc-200 text-sm">
                        <span className="text-zinc-600 font-medium">Allowances</span>
                        <span className="font-semibold text-zinc-900">{payslip.allowances?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
                <div className="bg-zinc-50 p-3 flex justify-between border-t border-zinc-300 font-bold text-sm">
                    <span className="text-zinc-800 uppercase">Gross Earnings</span>
                    <span className="text-zinc-900">{grossEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
                <div className="bg-zinc-100 p-3 text-xs font-bold text-zinc-700 uppercase tracking-wider border-b border-zinc-300 flex justify-between">
                    <span>Deductions</span>
                    <span>Amount ($)</span>
                </div>
                <div className="flex-1 p-0">
                    <div className="flex justify-between p-3 border-b border-zinc-200 text-sm">
                        <span className="text-zinc-600 font-medium">Taxes & Deductions</span>
                        <span className="font-semibold text-zinc-900">{payslip.deductions?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
                <div className="bg-zinc-50 p-3 flex justify-between border-t border-zinc-300 font-bold text-sm">
                    <span className="text-zinc-800 uppercase">Total Deductions</span>
                    <span className="text-zinc-900">{totalDeductions.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
            </div>
        </div>

        <div className="bg-zinc-100 border border-zinc-300 rounded-sm p-6 flex justify-between items-center mb-16">
            <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Net Payable Amount</p>
                <p className="text-sm font-medium text-zinc-700 mt-1">Amount transferred to employee's bank account.</p>
            </div>
            <div className="text-right">
                <p className="text-3xl font-black text-zinc-900">
                    ${payslip.netSalary?.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </p>
            </div>
        </div>

        <div className="border-t border-zinc-300 pt-8 flex justify-between items-end mt-auto">
            <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                    This is a computer generated document.
                    <br />No signature is required.
                </p>
            </div>
            <div className="text-center">
                <div className="w-40 border-b border-zinc-400 mb-2"></div>
                <p className="text-xs font-bold text-zinc-600 uppercase">Authorized Signatory</p>
            </div>
        </div>

      </div>
    </div>
  )
}

export default PrintPayslip