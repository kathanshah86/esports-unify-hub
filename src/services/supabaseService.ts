
import { supabase } from '@/integrations/supabase/client';
import { Tournament, Player, Match } from '@/types';

// Tournament operations
export const tournamentService = {
  async getAll(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }
    return (data || []) as Tournament[];
  },

  async create(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>): Promise<Tournament> {
    // Clean up the tournament data - remove empty strings and undefined values
    const tournamentData = { ...tournament };
    
    // Remove empty string values to prevent database errors
    Object.keys(tournamentData).forEach(key => {
      if (tournamentData[key] === '' || tournamentData[key] === undefined || tournamentData[key] === null) {
        delete tournamentData[key];
      }
    });

    // Ensure required dates are present and properly formatted
    if (!tournamentData.start_date) {
      tournamentData.start_date = new Date().toISOString();
    } else {
      tournamentData.start_date = new Date(tournamentData.start_date).toISOString();
    }
    
    if (!tournamentData.end_date) {
      tournamentData.end_date = new Date().toISOString();
    } else {
      tournamentData.end_date = new Date(tournamentData.end_date).toISOString();
    }

    // Handle optional date fields
    if (tournamentData.registration_opens) {
      tournamentData.registration_opens = new Date(tournamentData.registration_opens).toISOString();
    }
    if (tournamentData.registration_closes) {
      tournamentData.registration_closes = new Date(tournamentData.registration_closes).toISOString();
    }

    console.log('Creating tournament with cleaned data:', tournamentData);

    const { data, error } = await supabase
      .from('tournaments')
      .insert([tournamentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
    return data as Tournament;
  },

  async update(id: string, tournament: Partial<Tournament>): Promise<Tournament> {
    // Clean up the tournament data - remove empty strings and undefined values
    const updateData = { ...tournament };
    
    // Remove empty string values to prevent database errors
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    // Format date fields if they exist
    if (updateData.start_date) {
      updateData.start_date = new Date(updateData.start_date).toISOString();
    }
    if (updateData.end_date) {
      updateData.end_date = new Date(updateData.end_date).toISOString();
    }
    if (updateData.registration_opens) {
      updateData.registration_opens = new Date(updateData.registration_opens).toISOString();
    }
    if (updateData.registration_closes) {
      updateData.registration_closes = new Date(updateData.registration_closes).toISOString();
    }

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString();

    console.log('Updating tournament with cleaned data:', updateData);
    
    const { data, error } = await supabase
      .from('tournaments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating tournament:', error);
      throw error;
    }
    return data as Tournament;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  }
};

// Player operations
export const playerService = {
  async getAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }
    return (data || []) as Player[];
  },

  async create(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert([player])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating player:', error);
      throw error;
    }
    return data as Player;
  },

  async update(id: string, player: Partial<Player>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update({ ...player, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating player:', error);
      throw error;
    }
    return data as Player;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }
};

// Match operations
export const matchService = {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
    return (data || []) as Match[];
  },

  async create(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    // Ensure start_time is properly formatted
    const matchData = {
      ...match,
      start_time: match.start_time || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating match:', error);
      throw error;
    }
    return data as Match;
  },

  async update(id: string, match: Partial<Match>): Promise<Match> {
    // Filter out empty string dates
    const updateData = { ...match };
    if (updateData.start_time === '') delete updateData.start_time;
    
    const { data, error } = await supabase
      .from('matches')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating match:', error);
      throw error;
    }
    return data as Match;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting match:', error);
      throw error;
    }
  }
};
