import { defineStore } from 'pinia';


export const useCartStore = defineStore('sepet', {
    state: () => ({
        sepet: [],
    }),
    actions: {
        async addNewProduct(product) {
            try {
                const response = await fetch('https://fakestoreapi.com/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('ürün eklendi', data);
            } catch (error) {
                console.error('ürün eklenirken hata oluştu', error);
            }
        },

        async addToSepet(product) {
            const itemInsepet = this.sepet.find(item => item.id === product.id);
            if (itemInsepet)
                itemInsepet.quantity += 1;
            else
                this.sepet.push({ ...product, quantity: 1 });
        },
        removeFromSepet(productId) {
            const itemIndex = this.sepet.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                if (this.sepet[itemIndex].quantity > 1) {
                    this.sepet[itemIndex].quantity -= 1;
                } else {
                    this.sepet.splice(itemIndex, 1);
                }
            }
        },
    },
});
