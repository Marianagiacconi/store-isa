import React, { useState, useEffect } from 'react';
import { IonToast, IonIcon } from '@ionic/react';
import { wifi, wifiOutline } from 'ionicons/icons';

const OfflineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      console.log('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      console.log('Connection lost');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Toast */}
      <IonToast
        isOpen={showOfflineToast}
        onDidDismiss={() => setShowOfflineToast(false)}
        message="Sin conexión a internet. Algunas funciones pueden no estar disponibles."
        duration={4000}
        color="warning"
        icon={wifiOutline}
        position="top"
      />

      {/* Online Toast */}
      <IonToast
        isOpen={showOnlineToast}
        onDidDismiss={() => setShowOnlineToast(false)}
        message="Conexión restaurada"
        duration={2000}
        color="success"
        icon={wifi}
        position="top"
      />

      {/* Persistent offline indicator */}
      {!isOnline && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffc409',
            color: '#000',
            padding: '8px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <IonIcon icon={wifiOutline} />
          Modo sin conexión
        </div>
      )}
    </>
  );
};

export default OfflineStatus; 