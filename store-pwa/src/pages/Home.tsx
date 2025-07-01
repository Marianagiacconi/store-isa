import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonLoading,
  IonToast,
  IonBadge,
  IonItem,
  IonLabel,
  IonThumbnail,
} from '@ionic/react';
import { 
  book, 
  people, 
  cart, 
  statsChart, 
  add, 
  list,
  refresh,
  logOut,
  star,
  heart
} from 'ionicons/icons';
import { productService, customerService, orderService, Product } from '../services/api';
import { useAuth } from '../App';
import { useCart } from '../App';

interface HomeProps {
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
  const { isAdmin } = useAuth();
  const { addToCart, cart: cartItems } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, customersResponse, ordersResponse] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
        orderService.getAll()
      ]);

      // Calcular ingresos totales de las órdenes
      const totalRevenue = ordersResponse.data.reduce((sum, order) => {
        return sum + (order.totalPrice || 0);
      }, 0);

      // Tomar los primeros 6 productos como destacados
      const featured = productsResponse.data.slice(0, 6);

      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error loading data:', error);
      showToastMessage('Error al cargar los datos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id!,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    showToastMessage(`¡${product.name} agregado al carrito!`);
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tienda E-commerce</IonTitle>
          <IonBadge 
            data-testid="cart-count" 
            color="success" 
            style={{ marginRight: '1rem' }}
          >
            {cartItems.length}
          </IonBadge>
          <IonButton slot="end" fill="clear" onClick={onLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="Cargando tienda..." />

        <div style={{ padding: '1rem' }}>
          {/* Banner principal */}
          <IonCard style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <IonCardHeader>
              <IonCardTitle style={{ color: 'white', fontSize: '2rem' }}>
                🛍️ Bienvenido a Nuestra Tienda
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Descubre nuestra amplia selección de productos de alta calidad
              </p>
              <IonButton expand="block" fill="outline" routerLink="/products">
                Ver Todos los Productos
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Productos Destacados */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={star} style={{ marginRight: '0.5rem' }} />
                Productos Destacados
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow data-testid="product-list">
                  {featuredProducts.map((product) => (
                    <IonCol size="12" sizeMd="6" sizeLg="4" key={product.id}>
                      <IonCard>
                        <IonCardHeader>
                          <IonCardTitle>{product.name}</IonCardTitle>
                          {product.productCategory && (
                            <IonBadge color="primary">{product.productCategory.name}</IonBadge>
                          )}
                        </IonCardHeader>
                        <IonCardContent>
                          <p>{product.description}</p>
                          <p><strong>Precio:</strong> ${product.price}</p>
                          {product.size && <p><strong>Tamaño:</strong> {product.size}</p>}
                          <div style={{ marginTop: '1rem' }}>
                            <IonButton
                              data-testid="add-to-cart"
                              fill="solid"
                              color="success"
                              size="small"
                              onClick={() => handleAddToCart(product)}
                            >
                              <IonIcon slot="start" icon={cart} />
                              Agregar al carrito
                            </IonButton>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Navegación Rápida - Solo para Admins */}
          {isAdmin && (
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={book} style={{ marginRight: '0.5rem' }} />
                        Gestión de Productos
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>Administra el catálogo de productos de la tienda.</p>
                      <IonButton expand="block" routerLink="/products">
                        <IonIcon slot="start" icon={list} />
                        Ver Productos
                      </IonButton>
                      <IonButton expand="block" fill="outline" routerLink="/products">
                        <IonIcon slot="start" icon={add} />
                        Agregar Producto
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={people} style={{ marginRight: '0.5rem' }} />
                        Gestión de Clientes
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>Gestiona la información de los clientes.</p>
                      <IonButton expand="block" routerLink="/customers">
                        <IonIcon slot="start" icon={list} />
                        Ver Clientes
                      </IonButton>
                      <IonButton expand="block" fill="outline" routerLink="/customers">
                        <IonIcon slot="start" icon={add} />
                        Agregar Cliente
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={cart} style={{ marginRight: '0.5rem' }} />
                        Gestión de Órdenes
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>Administra los pedidos y órdenes de la tienda.</p>
                      <IonButton expand="block" routerLink="/orders">
                        <IonIcon slot="start" icon={list} />
                        Ver Órdenes
                      </IonButton>
                      <IonButton expand="block" fill="outline" routerLink="/orders">
                        <IonIcon slot="start" icon={add} />
                        Crear Orden
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
