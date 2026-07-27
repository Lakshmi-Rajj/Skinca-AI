'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

export default function BrandManagementPage() {
  const [search, setSearch] = useState('');
  
  const sampleBrands = [
    { id: '1', name: 'Aesop', slug: 'aesop', country: 'Australia', status: 'ACTIVE', productCount: 42 },
    { id: '2', name: 'Proven Skincare', slug: 'proven-skincare', country: 'United States', status: 'ACTIVE', productCount: 18 },
    { id: '3', name: 'Function of Beauty', slug: 'function-of-beauty', country: 'United States', status: 'ACTIVE', productCount: 24 },
    { id: '4', name: 'The Ordinary', slug: 'the-ordinary', country: 'Canada', status: 'ACTIVE', productCount: 65 },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans text-stone-900">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-normal text-stone-900">Brand Directory</h1>
          <p className="mt-1 text-sm text-stone-500">Manage tenant manufacturer brands and global skincare labels.</p>
        </div>
        <Button variant="primary" size="md">Add Brand</Button>
      </header>

      <Card variant="bordered" className="mb-6">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search brands by name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 rounded-md border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
          <div className="text-xs text-stone-500">Showing {sampleBrands.length} Brands</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sampleBrands.map((brand) => (
          <Card key={brand.id} variant="default" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium text-stone-900">{brand.name}</h2>
                <Badge variant="success">{brand.status}</Badge>
              </div>
              <p className="mt-2 text-xs text-stone-500">Country: {brand.country}</p>
              <p className="mt-1 text-xs text-stone-500">Slug: <code className="text-stone-700">{brand.slug}</code></p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-medium text-stone-600">
              <span>{brand.productCount} Products</span>
              <button className="text-stone-900 hover:underline">Edit</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
