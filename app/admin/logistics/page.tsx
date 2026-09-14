'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, RefreshCw, Radio } from 'lucide-react';

export default function AdminLogisticsPage() {
  const [couriers, setCouriers] = useState([
    {
      id: 'c1',
      name: 'Delhivery Surface & Express',
      serviceType: 'Surface / Air Cargo',
      active: true,
      lastSync: '5 mins ago',
      successRate: '99.2%',
    },
    {
      id: 'c2',
      name: 'Shiprocket Enterprise',
      serviceType: 'Multi-carrier routing',
      active: true,
      lastSync: '12 mins ago',
      successRate: '98.8%',
    },
    {
      id: 'c3',
      name: 'DTDC Priority Express',
      serviceType: 'Intra-city rapid',
      active: true,
      lastSync: '1 hour ago',
      successRate: '97.5%',
    },
  ]);

  const [exceptions, setExceptions] = useState([
    {
      awb: 'DEL88291039',
      orderNumber: 'WOC-48201',
      reason: 'Consignee address clearance delay at sort depot',
      location: 'Frankfurt Hub',
      severity: 'medium',
      time: '4 hours ago',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Courier Partner Ecosystem
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Carrier Logistics & Route Exceptions
          </h1>
        </div>
      </div>

      {/* Courier Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {couriers.map((courier) => (
          <div
            key={courier.id}
            className="bg-white p-6 rounded-xl hairline-border space-y-4 font-mono text-xs"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="font-bold text-sm text-[#111111] block">{courier.name}</span>
                <span className="text-[10px] text-[#6B6B6B]">{courier.serviceType}</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Connected
              </span>
            </div>

            <div className="space-y-1 hairline-top pt-3 text-[11px] text-[#6B6B6B]">
              <div className="flex justify-between">
                <span>Webhook Health:</span>
                <span className="text-[#111111] font-semibold">Active (HMAC verified)</span>
              </div>
              <div className="flex justify-between">
                <span>SLA Success:</span>
                <span className="text-emerald-700 font-bold">{courier.successRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Event Ping:</span>
                <span className="text-[#111111]">{courier.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exceptions Tracker */}
      <div className="bg-white rounded-xl p-6 hairline-border space-y-4">
        <div className="flex justify-between items-center hairline-bottom pb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Logistics Exceptions & Route Alerts
            </h3>
          </div>
          <span className="text-xs font-mono text-[#6B6B6B]">
            {exceptions.length} Flagged Case
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {exceptions.map((ex, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FAFAF8] hairline-border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-[#111111]">{ex.orderNumber}</strong>
                  <span className="text-[#6B6B6B]">({ex.awb})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 font-bold">
                    Customs / Hub Delay
                  </span>
                </div>
                <div className="text-xs text-[#6B6B6B]">{ex.reason} &bull; {ex.location}</div>
              </div>

              <button className="wocha-btn rounded-lg px-4 py-1.5 text-xs uppercase tracking-wider text-white">
                Reroute Carrier
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
