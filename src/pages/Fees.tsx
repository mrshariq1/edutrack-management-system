import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { FeeInvoice, FeeStatus } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Printer,
  School,
  TrendingUp,
} from 'lucide-react';

export const Fees: React.FC = () => {
  const { fees, students, classes, settings, addFeeInvoice, recordPayment } = useEduTrack();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<FeeInvoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<FeeInvoice | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Card' | 'Bank Transfer' | 'Cash' | 'Online Portal'>('Bank Transfer');

  // New Invoice form state
  const initialInvoiceForm = {
    invoiceNumber: `INV-2026-${String(fees.length + 1).padStart(3, '0')}`,
    studentId: students[0]?.id || '',
    title: 'Academic Term II Tuition & STEM Lab Kit',
    amount: 4850,
    dueDate: '2026-10-31',
  };
  const [invoiceForm, setInvoiceForm] = useState(initialInvoiceForm);

  // Financial aggregates
  const totalRevenue = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.balance, 0);
  const totalOverdue = fees.filter(f => f.status === 'Overdue').reduce((sum, f) => sum + f.balance, 0);
  const collectionPercent = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  // Filtered invoices
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        f.studentName.toLowerCase().includes(q) ||
        f.invoiceNumber.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [fees, search, statusFilter]);

  const handleOpenPayment = (f: FeeInvoice) => {
    setPaymentInvoice(f);
    setPayAmount(f.balance > 0 ? f.balance : f.amount);
    setPayMethod('Bank Transfer');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice || payAmount <= 0) return;
    recordPayment(paymentInvoice.id, Number(payAmount), payMethod);
    setPaymentInvoice(null);
  };

  const handleSubmitAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === invoiceForm.studentId);
    if (!student) return;

    addFeeInvoice({
      invoiceNumber: invoiceForm.invoiceNumber,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      classId: student.classId,
      className: student.className,
      title: invoiceForm.title,
      amount: Number(invoiceForm.amount),
      dueDate: invoiceForm.dueDate,
      paidAmount: 0,
      balance: Number(invoiceForm.amount),
      status: 'Pending',
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Bursar Office
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono text-slate-500">${(totalRevenue / 1000).toFixed(1)}k Invoiced</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tuition Fees & Billing Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Receivables collection, payment reconciliation vouchers, and electronic fee receipts.
          </p>
        </div>

        <button
          onClick={() => {
            setInvoiceForm({
              ...initialInvoiceForm,
              invoiceNumber: `INV-2026-${String(fees.length + 1).padStart(3, '0')}`,
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Fee Invoice</span>
        </button>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#1769E0]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            ${totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Expected institutional receivables</span>
        </div>

        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400">
            <span className="font-bold uppercase tracking-wider">Paid</span>
            <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-2">
            ${totalPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600/80 mt-1 block font-mono font-semibold">{collectionPercent}% settled to date</span>
        </div>

        <div className="rounded-2xl border border-amber-100 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/20 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
            <span className="font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-[#F79009]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-2">
            ${totalPending.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-600/80 mt-1 block">Within standard payment grace</span>
        </div>

        <div className="rounded-2xl border border-rose-100 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400">
            <span className="font-bold uppercase tracking-wider">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-[#F04438]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700 dark:text-rose-300 mt-2">
            ${totalOverdue.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-600/80 mt-1 block">Past final deadline</span>
        </div>
      </div>

      {/* Filter and Invoices Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, invoice #, or fee category..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">All Invoice Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Student & Cohort</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Settled</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                    {fee.invoiceNumber}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {fee.studentName}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">{fee.className}</span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">
                    {fee.title}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    ${fee.amount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                    ${fee.paidAmount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {fee.dueDate}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <Badge
                      variant={
                        fee.status === 'Paid'
                          ? 'success'
                          : fee.status === 'Pending'
                          ? 'warning'
                          : 'danger'
                      }
                      dot
                    >
                      {fee.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingInvoice(fee)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Official Invoice / Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                      {fee.status !== 'Paid' && (
                        <button
                          onClick={() => handleOpenPayment(fee)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentInvoice && (
        <Modal
          isOpen={!!paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          title={`Record Fee Settlement: ${paymentInvoice.invoiceNumber}`}
          subtitle={`Student: ${paymentInvoice.studentName} · Remaining Balance: $${paymentInvoice.balance.toLocaleString()}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Settlement Amount ($) *
              </label>
              <input
                type="number"
                min="1"
                max={paymentInvoice.balance > 0 ? paymentInvoice.balance : paymentInvoice.amount}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-base"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total outstanding balance: ${paymentInvoice.balance.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remittance Channel
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              >
                <option value="Bank Transfer">Direct Wire / ACH Transfer</option>
                <option value="Card">Institutional Credit / Debit Card</option>
                <option value="Online Portal">Parent Online Portal</option>
                <option value="Cash">Bursar Cash Counter</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPaymentInvoice(null)}
                className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Post Settlement
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Official Invoice / Receipt Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title="Official Bursar Invoice & Receipt"
          subtitle="Certified tax invoice & fee settlement voucher"
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs p-2">
            {/* Header Document */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                  <School className="w-5 h-5" />
                  <span>{settings.institutionName}</span>
                </div>
                <p className="text-slate-500 mt-1">{settings.address}</p>
                <p className="text-slate-500">Tax ID: {settings.registrationNumber} · {settings.email}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Invoice Number</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{viewingInvoice.invoiceNumber}</span>
                <div className="mt-1">
                  <Badge variant={viewingInvoice.status === 'Paid' ? 'success' : 'warning'}>
                    {viewingInvoice.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <span className="text-slate-400 block font-medium">Billed To:</span>
                <strong className="text-slate-900 dark:text-white block text-sm">{viewingInvoice.studentName}</strong>
                <span className="text-slate-500">Cohort: {viewingInvoice.className}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-medium">Payment Details:</span>
                <span className="text-slate-500 block">Due Date: {viewingInvoice.dueDate}</span>
                {viewingInvoice.paidDate && (
                  <span className="text-emerald-600 block">Settled on: {viewingInvoice.paidDate}</span>
                )}
                {viewingInvoice.paymentMethod && (
                  <span className="text-slate-500 block">Via: {viewingInvoice.paymentMethod}</span>
                )}
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800 font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                    {viewingInvoice.title}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">
                    ${viewingInvoice.amount.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans text-slate-500">
                    Paid / Remitted Credit
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                    -${viewingInvoice.paidAmount.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-sm">
                  <td className="py-3 px-3 font-sans text-slate-900 dark:text-white">
                    Outstanding Balance Due
                  </td>
                  <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400">
                    ${viewingInvoice.balance.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Print & Close */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Invoice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Generate Fee Invoice"
        subtitle="Issue official tuition and institutional fee bill to student account"
      >
        <form onSubmit={handleSubmitAddInvoice} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceForm.invoiceNumber}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student *
            </label>
            <select
              value={invoiceForm.studentId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              required
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId} · {s.className})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fee Category / Title *
            </label>
            <input
              type="text"
              value={invoiceForm.title}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
              placeholder="e.g. Academic Term II Tuition"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Amount ($) *
              </label>
              <input
                type="number"
                min="50"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Settlement Due Date *
              </label>
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
