export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  items?: MenuItem[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number; // minor units
  imageUrl: string;
  modelUrl: string;
  foodColor: string;
  isFeatured: boolean;
  isAvailable: boolean;
  spiceLevel: number;
  categoryId: string;
  category?: { name: string; slug: string };
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  tableNumber: string;
  reservationDate?: string | null;
  guests: number;
  notes: string;
  status: OrderStatus;
  paymentMethod: "COD" | "CARD";
  paymentStatus: "UNPAID" | "PAID";
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  nameSnapshot: string;
};

// Standard API envelope from src/lib/api.ts
export type ApiResult<T> = { data: T } | { error: string; details?: unknown };
