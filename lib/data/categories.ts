import { getSupabaseClient } from '../supabase/client';
import { Database } from '../supabase/types';

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  children: CategoryTreeItem[];
  attributes: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: string;
  name: string;
  inputType: 'select' | 'color_swatch' | 'text';
  values: {
    id: string;
    value: string;
    meta?: any;
  }[];
}

// Fallback seed categories hierarchy
const SEED_CATEGORIES: CategoryTreeItem[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Heavyweight fleece and terry silhouettes cut in architectural proportions.',
    parentId: null,
    sortOrder: 1,
    children: [],
    attributes: [
      {
        id: 'attr-size',
        name: 'Size',
        inputType: 'select',
        values: [
          { id: 's-xs', value: 'XS' },
          { id: 's-s', value: 'S' },
          { id: 's-m', value: 'M' },
          { id: 's-l', value: 'L' },
          { id: 's-xl', value: 'XL' },
          { id: 's-xxl', value: 'XXL' },
        ],
      },
      {
        id: 'attr-color',
        name: 'Color',
        inputType: 'color_swatch',
        values: [
          { id: 'c-pitch', value: 'Pitch Black', meta: { hex: '#111111' } },
          { id: 'c-bone', value: 'Chalk Bone', meta: { hex: '#EBE9E1' } },
          { id: 'c-clay', value: 'Muted Clay', meta: { hex: '#B85C3E' } },
        ],
      },
    ],
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Substantial combed cotton foundations and structured collar treatments.',
    parentId: null,
    sortOrder: 2,
    children: [
      {
        id: 'c0000000-0000-0000-0000-000000000004',
        name: 'Custom Studio',
        slug: 'customizable',
        description: 'Bespoke typography, placement, and color configurations rendered in 3D.',
        parentId: 'c0000000-0000-0000-0000-000000000002',
        sortOrder: 1,
        children: [],
        attributes: [
          {
            id: 'attr-size',
            name: 'Size',
            inputType: 'select',
            values: [
              { id: 's-s', value: 'S' },
              { id: 's-m', value: 'M' },
              { id: 's-l', value: 'L' },
              { id: 's-xl', value: 'XL' },
            ],
          },
          {
            id: 'attr-color',
            name: 'Color',
            inputType: 'color_swatch',
            values: [
              { id: 'c-pitch', value: 'Pitch Black', meta: { hex: '#111111' } },
              { id: 'c-bone', value: 'Chalk Bone', meta: { hex: '#EBE9E1' } },
            ],
          },
          {
            id: 'attr-custom-text',
            name: 'Custom Inscription',
            inputType: 'text',
            values: [],
          },
        ],
      },
    ],
    attributes: [
      {
        id: 'attr-size',
        name: 'Size',
        inputType: 'select',
        values: [
          { id: 's-xs', value: 'XS' },
          { id: 's-s', value: 'S' },
          { id: 's-m', value: 'M' },
          { id: 's-l', value: 'L' },
          { id: 's-xl', value: 'XL' },
        ],
      },
      {
        id: 'attr-color',
        name: 'Color',
        inputType: 'color_swatch',
        values: [
          { id: 'c-pitch', value: 'Pitch Black', meta: { hex: '#111111' } },
          { id: 'c-bone', value: 'Chalk Bone', meta: { hex: '#EBE9E1' } },
        ],
      },
    ],
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Puffers',
    slug: 'puffers',
    description: 'Thermal insulation systems engineered with high fill-power down.',
    parentId: null,
    sortOrder: 3,
    children: [],
    attributes: [
      {
        id: 'attr-size',
        name: 'Size',
        inputType: 'select',
        values: [
          { id: 's-s', value: 'S' },
          { id: 's-m', value: 'M' },
          { id: 's-l', value: 'L' },
          { id: 's-xl', value: 'XL' },
        ],
      },
      {
        id: 'attr-color',
        name: 'Color',
        inputType: 'color_swatch',
        values: [
          { id: 'c-pitch', value: 'Obsidian Black', meta: { hex: '#0B0B0C' } },
          { id: 'c-bone', value: 'Raw Ecru', meta: { hex: '#ECE8DF' } },
        ],
      },
    ],
  },
];

/**
 * Fetch all categories assembled into an adaptive hierarchy
 */
export async function getCategoryHierarchy(): Promise<CategoryTreeItem[]> {
  try {
    const supabase = getSupabaseClient();
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !categories || categories.length === 0) {
      return SEED_CATEGORIES;
    }

    // Build tree
    const rootCategories: CategoryTreeItem[] = [];
    const itemMap = new Map<string, CategoryTreeItem>();

    for (const cat of categories) {
      itemMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentId: cat.parent_id,
        sortOrder: cat.sort_order,
        children: [],
        attributes: [],
      });
    }

    for (const item of itemMap.values()) {
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId)!.children.push(item);
      } else {
        rootCategories.push(item);
      }
    }

    return rootCategories;
  } catch {
    return SEED_CATEGORIES;
  }
}

/**
 * Find category by slug (handles both top-level and subcategories)
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryTreeItem | null> {
  const tree = await getCategoryHierarchy();

  function findRecursive(items: CategoryTreeItem[]): CategoryTreeItem | null {
    for (const item of items) {
      if (item.slug === slug) return item;
      if (item.children && item.children.length > 0) {
        const found = findRecursive(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  return findRecursive(tree);
}

/**
 * Get adaptive attributes assigned to a category
 */
export async function getAdaptiveAttributesForCategory(categoryId: string): Promise<CategoryAttribute[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('category_attributes')
      .select(`
        attribute_id,
        attributes (
          id,
          name,
          input_type,
          attribute_values (
            id,
            value,
            meta
          )
        )
      `)
      .eq('category_id', categoryId);

    if (error || !data || data.length === 0) {
      // Fallback
      return SEED_CATEGORIES[0].attributes;
    }

    return data.map((item: any) => ({
      id: item.attributes.id,
      name: item.attributes.name,
      inputType: item.attributes.input_type,
      values: item.attributes.attribute_values || [],
    }));
  } catch {
    return SEED_CATEGORIES[0].attributes;
  }
}
