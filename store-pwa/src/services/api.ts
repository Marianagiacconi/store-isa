import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8081/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    console.log('API Request - Token encontrado:', token ? 'SÍ' : 'NO');
    if (token && !authService.isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Authorization header agregado');
    } else {
      console.log('API Request - No hay token válido, petición sin autenticación');
      if (token && authService.isTokenExpired()) {
        console.log('API Request - Token expirado, limpiando...');
        authService.logout();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    console.error('API Error Status:', error.response?.status);
    console.error('API Error Data:', error.response?.data);
    console.error('API Error Headers:', error.response?.headers);
    
    if (error.response?.status === 401) {
      console.log('API Error - Token expirado o inválido, redirigiendo a login');
      // Token expirado o inválido
      authService.logout();
      // Use window.location.href for hard redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos de datos actualizados para coincidir con el backend
export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  size?: string;
  image?: string;
  productCategory?: ProductCategory;
}

export interface ProductCategory {
  id?: number;
  name: string;
  description?: string;
}

export interface CustomerDetails {
  id?: number;
  gender: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  user?: User;
}

export interface User {
  id?: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface ProductOrder {
  id?: number;
  quantity: number;
  totalPrice: number;
  product?: Product;
  cart?: ShoppingCart;
}

export interface CreateProductOrderRequest {
  quantity: number;
  totalPrice: number;
  product: { id: number };
  cart: { id: number };
}

export interface CreateShoppingCartRequest {
  placedDate: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  paymentReference?: string;
  customerDetails: { id: number };
}

export interface ShoppingCart {
  id?: number;
  placedDate: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  paymentReference?: string;
  customerDetails?: CustomerDetails;
  orders?: ProductOrder[];
}

// Servicios de API actualizados
export const productService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (product: Product) => api.post<Product>('/products', product),
  update: (id: number, product: Product) => api.put<Product>(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const customerService = {
  getAll: () => api.get<CustomerDetails[]>('/customer-details'),
  getById: (id: number) => api.get<CustomerDetails>(`/customer-details/${id}`),
  create: (customer: CustomerDetails) => api.post<CustomerDetails>('/customer-details', customer),
  update: (id: number, customer: CustomerDetails) => api.put<CustomerDetails>(`/customer-details/${id}`, customer),
  delete: (id: number) => api.delete(`/customer-details/${id}`),
};

export const orderService = {
  getAll: () => api.get<ProductOrder[]>('/product-orders'),
  getById: (id: number) => api.get<ProductOrder>(`/product-orders/${id}`),
  create: (order: CreateProductOrderRequest) => api.post<ProductOrder>('/product-orders', order),
  update: (id: number, order: ProductOrder) => api.put<ProductOrder>(`/product-orders/${id}`, order),
  delete: (id: number) => api.delete(`/product-orders/${id}`),
};

export const shoppingCartService = {
  getAll: () => api.get<ShoppingCart[]>('/shopping-carts'),
  getById: (id: number) => api.get<ShoppingCart>(`/shopping-carts/${id}`),
  create: (cart: CreateShoppingCartRequest) => api.post<ShoppingCart>('/shopping-carts', cart),
  update: (id: number, cart: ShoppingCart) => api.put<ShoppingCart>(`/shopping-carts/${id}`, cart),
  delete: (id: number) => api.delete(`/shopping-carts/${id}`),
};

export const categoryService = {
  getAll: () => api.get<ProductCategory[]>('/product-categories'),
  getById: (id: number) => api.get<ProductCategory>(`/product-categories/${id}`),
  create: (category: ProductCategory) => api.post<ProductCategory>('/product-categories', category),
  update: (id: number, category: ProductCategory) => api.put<ProductCategory>(`/product-categories/${id}`, category),
  delete: (id: number) => api.delete(`/product-categories/${id}`),
};

export default api; 