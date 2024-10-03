<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { NButton, NCard, NDrawer, NModal, NInput } from 'naive-ui';

const sepetStore = useCartStore();
const showSepetDrawer = ref(false);
const showModal = ref(false);
const products = ref([]);


const newProduct = ref({
  title: '',
  price: 0,
  description: '',
});

const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    products.value = data;
  } catch (error) {
    console.error('Ürünler çekilemedi:', error);
  }
};

onMounted(() => {
  fetchProducts();
});

const addToSepet = (product) => {
  sepetStore.addToSepet({
    id: product.id,
    title: product.title,
    price: product.price,
    quantity: 1
  });
};


const submitProduct = async () => {

  if (!newProduct.value.title || !newProduct.value.price || !newProduct.value.description) {
    console.error('Lütfen tüm alanları doldurun!');
    return;
  }
  const product = {
    id: Date.now(),
    title: newProduct.value.title,
    price: parseFloat(newProduct.value.price),
    description: newProduct.value.description,
  };

  await sepetStore.addNewProduct(product);

  products.value.push(product);

  newProduct.value = { title: '', price: 0, description: '' };
  showModal.value = false;
};

const toggleSepetDrawer = () => {
  showSepetDrawer.value = !showSepetDrawer.value;
};


const toggleModal = () => {
  showModal.value = !showModal.value;
};

const sepet = sepetStore.sepet;
const totalPrice = computed(() => sepetStore.sepet.reduce((total, item) => total + item.price * item.quantity, 0));

const removeProductFromSepet = (productId) => {
  sepetStore.removeFromSepet(productId);
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Ürünler</h1>

    <n-button type="primary" @click="toggleModal">Yeni Ürün Ekle</n-button>

    <div style="position: fixed; top: 40px; right: 4px; z-index: 10">
      <n-button type="info" @click="toggleSepetDrawer">
        Sepetim ({{ sepet.length }})
      </n-button>
    </div>

    <div class="grid">
      <n-card
          v-for="product in products"
          :key="product.id"
          class="product-card"
          :title="product.title"
          :hoverable="true"
          style="height: 350px;"
      >
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div style="flex-grow: 1;">
            <p class="description" style="margin: 0;">{{ product.description }}</p>
            <p style="font-size: 1.25rem; font-weight: bold;">{{ product.price }} TL</p>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: auto;">
            <n-button type="primary" @click="() => addToSepet(product)">Sepete Ekle</n-button>
          </div>
        </div>
      </n-card>
    </div>

    <n-modal style="width:400px; height: auto" :show="showModal" title="Yeni Ürün Ekle" @close="toggleModal">
      <div>
        <div class="mb-6">
          <n-input v-model:value="newProduct.title" placeholder="Ürün Başlığı" />
          <n-input v-model:value="newProduct.price" placeholder="Ürün Fiyatı" type="number" />
          <n-input v-model:value="newProduct.description" placeholder="Ürün Açıklaması" />

        </div>
        <n-button type="primary" @click="submitProduct">Ürünü Ekle</n-button>
      </div>
    </n-modal>

    <n-drawer v-model:show="showSepetDrawer" title="sepet" width="400px">
      <h1>SEPET</h1>
      <div v-if="sepet.length > 0">
        <div v-for="item in sepet" :key="item.id" style="border-bottom: 2px solid #000;">
          <div>
            <h3>{{ item.title }}</h3>
            <p>Miktar: {{ item.quantity }}</p>
          </div>
          <p>{{ item.quantity * item.price }} TL</p>
          <n-button type="error" @click="() => removeProductFromSepet(item.id)">Sepetten sil</n-button>
        </div>
        <div>
          <p style="font-weight: bold">Toplam: {{ totalPrice }} TL</p>
        </div>
      </div>
      <div v-else>
        <p>Sepet Boş.</p>
      </div>
    </n-drawer>
  </div>
</template>

<style scoped>
h1 {
  color: #1a202c;
}

.product-card {
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card p {
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

