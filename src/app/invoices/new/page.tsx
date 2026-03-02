'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import { 
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Item {
  description: string;
  quantity: number;
  price: number;
}

export default function NewInvoice() {
  const router = useRouter();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: 1, price: 0 }]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    const item = newItems[index];
    if (field === 'description') {
        item.description = value as string;
    } else {
        item[field] = Number(value);
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const totalAmount = calculateTotal();

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientAddress,
          issueDate,
          dueDate,
          items,
          totalAmount,
          status: 'DRAFT',
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create invoice');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation session={null} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 fade-in">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <Link href="/">
                <button className="btn-glass p-2">
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Create New Invoice</h1>
                <p className="text-gray-400 text-sm sm:text-base">Fill in the details to create a new invoice</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card p-6 sm:p-8 fade-in" style={{ animationDelay: '100ms' }}>
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Client Information */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <UserIcon className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Client Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Client Name</label>
                    <input
                      type="text"
                      placeholder="Enter client name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Client Email</label>
                    <input
                      type="email"
                      placeholder="Enter client email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Client Address</label>
                  <textarea
                    placeholder="Enter client address"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Invoice Dates */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Invoice Dates</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Issue Date</label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-semibold text-white">Invoice Items</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="btn-glass flex items-center space-x-2 px-4 py-2 text-sm"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          required
                          className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm"
                        />
                      </div>
                      <div className="w-16 sm:w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="1"
                          required
                          className="w-full bg-white/5 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm text-center"
                        />
                      </div>
                      <div className="w-24 sm:w-32">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                          className="w-full bg-white/5 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm text-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn-glass p-2.5 text-red-400 hover:text-red-300 transition-colors"
                        disabled={items.length === 1}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateTotal())}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <DocumentTextIcon className="w-5 h-5" />
                        <span>Create Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
