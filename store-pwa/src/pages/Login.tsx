import React, { useState } from 'react';
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
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonToast,
  IonLoading,
  IonIcon,
} from '@ionic/react';
import { person, lockClosed, logIn } from 'ionicons/icons';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando login con:', { username, password });
    
    if (!username || !password) {
      showToastMessage('Por favor completa todos los campos', 'warning');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Enviando petición a:', 'http://localhost:8081/api/authenticate');
      
      const response = await fetch('http://localhost:8081/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          rememberMe: false
        }),
      });

      console.log('Respuesta recibida:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso, token recibido:', data.id_token ? 'SÍ' : 'NO');
        
        localStorage.setItem('authToken', data.id_token);
        localStorage.setItem('username', username);
        
        console.log('Token guardado en localStorage');
        console.log('Llamando a onLogin...');
        
        onLogin(data.id_token);
        showToastMessage('¡Inicio de sesión exitoso!', 'success');
      } else {
        const errorText = await response.text();
        console.error('Error en login:', response.status, errorText);
        showToastMessage(`Error: ${response.status} - ${errorText}`, 'danger');
      }
    } catch (error) {
      console.error('Error durante login:', error);
      showToastMessage(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string, color: string) => {
    console.log('Mostrando toast:', message, color);
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          height: '100%',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle style={{ textAlign: 'center' }}>
                <IonIcon icon={logIn} size="large" color="primary" />
                <br />
                Tienda de Libros
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonLabel position="stacked">
                    <IonIcon icon={person} style={{ marginRight: '0.5rem' }} />
                    Usuario
                  </IonLabel>
                  <IonInput
                    type="text"
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                    placeholder="admin o user"
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">
                    <IonIcon icon={lockClosed} style={{ marginRight: '0.5rem' }} />
                    Contraseña
                  </IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    placeholder="admin o user"
                    required
                  />
                </IonItem>

                <div style={{ padding: '1rem 0' }}>
                  <IonButton expand="block" type="submit" disabled={loading}>
                    <IonIcon slot="start" icon={logIn} />
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </IonButton>
                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p><strong>Credenciales de prueba:</strong></p>
                <p><strong>Admin:</strong> admin / admin</p>
                <p><strong>Usuario:</strong> user / user</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message="Iniciando sesión..." />

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

export default Login; 