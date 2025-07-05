import { supabase } from '@/integrations/supabase/client';

export interface TournamentRegistration {
  id: string;
  user_id: string;
  tournament_id: string;
  player_name: string;
  player_game_id: string;
  registration_date: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_amount: number;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistrationInput {
  tournament_id: string;
  player_name: string;
  player_game_id: string;
  payment_amount?: number;
}

export interface TournamentRoom {
  id: string;
  tournament_id: string;
  room_id?: string;
  room_password?: string;
  created_at: string;
  updated_at: string;
}

export const tournamentRegistrationService = {
  async registerForTournament(registration: TournamentRegistrationInput): Promise<TournamentRegistration> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([{
        ...registration,
        user_id: user.id,
        payment_status: registration.payment_amount && registration.payment_amount > 0 ? 'pending' : 'completed'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as TournamentRegistration;
  },

  async getUserRegistrations(userId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as TournamentRegistration[];
  },

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as TournamentRegistration[];
  },

  async checkUserRegistration(userId: string, tournamentId: string): Promise<TournamentRegistration | null> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('tournament_id', tournamentId)
      .maybeSingle();

    if (error) throw error;
    return data as TournamentRegistration | null;
  },

  async updatePaymentStatus(registrationId: string, status: 'completed' | 'failed'): Promise<void> {
    const { error } = await supabase
      .from('tournament_registrations')
      .update({ payment_status: status })
      .eq('id', registrationId);

    if (error) throw error;
  },

  async getTournamentRoom(tournamentId: string): Promise<TournamentRoom | null> {
    const { data, error } = await supabase
      .from('tournament_rooms')
      .select('*')
      .eq('tournament_id', tournamentId)
      .maybeSingle();

    if (error) throw error;
    return data as TournamentRoom | null;
  },

  async upsertTournamentRoom(tournamentId: string, roomData: Partial<Pick<TournamentRoom, 'room_id' | 'room_password'>>): Promise<TournamentRoom> {
    const { data, error } = await supabase
      .from('tournament_rooms')
      .upsert({
        tournament_id: tournamentId,
        ...roomData
      }, {
        onConflict: 'tournament_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data as TournamentRoom;
  }
};