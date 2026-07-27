'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

export default function ClaimsManagementPage() {
  const [search, setSearch] = useState('');

  const sampleClaims = [
    { id: '1', name: 'Hydrating', category: 'BENEFIT', icon: 'droplet', description: 'Restores essential moisture to skin cells' },
    { id: '2', name: 'Brightening', category: 'BENEFIT', icon: 'sparkles', description: 'Evens skin tone and restores natural radiance' },
    { id: '3', name: 'Anti-Acne', category: 'BENEFIT', icon: 'shield', description: 'Combats acne-causing bacteria and unclogs pores' },
    { id: '4', name: 'Fragrance Free', category: 'SAFETY', icon: 'check-circle', description: 'Formulated without synthetic or natural fragrances' },
    { id: '5', name: 'Cruelty Free', category: 'CERTIFICATION', icon: 'heart', description: 'Leaping Bunny certified, zero animal testing' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans text-stone-900">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-normal text-stone-900">Product Claims & Certifications</h1>
          <p className="mt-1 text-sm text-stone-500">Manage dermatological benefit claims, safety flags, and eco-certifications.</p>
        </div>
        <Button variant="primary" size="md">Add Claim Tag</Button>
      </header>

      <Card variant="bordered" className="mb-6">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Filter claims by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 rounded-md border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
          <div className="text-xs text-stone-500">Showing {sampleClaims.length} Claims</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleClaims.map((claim) => (
          <Card key={claim.id} variant="default" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-medium text-stone-900">{claim.name}</h2>
                <Badge variant={claim.category === 'SAFETY' ? 'warning' : 'default'}>{claim.category}</Badge>
              </div>
              <p className="mt-2 text-xs text-stone-600">{claim.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
              <span>Icon: <code>{claim.icon}</code></span>
              <button className="text-stone-900 font-medium hover:underline">Edit</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
