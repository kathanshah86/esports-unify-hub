
import { supabase } from '@/integrations/supabase/client';
import { Tournament, Player, Match } from '@/types';

// Tournament operations
export const tournamentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([tournament])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, tournament: Partial<Tournament>) {
    const { data, error } = await supabase
      .from('tournaments')
      .update({ ...tournament, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Player operations
export const playerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('players')
      .insert([player])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, player: Partial<Player>) {
    const { data, error } = await supabase
      .from('players')
      .update({ ...player, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Match operations
export const matchService = {
  async getAll() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('matches')
      .insert([match])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, match: Partial<Match>) {
    const { data, error } = await supabase
      .from('matches')
      .update({ ...match, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
