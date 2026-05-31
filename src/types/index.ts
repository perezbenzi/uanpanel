export type OrderStatus = 'nuevo' | 'en_preparacion' | 'entregado' | 'cancelado'

// type (not interface) so these satisfy extends Record<string, unknown> for Supabase generics
export type Product = {
  id: string
  name: string
  tag: string | null
  price: number
  description: string | null
  image_url: string | null
  active: boolean
  store_id: string
}

export type Order = {
  id: string
  created_at: string
  customer_name: string
  total: number
  status: OrderStatus
  store_id: string
}

export type OrderItem = {
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export type Tenant = {
  id: string
  name: string
  slug: string
  owner_id: string
}

export type Store = {
  id: string
  name: string
  store_id: string
  tenant_id: string
}

type TableDef<Row extends Record<string, unknown>, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      products: TableDef<
        Product,
        Omit<Product, 'id'> & { id?: string },
        Partial<Product>
      >
      orders: TableDef<
        Order,
        Omit<Order, 'id' | 'created_at'> & { id?: string; created_at?: string },
        Partial<Order>
      >
      order_items: TableDef<OrderItem, OrderItem, Partial<OrderItem>>
      tenants: TableDef<
        Tenant,
        Omit<Tenant, 'id'> & { id?: string },
        Partial<Tenant>
      >
      stores: TableDef<
        Store,
        Omit<Store, 'id'> & { id?: string },
        Partial<Store>
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { order_status: OrderStatus }
    CompositeTypes: Record<string, never>
  }
}
