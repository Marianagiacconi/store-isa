import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLoading,
  IonToast
} from '@ionic/react';
import { book, people, cart, statsChart, refresh } from 'ionicons/icons';
import { productService, customerService, orderService } from '../services/api';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [productsResponse, customersResponse, ordersResponse] = await Promise.all([
        productService.getAll(),
        customerService.getAll(),
        orderService.getAll()
      ]);
      const totalRevenue = ordersResponse.data.reduce((sum, order) => {
        return sum + (order.totalPrice || 0);
      }, 0);
      setStats({
        totalProducts: productsResponse.data.length,
        totalCustomers: customersResponse.data.length,
        totalOrders: ordersResponse.data.length,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      showToastMessage('Error al cargar las estadísticas', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panel de Administración</IonTitle>
          <IonIcon icon={refresh} slot="end" onClick={loadStats} style={{ cursor: 'pointer', marginLeft: 16 }} />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message="Cargando estadísticas..." />
        <div style={{ padding: '1rem' }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={statsChart} style={{ marginRight: '0.5rem' }} />
                Estadísticas de la Tienda
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6" sizeMd="3">
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <IonIcon icon={book} size="large" color="primary" />
                      <h3>{stats.totalProducts}</h3>
                      <p>Productos</p>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <IonIcon icon={people} size="large" color="secondary" />
                      <h3>{stats.totalCustomers}</h3>
                      <p>Clientes</p>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <IonIcon icon={cart} size="large" color="tertiary" />
                      <h3>{stats.totalOrders}</h3>
                      <p>Órdenes</p>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <IonIcon icon={statsChart} size="large" color="success" />
                      <h3>${stats.totalRevenue.toFixed(2)}</h3>
                      <p>Ingresos</p>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminPanel; 