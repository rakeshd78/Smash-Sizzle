export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Burgers' | 'Pizzas' | 'Sandwiches' | 'French Fries' | 'Chicken' | 'Wraps' | 'Beverages' | 'Desserts';
  subCategory?: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isFeatured?: boolean;
  stock: number;
  ingredients: string;
  allergens: string;
  options?: {
    name: string;
    choices: { label: string; priceExtra: number }[];
  }[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    house: string;
    street: string;
    area: string;
    city: string;
    state: string;
    postalCode: string;
    instructions?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: any;
}

export interface SavedCard {
  id: string;
  cardHolder: string;
  cardNumber: string; // masked (e.g. **** **** **** 4242)
  expiry: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  isDefault?: boolean;
}

export interface SavedAddress {
  id: string;
  label: string; // Home, Work, etc.
  recipientName: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Promo {
  id: string;
  code: string;
  discountPercent: number;
  minOrder?: number;
  active: boolean;
}

export interface Settings {
  externalPaymentUrl: string;
  deliveryFee: number;
  taxRate: number;
  announcementText: string;
  isOpen: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
