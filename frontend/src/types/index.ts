export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  phone_number: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  email?: string;
}

export interface Product {
  id: number;
  name: string;
  category: number;
  category_name: string;
  brand: string;
  description: string;
  mrp: string;
  discount_percent: string;
  gst_percent: string;
  final_price: string;
  stock: number;
  image: string | null;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_price: number;
}

export interface Order {
  id: number;
  total_amount: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
}
