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
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          external_link: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          image_url: string;
          external_link: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      products_feedbacks: {
        Row: {
          id: string;
          score: number;
          comment: string;
          created_at: string;
          created_by: string;
          product_id: string;
        };
        Insert: {
          id: string;
          score: number;
          comment: string;
          created_at?: string;
          created_by: string;
          product_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["products_feedbacks"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "products_feedbacks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_feedbacks_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
