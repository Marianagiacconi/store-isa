import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  id_token: string;
}

export interface User {
  id: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
  activated: boolean;
  authorities: string[];
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Restore token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  async login(credentials: LoginRequest): Promise<{ token: string; user: User }> {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/authenticate`, credentials);
      
      const token = response.data.id_token;
      this.setToken(token);
      
      // Get user details
      const user = await this.getCurrentUser();
      
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/account`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await axios.get(`${API_BASE_URL}/authenticate`, {
        headers: this.getAuthHeaders()
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getAuthHeaders(): { Authorization: string } | {} {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  isTokenExpired(): boolean {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService; 