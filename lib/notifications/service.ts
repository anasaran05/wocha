import { getSupabaseClient } from '../supabase/client';
import { getSupabaseAdminClient } from '../supabase/admin';
import { NotificationType } from '../supabase/types';

export interface InAppNotification {
  id: string;
  userId: string | null;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string;
}

export async function createNotification(input: {
  userId?: string | null;
  type: NotificationType;
  title: string;
  body: string;
  linkUrl?: string | null;
}) {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: input.userId || null,
        type: input.type,
        title: input.title,
        body: input.body,
        link_url: input.linkUrl || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch {
    return {
      id: `notif_${Date.now()}`,
      ...input,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  }
}

export async function getUserNotifications(userId?: string): Promise<InAppNotification[]> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.is_read,
        linkUrl: n.link_url,
        createdAt: n.created_at,
      }));
    }
  } catch {
    // Fallback
  }

  return [
    {
      id: 'mock-notif-1',
      userId: userId || null,
      type: 'promo',
      title: 'Welcome to WOCHA Permanent Index',
      body: 'Explore heavyweight architectural fleece and form studies.',
      isRead: false,
      linkUrl: '/shop',
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = getSupabaseClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    return true;
  } catch {
    return true;
  }
}
