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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonChip,
  IonToast,
  IonLoading
} from '@ionic/react';
import {
  wifi,
  wifiOutline,
  download,
  cloudUpload,
  refresh,
  checkmarkCircle,
  informationCircle,
  settings,
  trash
} from 'ionicons/icons';
import { useOfflineStorage, getOfflineData, saveOfflineData } from '../hooks/useOfflineStorage';

const OfflineDemo: React.FC = () => {
  const { isOnline, pendingActions, syncOfflineData, clearPendingActions } = useOfflineStorage();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const [swStatus, setSwStatus] = useState<'unknown' | 'registered' | 'not-supported'>('unknown');

  useEffect(() => {
    checkServiceWorkerStatus();
  }, []);

  const checkServiceWorkerStatus = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      setSwStatus(registration ? 'registered' : 'not-supported');
    } else {
      setSwStatus('not-supported');
    }
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleManualSync = async () => {
    try {
      await syncOfflineData();
      showToastMessage('Sincronización completada', 'success');
    } catch (error) {
      showToastMessage('Error en la sincronización', 'danger');
    }
  };

  const handleClearActions = () => {
    clearPendingActions();
    showToastMessage('Acciones offline limpiadas', 'warning');
  };

  const testOfflineStorage = () => {
    const testData = {
      message: 'Datos de prueba guardados offline',
      timestamp: new Date().toISOString(),
      items: ['item1', 'item2', 'item3']
    };
    
    saveOfflineData('test', testData);
    showToastMessage('Datos de prueba guardados offline', 'success');
  };

  const loadOfflineData = () => {
    const data = getOfflineData('test');
    if (data) {
      showToastMessage(`Datos offline cargados: ${data.message}`, 'success');
    } else {
      showToastMessage('No hay datos offline guardados', 'warning');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'success';
      case 'not-supported': return 'danger';
      default: return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registered': return 'Registrado';
      case 'not-supported': return 'No soportado';
      default: return 'Desconocido';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Demo PWA Offline</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '1rem' }}>
          {/* Estado de conexión */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={isOnline ? wifi : wifiOutline} style={{ marginRight: '0.5rem' }} />
                Estado de Conexión
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonChip color={isOnline ? 'success' : 'warning'}>
                <IonIcon icon={isOnline ? wifi : wifiOutline} />
                <IonLabel>{isOnline ? 'En línea' : 'Sin conexión'}</IonLabel>
              </IonChip>
              
              <p style={{ marginTop: '1rem' }}>
                {isOnline 
                  ? 'Tu aplicación está conectada a internet y funcionando normalmente.'
                  : 'Tu aplicación está funcionando en modo offline. Los datos se sincronizarán cuando se restaure la conexión.'
                }
              </p>
            </IonCardContent>
          </IonCard>

          {/* Service Worker Status */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={settings} style={{ marginRight: '0.5rem' }} />
                Service Worker
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonChip color={getStatusColor(swStatus)}>
                <IonIcon icon={checkmarkCircle} />
                <IonLabel>{getStatusText(swStatus)}</IonLabel>
              </IonChip>
              
              <p style={{ marginTop: '1rem' }}>
                El Service Worker permite que la aplicación funcione offline y cachee recursos importantes.
              </p>
            </IonCardContent>
          </IonCard>

          {/* Acciones Pendientes */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={cloudUpload} style={{ marginRight: '0.5rem' }} />
                Acciones Pendientes
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonBadge color="primary" style={{ marginBottom: '1rem' }}>
                {pendingActions.length} acciones pendientes
              </IonBadge>
              
              {pendingActions.length > 0 && (
                <IonList>
                  {pendingActions.slice(0, 3).map((action, index) => (
                    <IonItem key={action.id}>
                      <IonLabel>
                        <h3>{action.type} {action.url}</h3>
                        <p>{new Date(action.timestamp).toLocaleString()}</p>
                      </IonLabel>
                    </IonItem>
                  ))}
                  {pendingActions.length > 3 && (
                    <IonItem>
                      <IonLabel>
                        <p>... y {pendingActions.length - 3} más</p>
                      </IonLabel>
                    </IonItem>
                  )}
                </IonList>
              )}
              
              <div style={{ marginTop: '1rem' }}>
                <IonButton 
                  fill="outline" 
                  onClick={handleManualSync}
                  disabled={!isOnline || pendingActions.length === 0}
                >
                  <IonIcon slot="start" icon={refresh} />
                  Sincronizar Ahora
                </IonButton>
                
                <IonButton 
                  fill="outline" 
                  color="warning"
                  onClick={handleClearActions}
                  disabled={pendingActions.length === 0}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <IonIcon slot="start" icon={trash} />
                  Limpiar
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Pruebas Offline */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={download} style={{ marginRight: '0.5rem' }} />
                Pruebas Offline
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Prueba las funcionalidades offline de la aplicación:</p>
              
              <div style={{ marginTop: '1rem' }}>
                <IonButton 
                  fill="outline" 
                  onClick={testOfflineStorage}
                  style={{ marginRight: '0.5rem' }}
                >
                  Guardar Datos Offline
                </IonButton>
                
                <IonButton 
                  fill="outline" 
                  onClick={loadOfflineData}
                >
                  Cargar Datos Offline
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Información PWA */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={informationCircle} style={{ marginRight: '0.5rem' }} />
                Características PWA
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>✅ Instalable</h3>
                    <p>Puedes instalar esta app en tu dispositivo</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>✅ Funciona Offline</h3>
                    <p>La app funciona sin conexión a internet</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>✅ Sincronización</h3>
                    <p>Los datos se sincronizan cuando vuelves a estar online</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>✅ Cache Inteligente</h3>
                    <p>Recursos importantes se cachean automáticamente</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default OfflineDemo; 