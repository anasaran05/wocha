'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProducts, Product } from '@/lib/data/products';
import { getCategoryHierarchy, CategoryTreeItem } from '@/lib/data/categories';
import { requestPresignedUpload } from '@/lib/storage';
import {
  Package,
  Plus,
  FolderTree,
  Upload,
  Edit2,
  Check,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'upload'>('products');
  const [loading, setLoading] = useState(true);

  // New Product Modal/Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(195);
  const [newProdCategory, setNewProdCategory] = useState('hoodies');
  const [newProdCustomizable, setNewProdCustomizable] = useState(false);

  // R2 Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('hoodies');
  const [uploadProductId, setUploadProductId] = useState('hoodie-01');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategoryHierarchy()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `garment-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: newProdName,
      category: newProdCategory as any,
      categoryLabel: newProdCategory.toUpperCase(),
      price: Number(newProdPrice),
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Pitch Black', hex: '#111111' },
        { name: 'Chalk Bone', hex: '#EBE9E1' },
      ],
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80'],
      description: 'Engineered architectural silhouette tailored in heavyweight organic cotton.',
      details: ['480 GSM French Terry', 'Double-faced hood', 'Milled in Portugal'],
      composition: '100% Organic Cotton',
      weight: '480 GSM',
      customizable: newProdCustomizable,
    };

    setProducts([newProduct, ...products]);
    setShowAddProduct(false);
    setNewProdName('');
  };

  const handleUploadR2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadStatus('Requesting signed R2 upload token...');
    try {
      const key = `products/${uploadCategory}/${uploadProductId}/${uploadFile.name}`;
      const { uploadUrl, publicUrl } = await requestPresignedUpload(key, uploadFile.type);

      setUploadStatus('Streaming binary payload directly to Cloudflare R2 bucket...');
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': uploadFile.type },
        body: uploadFile,
      });

      setUploadStatus('Asset successfully committed to R2 and CDN cache.');
      setUploadedUrl(publicUrl);
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Catalog Engineering
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Silhouettes, Hierarchy & Cloudflare R2
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddProduct(true)}
            className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Silhouette</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 hairline-bottom pb-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          All Garments ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Hierarchical Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'upload'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Cloudflare R2 Direct Uploader
        </button>
      </div>

      {/* CREATE PRODUCT MODAL / FORM */}
      {showAddProduct && (
        <form
          onSubmit={handleCreateProduct}
          className="bg-white p-6 rounded-xl hairline-border space-y-4 max-w-xl"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#111111]">
              New Product Architecture
            </h3>
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              className="text-xs font-mono text-[#6B6B6B]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono text-[#6B6B6B] uppercase block mb-1">
                Silhouette Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 04 Heavyweight Raw Pullover"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#6B6B6B] uppercase block mb-1">
                Base Retail Price (€)
              </label>
              <input
                type="number"
                required
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(Number(e.target.value))}
                className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#6B6B6B] uppercase block mb-1">
                Category
              </label>
              <select
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              >
                <option value="hoodies">Hoodies</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="puffers">Puffers</option>
                <option value="customizable">Custom Studio</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_custom"
                checked={newProdCustomizable}
                onChange={(e) => setNewProdCustomizable(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="is_custom" className="text-xs font-mono text-[#111111]">
                Enable Atelier 3D Customization Studio for this piece
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white"
            >
              Publish to Catalog
            </button>
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              className="wocha-btn-secondary rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-[#111111]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl hairline-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#FAFAF8] hairline-bottom text-[#6B6B6B]">
                <tr>
                  <th className="p-4 font-medium">Garment</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Base Price</th>
                  <th className="p-4 font-medium">Adaptive Attributes</th>
                  <th className="p-4 font-medium text-center">Customizable</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DD]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAFAF8]/50">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-12 relative bg-[#F5F4F0] rounded overflow-hidden shrink-0">
                        <Image
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80'}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-[#111111]">{prod.name}</div>
                        <div className="text-[10px] text-[#6B6B6B]">{prod.id}</div>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[#6B6B6B]">{prod.category}</td>
                    <td className="p-4 font-semibold text-[#111111]">€{prod.price}</td>
                    <td className="p-4 text-[#6B6B6B]">
                      Sizes: {prod.sizes.join(', ')}
                    </td>
                    <td className="p-4 text-center">
                      {prod.customizable ? (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                          3D Config Enabled
                        </span>
                      ) : (
                        <span className="text-[#9E9E9E]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="p-1 text-[#6B6B6B] hover:text-[#111111]">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HIERARCHICAL CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 hairline-border space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              <span>Adaptive Category Taxonomy Tree</span>
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Categories utilize self-referencing <code className="bg-[#FAFAF8] px-1 py-0.5 rounded">parent_id</code>{' '}
              to support arbitrary subcategory nesting with tailored adaptive filter attributes.
            </p>

            <div className="space-y-3 font-mono text-xs pt-2">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[#FAFAF8] hairline-border rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#111111]">{cat.name} ({cat.slug})</span>
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded">
                      Root Taxonomy
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] font-sans">{cat.description}</p>

                  {/* Subcategories */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="pl-6 border-l-2 border-[#111111] space-y-2 mt-2">
                      {cat.children.map((sub) => (
                        <div key={sub.id} className="p-3 bg-white hairline-border rounded-lg flex justify-between items-center">
                          <div>
                            <span className="font-bold text-[#111111] block">&rdsh; {sub.name} ({sub.slug})</span>
                            <span className="text-[10px] text-[#6B6B6B] font-sans">{sub.description}</span>
                          </div>
                          <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                            Adaptive Subcategory
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLOUDFLARE R2 UPLOADER */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-xl p-8 hairline-border space-y-6 max-w-2xl">
          <div className="space-y-1 hairline-bottom pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Signed Direct Upload to Cloudflare R2</span>
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Secured via S3-compatible short-lived presigned upload URLs. Credentials remain in backend vault.
            </p>
          </div>

          <form onSubmit={handleUploadR2} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">
                  Category Folder
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
                >
                  <option value="hoodies">hoodies</option>
                  <option value="t-shirts">t-shirts</option>
                  <option value="puffers">puffers</option>
                  <option value="customizable">customizable</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">
                  Product Identifier
                </label>
                <input
                  type="text"
                  value={uploadProductId}
                  onChange={(e) => setUploadProductId(e.target.value)}
                  className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">
                Select Garment Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5"
              />
            </div>

            <button
              type="submit"
              disabled={!uploadFile}
              className="wocha-btn rounded-lg px-6 py-2.5 text-xs uppercase tracking-wider text-white"
            >
              Generate Presigned URL & Upload
            </button>
          </form>

          {uploadStatus && (
            <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg font-mono text-xs space-y-2">
              <span className="text-[#6B6B6B] block uppercase text-[10px]">Transmission Log:</span>
              <div className="text-[#111111]">{uploadStatus}</div>
              {uploadedUrl && (
                <div className="pt-2 hairline-top">
                  <span className="text-[#6B6B6B] block text-[10px]">Cloudflare CDN URL:</span>
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#111111] underline break-all"
                  >
                    {uploadedUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
