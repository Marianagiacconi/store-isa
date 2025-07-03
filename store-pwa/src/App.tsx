import React, { createContext, useContext, useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonCheckbox,
  IonItem,
  IonText,
  IonToast,
  IonList,
  IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, pricetags, cart as cartIcon, person, logIn, logOut, statsChart, trash } from 'ionicons/icons';
import { authService, User } from './services/authService';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminPanel from './pages/AdminPanel';
import OfflineDemo from './pages/OfflineDemo';
import OfflineStatus from './components/OfflineStatus';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

// Test credentials for the default JHipster users
const TEST_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'admin',
    description: 'Administrator user with full access'
  },
  user: {
    username: 'user',
    password: 'user',
    description: 'Regular user with limited access'
  }
};

setupIonicReact();

// --- Contexto de autenticación ---
interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string;
  user: User | null;
  login: (username: string, password: string, admin?: boolean) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  username: '',
  user: null,
  login: async () => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; color?: string }>({ show: false, message: '' });

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = authService.getToken();
      if (token && !authService.isTokenExpired()) {
        const user = await authService.getCurrentUser();
        const isAdmin = user.authorities.includes('ROLE_ADMIN');
        
        setIsAuthenticated(true);
        setIsAdmin(isAdmin);
        setUsername(user.login);
        setUser(user);
      } else {
        // Clear any invalid tokens
        authService.logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUsername('');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      authService.logout();
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUsername('');
      setUser(null);
    }
  };

  const login = async (username: string, password: string, admin = false) => {
    try {
      const { token, user } = await authService.login({ username, password });
      const isAdminUser = user.authorities.includes('ROLE_ADMIN');
      
      setIsAuthenticated(true);
      setIsAdmin(isAdminUser);
      setUsername(user.login);
      setUser(user);
      
      setToast({ show: true, message: '¡Bienvenido!', color: 'success' });
      // Use window.location for navigation since we're outside router context
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      setToast({ show: true, message: 'Error en el inicio de sesión', color: 'danger' });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUsername('');
    setUser(null);
    setToast({ show: true, message: 'Sesión cerrada', color: 'primary' });
    // Use window.location for navigation since we're outside router context
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, user, login, logout }}>
      {children}
      <IonToast
        isOpen={toast.show}
        message={toast.message}
        duration={1500}
        color={toast.color}
        onDidDismiss={() => setToast({ ...toast, show: false })}
      />
    </AuthContext.Provider>
  );
};

// --- Contexto de carrito ---
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});
export const useCart = () => useContext(CartContext);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p);
      }
      return [...prev, item];
    });
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Página de Carrito ---
const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Carrito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {cart.length === 0 ? (
            <IonItem>El carrito está vacío</IonItem>
          ) : (
            cart.map(item => (
              <IonItem key={item.id}>
                <IonLabel>{item.name} (x{item.quantity})</IonLabel>
                <IonBadge color="success" slot="end">${(item.price * item.quantity).toFixed(2)}</IonBadge>
                <IonButton slot="end" color="danger" onClick={() => removeFromCart(item.id)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            ))
          )}
        </IonList>
        {cart.length > 0 && (
          <div style={{ padding: 16 }}>
            <IonText>Total: <b>${total.toFixed(2)}</b></IonText>
            <IonButton expand="block" color="medium" onClick={clearCart} style={{ marginTop: 8 }}>Vaciar carrito</IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

// --- Página de Perfil ---
const ProfilePage: React.FC = () => {
  const { username, isAdmin, logout } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ padding: 24 }}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Datos de usuario</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><b>Usuario:</b> {username}</p>
            <p><b>Rol:</b> {isAdmin ? 'Admin' : 'Usuario'}</p>
            <IonButton expand="block" color="danger" onClick={logout} style={{ marginTop: 16 }}>Cerrar sesión</IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

// --- Rutas protegidas ---
const PrivateRoute: React.FC<{ component: React.FC<any>; path: string; exact?: boolean; adminOnly?: boolean; }> = ({ component: Component, adminOnly = false, ...rest }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && (!adminOnly || isAdmin) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

// --- Barra de navegación global ---
const NavigationTabs: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/">
        <IonIcon icon={home} />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>
      {isAuthenticated && (
        <IonTabButton tab="products" href="/products">
          <IonIcon icon={pricetags} />
          <IonLabel>Productos</IonLabel>
        </IonTabButton>
      )}
      {isAuthenticated && (
        <IonTabButton tab="cart" href="/cart">
          <IonIcon icon={cartIcon} />
          <IonLabel>Carrito</IonLabel>
          {cart.length > 0 && <IonBadge color="danger">{cart.length}</IonBadge>}
        </IonTabButton>
      )}
      {isAuthenticated && (
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      )}
      {isAdmin && (
        <IonTabButton tab="admin" href="/admin">
          <IonIcon icon={statsChart} />
          <IonLabel>Admin</IonLabel>
        </IonTabButton>
      )}
      {!isAuthenticated && (
        <IonTabButton tab="login" href="/login">
          <IonIcon icon={logIn} />
          <IonLabel>Login</IonLabel>
        </IonTabButton>
      )}
    </IonTabBar>
  );
};

// --- App principal ---
const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <IonApp>
      <AuthProvider>
        <CartProvider>
          <OfflineStatus />
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/login" render={() =>
                  isAuthenticated ? <Redirect to="/" /> : <LoginForm />
                } exact />
                <Route path="/" component={Home} exact />
                <PrivateRoute path="/products" component={Products} />
                <PrivateRoute path="/cart" component={CartPage} />
                <PrivateRoute path="/profile" component={ProfilePage} />
                <PrivateRoute path="/admin" component={AdminPanel} adminOnly />
                <Route path="/offline-demo" component={OfflineDemo} />
                <Redirect exact from="/home" to="/" />
              </IonRouterOutlet>
              <NavigationTabs />
            </IonTabs>
          </IonReactRouter>
        </CartProvider>
      </AuthProvider>
    </IonApp>
  );
};

// --- Login profesional con Ionic ---
const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(username, password, admin);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else if (error.response?.status === 0) {
        setError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else {
        setError('Error en el inicio de sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IonCard style={{ minWidth: 320, maxWidth: 360 }}>
            <IonCardHeader>
              <IonCardTitle style={{ textAlign: 'center' }}>Bienvenido</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmit} autoComplete="off">
                <IonItem>
                  <IonLabel position="floating">Usuario</IonLabel>
                  <IonInput
                    value={username}
                    onIonChange={e => setUsername(e.detail.value!)}
                    required
                    autocomplete="username"
                    disabled={loading}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={e => setPassword(e.detail.value!)}
                    required
                    autocomplete="current-password"
                    disabled={loading}
                  />
                </IonItem>
                <IonItem lines="none">
                  <IonCheckbox 
                    checked={admin} 
                    onIonChange={e => setAdmin(e.detail.checked!)} 
                    slot="start" 
                    disabled={loading}
                  />
                  <IonLabel>Entrar como admin</IonLabel>
                </IonItem>
                {error && (
                  <IonText color="danger">
                    <p style={{ margin: 8, textAlign: 'center' }}>{error}</p>
                  </IonText>
                )}
                <IonButton 
                  expand="block" 
                  type="submit" 
                  style={{ marginTop: 16 }}
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Entrar'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default App;
