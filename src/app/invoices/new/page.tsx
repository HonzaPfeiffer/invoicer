'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="p-2 border rounded"/>
            <input type="email" placeholder="Client Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required className="p-2 border rounded"/>
          </div>
          <textarea placeholder="Client Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} required className="w-full p-2 border rounded"/>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Issue Date</label>
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full p-2 border rounded"/>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Items</h2>
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required className="w-1/2 p-2 border rounded"/>
                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" required className="w-1/6 p-2 border rounded"/>
                <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} min="0" step="0.01" required className="w-1/4 p-2 border rounded"/>
                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">&times;</button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-indigo-600 hover:text-indigo-800">
              + Add Item
            </button>
          </div>

          {/* Total */}
          <div className="text-right text-xl font-bold">
            Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateTotal())}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
}
