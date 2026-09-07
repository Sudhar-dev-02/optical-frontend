import React, { useRef } from 'react';
import { Printer, X, Eye, Phone, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function InvoicePrintModal({ bill, isDuplicate, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  if (!bill) return null;

  const formattedDate = bill.date 
    ? new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
    : '07-07-2026';

  const deliveryDateFormatted = bill.deliveryDate 
    ? new Date(bill.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
    : formattedDate;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-cyan-300">
              {isDuplicate ? 'DUPLICATE BILL RECEIPT' : 'OPTICAL BILL INVOICE'} #{bill.billNo}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 overflow-y-auto bg-slate-950 text-slate-900 print-area" ref={printRef}>
          <div className="bg-white p-6 rounded-xl text-slate-900 shadow-inner font-sans relative border border-slate-300">
            {/* Watermark for Duplicate Bill */}
            {isDuplicate && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <span className="text-6xl font-black uppercase tracking-widest text-red-600 transform -rotate-45 select-none">
                  DUPLICATE COPY
                </span>
              </div>
            )}

            {/* Header / Shop Info */}
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4 space-y-1">
              <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden mb-1">
                <img 
                  src={logoImg} 
                  alt="Optics India Logo" 
                  className="w-full h-full object-contain scale-130" 
                />
              </div>
              <h1 className="text-2xl font-brand font-semibold tracking-tight text-slate-900 flex items-center justify-center gap-0.5">
                <span>Optics</span>
                <span className="text-sky-500 font-medium">India</span>
              </h1>
              <p className="text-xs font-semibold text-slate-700">Optical Company & Prescription Specialists</p>
              <p className="text-[11px] text-slate-600">Tiruvannamalai -3. Ph: +91 90432 29107 / +91 99524 17748</p>
            </div>

            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 text-xs border border-slate-300 rounded p-2.5 mb-4 bg-slate-50 gap-y-1.5">
              <div>
                <span className="font-bold text-slate-700">Bill No: </span>
                <span className="font-mono font-bold text-slate-900">{bill.billNo}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Date: </span>
                <span className="font-mono text-slate-900">{formattedDate}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Customer Name: </span>
                <span className="font-semibold text-slate-900">{bill.customer?.name}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Phone: </span>
                <span className="font-mono text-slate-900">{bill.customer?.phone}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">MRD No: </span>
                <span className="font-mono text-slate-900">{bill.customer?.mrdNo || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Order Taken By: </span>
                <span className="font-semibold text-slate-900">{bill.customer?.orderTakenBy || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Prescribed By: </span>
                <span className="font-semibold text-slate-900">{bill.customer?.drName || '-'}</span>
              </div>
            </div>

            {/* Prescription Optical Grid */}
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-2 text-slate-800">
                Optical Prescription Details
              </h3>
              <table className="w-full text-[11px] text-center border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-1 border-r border-slate-300 text-left pl-2">EYE</th>
                    <th className="p-1 border-r border-slate-300">SPH</th>
                    <th className="p-1 border-r border-slate-300">CYL</th>
                    <th className="p-1 border-r border-slate-300">AXIS</th>
                    <th className="p-1 border-r border-slate-300">ADD</th>
                    <th className="p-1">VA.</th>
                  </tr>
                </thead>
                <tbody className="font-mono divide-y divide-slate-300 text-slate-900">
                  {/* RE */}
                  <tr>
                    <td className="p-1 font-sans font-bold text-red-700 border-r border-slate-300 text-left pl-2">RE</td>
                    <td className="p-1 border-r border-slate-300 font-bold">{bill.prescription?.rightEye?.sph || bill.prescription?.rightEye?.dv?.sphere || 'plano'}</td>
                    <td className="p-1 border-r border-slate-300">{bill.prescription?.rightEye?.cyl || bill.prescription?.rightEye?.dv?.cylinder || '-'}</td>
                    <td className="p-1 border-r border-slate-300">{bill.prescription?.rightEye?.axis || bill.prescription?.rightEye?.dv?.axis || '-'}</td>
                    <td className="p-1 border-r border-slate-300">{bill.prescription?.rightEye?.add || '-'}</td>
                    <td className="p-1">{bill.prescription?.rightEye?.va || '6/6'}</td>
                  </tr>

                  {/* LE */}
                  <tr>
                    <td className="p-1 font-sans font-bold text-blue-700 border-r border-slate-300 text-left pl-2">LE</td>
                    <td className="p-1 border-r border-slate-300 font-bold">{bill.prescription?.leftEye?.sph || bill.prescription?.leftEye?.dv?.sphere || 'plano'}</td>
                    <td className="p-1 border-r border-slate-300">{bill.prescription?.leftEye?.cyl || bill.prescription?.leftEye?.dv?.cylinder || '-'}</td>
                    <td className="p-1 border-r border-slate-300">{bill.prescription?.leftEye?.axis || bill.prescription?.leftEye?.dv?.axis || '-'}</td>
                    <td className="p-1 border-r border-slate-300">{bill.prescription?.leftEye?.add || '-'}</td>
                    <td className="p-1">{bill.prescription?.leftEye?.va || '6/6'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mt-1.5 px-1 font-mono">
                <span>PD: {bill.prescription?.pd || '-'} mm</span>
                <span>R.I: {bill.prescription?.ri || '1.56'}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 mb-2 text-slate-800">
                Products & Accessories
              </h3>
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-1.5 border-r border-slate-300 text-left">Item Description</th>
                    <th className="p-1.5 border-r border-slate-300 text-left">Details (Brand / Coating / Warranty)</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Qty</th>
                    <th className="p-1.5 text-right">Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {bill.lens && (bill.lens.price > 0 || bill.lens.type) && (
                    <tr>
                      <td className="p-1.5 border-r border-slate-300 font-bold text-sky-800">LENS - {bill.lens.type || 'Single Vision'}</td>
                      <td className="p-1.5 border-r border-slate-300 uppercase text-slate-800">
                        <span className="font-semibold">{bill.lens.brand || 'Essilor'}</span>
                        <span className="text-slate-500 font-normal"> | Coating: {bill.lens.coating || 'HMC'}</span>
                        <span className="text-slate-600 font-medium"> [W: {bill.lens.warranty || 'NIL'}]</span>
                      </td>
                      <td className="p-1.5 border-r border-slate-300 text-center font-mono">{bill.lens.qty || 1}</td>
                      <td className="p-1.5 text-right font-mono font-bold">₹ {(Number(bill.lens.price) || 0) * (Number(bill.lens.qty) || 1)}</td>
                    </tr>
                  )}
                  {bill.frame && (bill.frame.price > 0 || bill.frame.type) && (
                    <tr>
                      <td className="p-1.5 border-r border-slate-300 font-bold text-amber-800">FRAME - {bill.frame.type || 'Full frame'}</td>
                      <td className="p-1.5 border-r border-slate-300 uppercase text-slate-800">
                        <span className="font-semibold">{bill.frame.brand || 'Titan'}</span>
                        <span className="text-slate-600 font-medium"> [W: {bill.frame.warranty || 'NIL'}]</span>
                      </td>
                      <td className="p-1.5 border-r border-slate-300 text-center font-mono">{bill.frame.qty || 1}</td>
                      <td className="p-1.5 text-right font-mono font-bold">₹ {(Number(bill.frame.price) || 0) * (Number(bill.frame.qty) || 1)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Totals Breakup */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div className="border border-slate-300 rounded p-2.5 bg-slate-50 space-y-1">
                <p><span className="font-bold text-slate-700">Pay Mode: </span><span className="font-semibold uppercase">{bill.payMode || 'CASH'}</span></p>
                <p><span className="font-bold text-slate-700">Expected Delivery: </span><span className="font-mono font-bold">{deliveryDateFormatted}</span></p>
                <p><span className="font-bold text-slate-700">Delivery Status: </span><span className="font-semibold text-emerald-700">{bill.deliveryStatus || 'Pending'}</span></p>
              </div>

              <div className="space-y-1 text-right font-mono">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">Total Gross:</span>
                  <span className="font-bold">₹ {(bill.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">Discount:</span>
                  <span className="text-slate-800">₹ {(bill.discountAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-300 pt-1 text-slate-900">
                  <span className="font-sans">Net Amount:</span>
                  <span className="text-sm">₹ {(bill.netAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span className="font-sans font-semibold">Advance Paid:</span>
                  <span className="font-bold">₹ {(bill.advanceAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-red-600 border-t border-slate-300 pt-1">
                  <span className="font-sans">Balance Amount:</span>
                  <span className="text-sm">₹ {(bill.balanceAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature & Footer Terms */}
            <div className="flex items-end justify-between text-[11px] text-slate-600 pt-4 border-t border-slate-300">
              <div>
                <p className="font-bold text-slate-800">Terms & Conditions:</p>
                <p>1. Please bring this bill receipt during delivery.</p>
                <p>2. Goods once sold cannot be taken back or exchanged.</p>
              </div>

              <div className="text-center font-semibold text-slate-800">
                <div className="h-10"></div>
                <p className="border-t border-slate-400 pt-1 px-4">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
