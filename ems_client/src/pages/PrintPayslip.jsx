import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { dummyPayslipData } from '../assets/assets'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import { Download, Loader2Icon, Building2, CheckCircle2, ShieldCheck, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { jsPDF } from 'jspdf' 
import { toPng } from 'html-to-image'

const PrintPayslip = () => {
  const { id } = useParams()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [isDownloading, setIsDownloading] = useState(false)
  const pdfRef = useRef()

  useEffect(() => {
    const data = dummyPayslipData.find((slip) => String(slip._id) === String(id))
    setPayslip(data)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-zinc-950">
            <p className='text-sm font-bold text-zinc-500 uppercase tracking-widest'>Payslip not found</p>
        </div>
    )
  }

  return (
    // 🚀 FULL ZINC BLACK BACKGROUND (The Dark Void)
    <div className='min-h-screen bg-zinc-950 py-16 flex justify-center animate-fade-in px-4'>
      
      {/* 🚀 PARENT WRAPPER */}
      <div className="relative group w-full max-w-4xl mt-4">
        
        {/* 🚀 THE MAGIC FLOATING BUTTON (Moved to Top Right & Made Bright to pop on black) */}
        {/* Hover slide down logic: Defaults to slightly shifted up and invisible, on hover slides down into place */}
        <div className="absolute -top-7 right-6 sm:right-10 z-50 transition-all duration-500 ease-out opacity-100 sm:opacity-0 sm:-translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
          <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className='px-7 py-3.5 rounded-full text-[12px] font-black uppercase tracking-widest text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-80 disabled:hover:scale-100 disabled:active:scale-100' 
          >
            {isDownloading ? (
               <>
                 <Loader2Icon className="w-5 h-5 animate-spin text-zinc-500" />
                 Processing...
               </>
            ) : (
               <>
                 <Download className="w-5 h-5 text-emerald-600" />
                 Download PDF
               </>
            )}
          </button>
        </div>

        {/* 🚀 THE ULTRA-PREMIUM PDF CARD */}
        {/* Added a massive, deep black shadow to make it literally pop off the dark background */}
        <div 
          ref={pdfRef} 
          className='w-full bg-white rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-zinc-800 overflow-hidden relative transition-all duration-500 group-hover:shadow-[0_0_100px_rgba(0,0,0,0.9)]'
        >
          
          {/* Subtle Background Pattern & Watermark */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -top-24 -right-24 opacity-[0.02] rotate-12 pointer-events-none z-0">
              <Building2 className="w-100 h-100" />
          </div>

          {/* ======== HEADER ======== */}
          <div className='relative z-10 px-10 pt-12 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-100'>
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
                  <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                  <h1 className='text-3xl font-black text-zinc-900 tracking-tight uppercase'>Acme Corp.</h1>
                  <div className="flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <p className='text-[11px] font-bold text-zinc-500 uppercase tracking-widest'>Verified Payroll</p>
                  </div>
              </div>
            </div>
            
            <div className='text-left sm:text-right'>
              <h2 className='text-5xl font-black text-zinc-100 tracking-tighter uppercase mb-2 select-none'>Payslip</h2>
              <div className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200/80 px-4 py-1.5 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className='text-xs font-bold text-zinc-800 uppercase tracking-widest'>
                      {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                  </p>
              </div>
            </div>
          </div>

          {/* ======== EMPLOYEE DETAILS ======== */}
          <div className="relative z-10 px-10 py-10">
              <div className='flex flex-wrap gap-y-8 rounded-2xl'>
                  <div className="w-1/2 sm:w-1/4 border-l-2 border-zinc-200/60 pl-4">
                      <p className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5'>Employee Name</p>
                      <p className='text-base font-bold text-zinc-900 capitalize'>{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
                  </div>
                  <div className="w-1/2 sm:w-1/4 border-l-2 border-zinc-200/60 pl-4">
                      <p className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5'>Designation</p>
                      <p className='text-base font-bold text-zinc-900 capitalize'>{payslip.employee?.position}</p>
                  </div>
                  <div className="w-1/2 sm:w-1/4 border-l-2 border-zinc-200/60 pl-4">
                      <p className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5'>Contact Email</p>
                      <p className='text-base font-bold text-zinc-900'>{payslip.employee?.email}</p>
                  </div>
                  <div className="w-1/2 sm:w-1/4 border-l-2 border-zinc-200/60 pl-4">
                      <p className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5'>Payment Status</p>
                      <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <p className='text-sm font-bold text-emerald-600 uppercase tracking-widest'>Paid</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* ======== SALARY BREAKDOWN ======== */}
          <div className="relative z-10 px-10 mb-12">
              <div className="bg-zinc-50/50 rounded-3xl p-8 border border-zinc-100">
                  <p className='text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-6'>Earnings & Deductions</p>
                  
                  <div className="space-y-6">
                      {/* Basic Salary */}
                      <div className="flex items-end justify-between group/row">
                          <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-zinc-100 shadow-sm relative z-10">
                              <div className="p-2 bg-zinc-100 rounded-xl text-zinc-600"><Wallet className="w-5 h-5" /></div>
                              <div>
                                  <p className="text-sm font-bold text-zinc-900">Basic Salary</p>
                                  <p className="text-[11px] font-medium text-zinc-500">Fixed monthly pay</p>
                              </div>
                          </div>
                          <div className="flex-1 border-b-2 border-dashed border-zinc-200 mx-4 mb-5 opacity-50 transition-opacity group-hover/row:opacity-100"></div>
                          <div className="bg-white px-5 py-3 rounded-2xl border border-zinc-100 shadow-sm relative z-10">
                              <p className="text-lg font-black text-zinc-900">${payslip.basicSalary?.toLocaleString()}</p>
                          </div>
                      </div>

                      {/* Allowances */}
                      <div className="flex items-end justify-between group/row">
                          <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-zinc-100 shadow-sm relative z-10">
                              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><ArrowUpRight className="w-5 h-5" /></div>
                              <div>
                                  <p className="text-sm font-bold text-zinc-900">Allowances</p>
                                  <p className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-0.5 inline-block uppercase tracking-wider">Addition</p>
                              </div>
                          </div>
                          <div className="flex-1 border-b-2 border-dashed border-zinc-200 mx-4 mb-5 opacity-50 transition-opacity group-hover/row:opacity-100"></div>
                          <div className="bg-white px-5 py-3 rounded-2xl border border-zinc-100 shadow-sm relative z-10">
                              <p className="text-lg font-black text-emerald-600">+$ {payslip.allowances?.toLocaleString()}</p>
                          </div>
                      </div>

                      {/* Deductions */}
                      <div className="flex items-end justify-between group/row">
                          <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-zinc-100 shadow-sm relative z-10">
                              <div className="p-2 bg-rose-50 rounded-xl text-rose-600"><ArrowDownRight className="w-5 h-5" /></div>
                              <div>
                                  <p className="text-sm font-bold text-zinc-900">Deductions</p>
                                  <p className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded mt-0.5 inline-block uppercase tracking-wider">Tax & Others</p>
                              </div>
                          </div>
                          <div className="flex-1 border-b-2 border-dashed border-zinc-200 mx-4 mb-5 opacity-50 transition-opacity group-hover/row:opacity-100"></div>
                          <div className="bg-white px-5 py-3 rounded-2xl border border-zinc-100 shadow-sm relative z-10">
                              <p className="text-lg font-black text-rose-600">-$ {payslip.deductions?.toLocaleString()}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* ======== NET SALARY HIGHLIGHT ======== */}
          <div className="relative z-10 bg-zinc-950 text-white p-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 border-t-8 ">
              <div>
                  <p className='text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2'>Total Net Payable</p>
                  <div className="flex items-center gap-3">
                      <p className='text-sm font-medium text-zinc-300'>Amount credited to employee account</p>
                  </div>
              </div>
              <div className='text-right'>
                  <p className='text-5xl sm:text-6xl font-black tracking-tighter'>
                      <span className="text-zinc-600 font-medium text-4xl mr-1">$</span>
                      {payslip.netSalary?.toLocaleString()}
                  </p>
              </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PrintPayslip