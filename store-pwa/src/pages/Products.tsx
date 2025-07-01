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
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from '@ionic/react';
import {
  add,
  create,
  trash,
  close,
  save,
  refresh,
  search,
} from 'ionicons/icons';
import { productService, categoryService, Product, ProductCategory } from '../services/api';
import { useCart } from '../App';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, cart: cartItems } = useCart();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      showToastMessage('Error al cargar productos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      if (editingProduct?.id) {
        await productService.update(editingProduct.id, product);
        showToastMessage('Producto actualizado exitosamente');
      } else {
        await productService.create(product);
        showToastMessage('Producto creado exitosamente');
      }
      setShowModal(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showToastMessage('Error al guardar producto', 'danger');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.delete(id);
      showToastMessage('Producto eliminado exitosamente');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToastMessage('Error al eliminar producto', 'danger');
    }
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToastMessage(message);
    setShowToast(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para agregar al carrito
  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id ?? 0, name: product.name, price: product.price, quantity: 1 });
    showToastMessage(`Producto "${product.name}" agregado al carrito!`);
    // Aquí puedes agregar la lógica real para agregar al carrito
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestión de Productos</IonTitle>
          <IonButton slot="end" fill="clear" onClick={loadProducts}>
            <IonIcon icon={refresh} />
          </IonButton>
          <IonBadge 
            data-testid="cart-count" 
            color="success" 
            style={{ marginRight: '1rem' }}
          >
            {cartItems.length}
          </IonBadge>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loading} message="Cargando productos..." />

        <div style={{ padding: '1rem' }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Buscar Productos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInput
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onIonChange={(e) => setSearchTerm(e.detail.value!)}
                clearInput
              />
            </IonCardContent>
          </IonCard>

          <IonGrid>
            <IonRow data-testid="product-list">
              {filteredProducts.map((product) => (
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
                          fill="outline"
                          size="small"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowModal(true);
                          }}
                        >
                          <IonIcon slot="start" icon={create} />
                          Editar
                        </IonButton>
                        <IonButton
                          fill="outline"
                          color="danger"
                          size="small"
                          onClick={() => product.id && handleDelete(product.id)}
                        >
                          <IonIcon slot="start" icon={trash} />
                          Eliminar
                        </IonButton>
                        <IonButton
                          data-testid="add-to-cart"
                          fill="solid"
                          color="success"
                          size="small"
                          style={{ marginLeft: '0.5rem' }}
                          onClick={() => handleAddToCart(product)}
                        >
                          Agregar al carrito
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          {filteredProducts.length === 0 && !loading && (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No se encontraron productos</p>
                <IonButton onClick={() => setShowModal(true)}>
                  <IonIcon slot="start" icon={add} />
                  Agregar Primer Producto
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </IonTitle>
              <IonButton slot="end" fill="clear" onClick={() => setShowModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <div style={{ padding: '1rem' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const product: Product = {
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    price: parseFloat(formData.get('price') as string),
                    size: formData.get('size') as string,
                    image: formData.get('image') as string,
                  };
                  handleSave(product);
                }}
              >
                <IonItem>
                  <IonLabel position="stacked">Nombre *</IonLabel>
                  <IonInput
                    name="name"
                    value={editingProduct?.name}
                    required
                    placeholder="Nombre del producto"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Descripción</IonLabel>
                  <IonTextarea
                    name="description"
                    value={editingProduct?.description}
                    placeholder="Descripción del producto"
                    rows={3}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Precio *</IonLabel>
                  <IonInput
                    name="price"
                    type="number"
                    value={editingProduct?.price}
                    required
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Tamaño</IonLabel>
                  <IonInput
                    name="size"
                    value={editingProduct?.size}
                    placeholder="Tamaño del producto"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">URL de Imagen</IonLabel>
                  <IonInput
                    name="image"
                    value={editingProduct?.image}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </IonItem>

                <div style={{ padding: '1rem' }}>
                  <IonButton expand="block" type="submit">
                    <IonIcon slot="start" icon={save} />
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </IonButton>
                </div>
              </form>
            </div>
          </IonContent>
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

export default Products; 