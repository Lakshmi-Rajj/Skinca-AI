'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

export default function IngredientLibraryPage() {
  const [search, setSearch] = useState('');

  const sampleIngredients = [
    { id: '1', inciName: 'Sodium Hyaluronate', displayName: 'Hyaluronic Acid', category: 'HUMECTANT', risk: 'LOW', vegan: true, solubility: 'Water Soluble' },
    { id: '2', inciName: 'Niacinamide', displayName: 'Vitamin B3', category: 'ANTIOXIDANT', risk: 'LOW', vegan: true, solubility: 'Water Soluble' },
    { id: '3', inciName: 'Salicylic Acid', displayName: 'BHA Exfoliant', category: 'EXFOLIANT', risk: 'MODERATE', vegan: true, solubility: 'Oil Soluble' },
    { id: '4', inciName: 'Retinol', displayName: 'Vitamin A Retinoid', category: 'CELL_COMMUNICATING', risk: 'MODERATE', vegan: true, solubility: 'Oil Soluble' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans text-stone-900">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-normal text-stone-900">INCI Ingredient Knowledge Base</h1>
          <p className="mt-1 text-sm text-stone-500">Global scientific ingredient library and dermatological safety parameters.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">Bulk Import CSV</Button>
          <Button variant="primary" size="md">Add Ingredient</Button>
        </div>
      </header>

      <Card variant="bordered" className="mb-6">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search INCI name, common display name, or CAS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 rounded-md border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
          <div className="text-xs text-stone-500">Showing {sampleIngredients.length} Scientific Ingredients</div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
          <thead className="bg-stone-100 font-serif text-stone-700">
            <tr>
              <th className="px-6 py-3 font-normal">INCI Name</th>
              <th className="px-6 py-3 font-normal">Common Name</th>
              <th className="px-6 py-3 font-normal">Category</th>
              <th className="px-6 py-3 font-normal">Irritation Risk</th>
              <th className="px-6 py-3 font-normal">Solubility</th>
              <th className="px-6 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {sampleIngredients.map((ing) => (
              <tr key={ing.id} className="hover:bg-stone-50">
                <td className="px-6 py-4 font-mono text-xs font-semibold text-stone-900">{ing.inciName}</td>
                <td className="px-6 py-4 text-stone-800">{ing.displayName}</td>
                <td className="px-6 py-4"><Badge variant="default">{ing.category}</Badge></td>
                <td className="px-6 py-4">
                  <Badge variant={ing.risk === 'LOW' ? 'success' : 'warning'}>{ing.risk}</Badge>
                </td>
                <td className="px-6 py-4 text-stone-600">{ing.solubility}</td>
                <td className="px-6 py-4 text-stone-900 font-medium hover:underline cursor-pointer">View Details</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
