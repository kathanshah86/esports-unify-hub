import { supabase } from '@/integrations/supabase/client';

export interface WalletTransaction {
  id: string;
  user_id: string;
  transaction_type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_method?: string;
  transaction_reference?: string;
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  total_deposited: number;
  total_withdrawn: number;
  created_at: string;
  updated_at: string;
}

export const walletService = {
  async getTransactions(): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    return (data || []) as WalletTransaction[];
  },

  async getUserTransactions(userId: string): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
    return (data || []) as WalletTransaction[];
  },

  async getUserBalance(userId: string): Promise<WalletBalance | null> {
    const { data, error } = await supabase
      .from('wallet_balances')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user balance:', error);
      return null;
    }
    return data;
  },

  async createTransaction(transaction: Omit<WalletTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<WalletTransaction> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    return data as WalletTransaction;
  },

  async updateTransactionStatus(id: string, status: 'approved' | 'rejected', adminNotes?: string): Promise<WalletTransaction> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .update({
        status,
        admin_notes: adminNotes,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
    return data as WalletTransaction;
  }
};