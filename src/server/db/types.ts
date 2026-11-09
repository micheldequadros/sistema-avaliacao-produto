/** Tipos do schema `public` (espelham database/migrations). */
export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          salt: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          salt: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["accounts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
