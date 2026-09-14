'use client';

import React, { useState, useEffect } from 'react';
import { Users, Star, Check, X, ShieldAlert, Clock } from 'lucide-react';
import { getPendingReviews, moderateReview, ProductReview } from '@/lib/data/reviews';

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'reviews'>('users');

  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      name: 'Julian Kramer',
      email: 'julian@kramer.de',
      role: 'customer',
      ordersCount: 4,
      totalSpent: 890,
      joinedAt: '2026-06-12',
    },
    {
      id: 'usr-2',
      name: 'Elena Rostova',
      email: 'elena@rostova.com',
      role: 'customer',
      ordersCount: 2,
      totalSpent: 420,
      joinedAt: '2026-07-04',
    },
    {
      id: 'usr-3',
      name: 'Mohammed Anas',
      email: 'anas@wocha.com',
      role: 'admin',
      ordersCount: 12,
      totalSpent: 2640,
      joinedAt: '2026-01-15',
    },
  ]);

  const [pendingReviews, setPendingReviews] = useState<ProductReview[]>([
    {
      id: 'rev-pending-1',
      productId: 'hoodie-01',
      userId: 'usr-4',
      userName: 'Alexander Wright',
      rating: 5,
      title: 'Flawless loopback drape',
      body: 'The collar finish and dropped shoulder fit true to architectural bespoke tailoring.',
      isVerifiedPurchase: true,
      status: 'pending',
      createdAt: '2026-09-14T08:30:00Z',
    },
  ]);

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    await moderateReview(reviewId, status);
    setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Patron Directory & Quality Moderation
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Customers & Product Reviews
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 hairline-bottom pb-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Customer Directory ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <span>Review Moderation Queue</span>
          {pendingReviews.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingReviews.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl hairline-border overflow-hidden">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#FAFAF8] hairline-bottom text-[#6B6B6B]">
              <tr>
                <th className="p-4 font-medium">Patron Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Lifetime Spend</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DD]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAFAF8]/50">
                  <td className="p-4 font-semibold text-[#111111]">{u.name}</td>
                  <td className="p-4 text-[#6B6B6B]">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        u.role === 'admin'
                          ? 'bg-black text-white'
                          : u.role === 'staff'
                          ? 'bg-neutral-200 text-neutral-800'
                          : 'bg-[#FAFAF8] text-[#6B6B6B]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-[#111111]">{u.ordersCount}</td>
                  <td className="p-4 font-bold text-[#111111]">€{u.totalSpent}</td>
                  <td className="p-4 text-[#6B6B6B]">{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: REVIEW MODERATION QUEUE */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <div className="bg-white p-12 rounded-xl hairline-border text-center space-y-2 max-w-md mx-auto font-mono text-xs text-[#6B6B6B]">
              <p>Zero pending evaluations awaiting moderation.</p>
              <p className="text-[11px] text-[#9E9E9E]">
                All client submissions have been audited.
              </p>
            </div>
          ) : (
            pendingReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-xl hairline-border space-y-4 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-[#111111]">{rev.title}</strong>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                        Pending Approval
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6B6B6B] text-[11px]">
                      <span>Patron: {rev.userName}</span>
                      <span>&bull;</span>
                      <span>Target Garment: {rev.productId}</span>
                      <span>&bull;</span>
                      <span className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerate(rev.id, 'approved')}
                      className="wocha-btn rounded-lg px-3 py-1.5 text-xs uppercase tracking-wider text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleModerate(rev.id, 'rejected')}
                      className="wocha-btn-secondary rounded-lg px-3 py-1.5 text-xs uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                <p className="p-3 bg-[#FAFAF8] rounded-lg text-[#111111] font-sans text-xs leading-relaxed">
                  "{rev.body}"
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
