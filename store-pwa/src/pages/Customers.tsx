import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAvatar,
} from '@ionic/react';
import { add, create, trash, person } from 'ionicons/icons';
import { customerService, CustomerDetails } from '../services/api';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDetails | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
      showToastMessage('Error al cargar los clientes', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (customer: CustomerDetails) => {
    try {
      if (editingCustomer?.id) {
        await customerService.update(editingCustomer.id, customer);
        showToastMessage('Cliente actualizado correctamente');
      } else {
        await customerService.create(customer);
        showToastMessage('Cliente creado correctamente');
      }
      setShowModal(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      showToastMessage('Error al guardar el cliente', 'danger');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await customerService.delete(id);
      showToastMessage('Cliente eliminado correctamente');
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToastMessage('Error al eliminar el cliente', 'danger');
    }
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToastMessage(message);
    setShowToast(true);
  };

  const openModal = (customer?: CustomerDetails) => {
    setEditingCustomer(customer || { 
      gender: 'MALE', 
      phone: '', 
      addressLine1: '', 
      city: '', 
      country: '' 
    });
    setShowModal(true);
  };

  const getCustomerName = (customer: CustomerDetails) => {
    return `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim() || 'Cliente sin nombre';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clientes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="Cargando clientes..." />

        {customers.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No hay clientes registrados</p>
            <IonButton onClick={() => openModal()}>
              <IonIcon slot="start" icon={add} />
              Agregar primer cliente
            </IonButton>
          </div>
        ) : (
          <IonList>
            {customers.map((customer) => (
              <IonItemSliding key={customer.id}>
                <IonItem>
                  <IonAvatar slot="start">
                    <IonIcon icon={person} size="large" />
                  </IonAvatar>
                  <IonCard style={{ width: '100%', margin: '0' }}>
                    <IonCardHeader>
                      <IonCardTitle>{getCustomerName(customer)}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p><strong>Email:</strong> {customer.user?.email || 'No disponible'}</p>
                      <p><strong>Teléfono:</strong> {customer.phone}</p>
                      <p><strong>Dirección:</strong> {customer.addressLine1}, {customer.city}, {customer.country}</p>
                      <p><strong>Género:</strong> {customer.gender}</p>
                    </IonCardContent>
                  </IonCard>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="primary" onClick={() => openModal(customer)}>
                    <IonIcon slot="icon-only" icon={create} />
                  </IonItemOption>
                  <IonItemOption color="danger" onClick={() => customer.id && handleDelete(customer.id)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <CustomerForm
            customer={editingCustomer}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        </IonModal>

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

// Componente del formulario
interface CustomerFormProps {
  customer: CustomerDetails | null;
  onSave: (customer: CustomerDetails) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CustomerDetails>({
    gender: customer?.gender || 'MALE',
    phone: customer?.phone || '',
    addressLine1: customer?.addressLine1 || '',
    addressLine2: customer?.addressLine2 || '',
    city: customer?.city || '',
    country: customer?.country || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{customer?.id ? 'Editar Cliente' : 'Nuevo Cliente'}</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onCancel}>
            Cancelar
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Género *</IonLabel>
            <IonSelect
              value={formData.gender}
              onIonChange={(e) => setFormData({ ...formData, gender: e.detail.value })}
              required
            >
              <IonSelectOption value="MALE">Masculino</IonSelectOption>
              <IonSelectOption value="FEMALE">Femenino</IonSelectOption>
              <IonSelectOption value="OTHER">Otro</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Teléfono *</IonLabel>
            <IonInput
              value={formData.phone}
              onIonChange={(e) => setFormData({ ...formData, phone: e.detail.value! })}
              required
              placeholder="+1234567890"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Dirección *</IonLabel>
            <IonInput
              value={formData.addressLine1}
              onIonChange={(e) => setFormData({ ...formData, addressLine1: e.detail.value! })}
              required
              placeholder="Calle y número"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Dirección 2</IonLabel>
            <IonInput
              value={formData.addressLine2}
              onIonChange={(e) => setFormData({ ...formData, addressLine2: e.detail.value! })}
              placeholder="Apartamento, suite, etc."
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Ciudad *</IonLabel>
            <IonInput
              value={formData.city}
              onIonChange={(e) => setFormData({ ...formData, city: e.detail.value! })}
              required
              placeholder="Ciudad"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">País *</IonLabel>
            <IonInput
              value={formData.country}
              onIonChange={(e) => setFormData({ ...formData, country: e.detail.value! })}
              required
              placeholder="País"
            />
          </IonItem>

          <div style={{ padding: '1rem' }}>
            <IonButton expand="block" type="submit">
              {customer?.id ? 'Actualizar' : 'Crear'} Cliente
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Customers; 