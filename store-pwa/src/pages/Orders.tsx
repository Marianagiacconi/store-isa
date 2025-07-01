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
  IonBadge,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { add, create, trash, cart, calendar } from 'ionicons/icons';
import { orderService, ProductOrder, customerService, CustomerDetails, productService, Product, shoppingCartService, ShoppingCart, CreateProductOrderRequest, CreateShoppingCartRequest } from '../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerDetails[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductOrder | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
        orderService.getAll(),
        customerService.getAll(),
        productService.getAll()
      ]);
      setOrders(ordersResponse.data);
      setCustomers(customersResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      showToastMessage('Error al cargar los datos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (order: ProductOrder) => {
    try {
      console.log('Creando orden con datos:', order);
      
      // Verificar que se seleccionó un producto
      if (!order.product || !order.product.id) {
        showToastMessage('Debe seleccionar un producto', 'danger');
        return;
      }

      // Verificar que se seleccionó un cliente
      if (!selectedCustomer || !selectedCustomer.id) {
        showToastMessage('Debe seleccionar un cliente', 'danger');
        return;
      }

      let cartId: number;
      
      if (editingOrder?.id) {
        // Actualizar orden existente
        await orderService.update(editingOrder.id, order);
        showToastMessage('Orden actualizada correctamente');
      } else {
        // Crear nueva orden - primero necesitamos un carrito
        console.log('Creando carrito primero...');
        
        // Crear un carrito básico con el cliente seleccionado
        const newCart: CreateShoppingCartRequest = {
          placedDate: new Date().toISOString(),
          status: 'PENDING',
          totalPrice: order.totalPrice,
          paymentMethod: 'CREDIT_CARD',
          paymentReference: `PAY-${Date.now()}`,
          customerDetails: { id: selectedCustomer.id } // Solo enviar el ID del cliente
        };
        
        console.log('Datos del carrito a crear:', newCart);
        
        // Crear el carrito
        const cartResponse = await shoppingCartService.create(newCart);
        cartId = cartResponse.data.id!;
        
        console.log('Carrito creado con ID:', cartId);
        
        // Ahora crear la orden con las referencias correctas
        const orderData: CreateProductOrderRequest = {
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          product: { id: order.product.id }, // Solo enviar el ID del producto
          cart: { id: cartId } // Solo enviar el ID del carrito
        };
        
        console.log('Datos de la orden a crear:', orderData);
        
        await orderService.create(orderData);
        showToastMessage('Orden creada correctamente');
      }
      
      setShowModal(false);
      setEditingOrder(null);
      setSelectedCustomer(null);
      loadData();
    } catch (error) {
      console.error('Error saving order:', error);
      showToastMessage('Error al guardar la orden', 'danger');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await orderService.delete(id);
      showToastMessage('Orden eliminada correctamente');
      loadData();
    } catch (error) {
      console.error('Error deleting order:', error);
      showToastMessage('Error al eliminar la orden', 'danger');
    }
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToastMessage(message);
    setShowToast(true);
  };

  const openModal = (order?: ProductOrder) => {
    setEditingOrder(order || { 
      quantity: 1,
      totalPrice: 0,
      product: undefined,
      cart: undefined
    });
    setShowModal(true);
  };

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'primary';
    
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getCustomerName = (customerId?: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim() || 'Cliente sin nombre' : 'Cliente no encontrado';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Órdenes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="Cargando órdenes..." />

        {orders.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No hay órdenes registradas</p>
            <IonButton onClick={() => openModal()}>
              <IonIcon slot="start" icon={add} />
              Crear primera orden
            </IonButton>
          </div>
        ) : (
          <IonList>
            {orders.map((order) => (
              <IonItemSliding key={order.id}>
                <IonItem>
                  <IonCard style={{ width: '100%', margin: '0' }}>
                    <IonCardHeader>
                      <IonCardTitle>
                        Orden #{order.id}
                        <IonBadge 
                          color={getStatusColor(order.cart?.status)} 
                          style={{ marginLeft: '1rem' }}
                        >
                          {order.cart?.status || 'Sin estado'}
                        </IonBadge>
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p><strong>Cantidad:</strong> {order.quantity}</p>
                      <p><strong>Precio Total:</strong> ${order.totalPrice}</p>
                      <p><strong>Producto:</strong> {order.product?.name || 'Sin producto'}</p>
                      <p><strong>Fecha:</strong> {order.cart?.placedDate ? new Date(order.cart.placedDate).toLocaleDateString() : 'Sin fecha'}</p>
                    </IonCardContent>
                  </IonCard>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="primary" onClick={() => openModal(order)}>
                    <IonIcon slot="icon-only" icon={create} />
                  </IonItemOption>
                  <IonItemOption color="danger" onClick={() => order.id && handleDelete(order.id)}>
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
          <OrderForm
            order={editingOrder}
            customers={customers}
            products={products}
            selectedCustomer={selectedCustomer}
            onCustomerChange={(customer) => setSelectedCustomer(customer)}
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
interface OrderFormProps {
  order: ProductOrder | null;
  customers: CustomerDetails[];
  products: Product[];
  selectedCustomer: CustomerDetails | null;
  onCustomerChange: (customer: CustomerDetails | null) => void;
  onSave: (order: ProductOrder) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, customers, products, selectedCustomer, onCustomerChange, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProductOrder>({
    quantity: order?.quantity || 1,
    totalPrice: order?.totalPrice || 0,
    product: order?.product || undefined,
    cart: order?.cart || undefined
  });

  const getCustomerName = (customerId?: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.trim() || 'Cliente sin nombre' : 'Cliente no encontrado';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{order?.id ? 'Editar Orden' : 'Nueva Orden'}</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onCancel}>
            Cancelar
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Cantidad</IonLabel>
            <IonInput
              type="number"
              value={formData.quantity}
              onIonChange={(e) => setFormData({ ...formData, quantity: parseInt(e.detail.value!) })}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Precio Total</IonLabel>
            <IonInput
              type="number"
              step="0.01"
              value={formData.totalPrice}
              onIonChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.detail.value!) })}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Producto</IonLabel>
            <IonSelect
              value={formData.product?.id}
              onIonChange={(e) => {
                const selectedProduct = products.find(p => p.id === e.detail.value);
                setFormData({ ...formData, product: selectedProduct });
              }}
              required
            >
              {products.map(product => (
                <IonSelectOption key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Cliente</IonLabel>
            <IonSelect
              value={selectedCustomer?.id}
              onIonChange={(e) => {
                const selectedCustomer = customers.find(c => c.id === e.detail.value);
                onCustomerChange(selectedCustomer || null);
              }}
              required
            >
              {customers.map(customer => (
                <IonSelectOption key={customer.id} value={customer.id}>
                  {getCustomerName(customer.id)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <div style={{ padding: '1rem' }}>
            <IonButton expand="block" type="submit">
              {order?.id ? 'Actualizar' : 'Crear'} Orden
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Orders; 