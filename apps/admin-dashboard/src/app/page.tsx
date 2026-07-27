import React from 'react';
import { Card, Badge, Button } from '@platform/ui-components';

export default function AdminOverviewPage() {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="default">Module 9 — Production Analytics</Badge>
            <span className="text-xs text-stone-500 font-mono">Tenant ID: tenant_prod_01</span>
          </div>
          <h1 className="text-3xl font-serif font-normal text-stone-900 mt-2">Executive Analytics & KPI Command Center</h1>
          <p className="text-sm text-stone-600 mt-1">Real-time performance tracking for recommendation engine, customer retention, and AI worker efficiency.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">📥 Export CSV Report</Button>
          <Button variant="primary" size="sm">📊 Export PDF Executive Summary</Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="bordered" className="p-6">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Total Customers</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-serif text-stone-900 font-semibold">1,280</span>
            <span className="text-xs text-emerald-600 font-semibold">↑ +14.2%</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">1,088 Active (85% Retention)</p>
        </Card>

        <Card variant="bordered" className="p-6">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Assessments Completed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-serif text-stone-900 font-semibold">3,420</span>
            <span className="text-xs text-emerald-600 font-semibold">↑ +22.8%</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">92.4% Wizard Completion Rate</p>
        </Card>

        <Card variant="bordered" className="p-6">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Recommendations Generated</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-serif text-stone-900 font-semibold">4,190</span>
            <span className="text-xs text-emerald-600 font-semibold">↑ +18.5%</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">94.6% Avg Confidence Score</p>
        </Card>

        <Card variant="bordered" className="p-6">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">AI Worker Cache Hit</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-serif text-stone-900 font-semibold">84.2%</span>
            <span className="text-xs text-emerald-600 font-semibold">⚡ 145ms Latency</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">4,190 Rationale Explanations</p>
        </Card>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Skin Concerns Breakdown */}
        <Card variant="default" className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-medium text-stone-900">Top Skin Concerns Distribution</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Acne & Active Blemishes</span>
                <span>42%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-900 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Hyperpigmentation & Dark Spots</span>
                <span>28%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-800 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Redness & Rosacea Sensitivity</span>
                <span>18%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-600 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Fine Lines & Photo-Aging</span>
                <span>12%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-400 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Recommended Products Table */}
        <Card variant="default" className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-medium text-stone-900">Top Recommended Formulations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-medium">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Match Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Niacinamide 10% + Zinc Serum</td>
                  <td className="py-2.5 text-stone-600">Serums & Actives</td>
                  <td className="py-2.5 font-semibold text-stone-900">1,420 Matches</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Gentle Hydrating Cleanser</td>
                  <td className="py-2.5 text-stone-600">Cleansers</td>
                  <td className="py-2.5 font-semibold text-stone-900">1,280 Matches</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Broad Spectrum Daily SPF 50</td>
                  <td className="py-2.5 text-stone-600">Sunscreen</td>
                  <td className="py-2.5 font-semibold text-stone-900">1,150 Matches</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Overnight Barrier Recovery Balm</td>
                  <td className="py-2.5 text-stone-600">Moisturizer</td>
                  <td className="py-2.5 font-semibold text-stone-900">980 Matches</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
