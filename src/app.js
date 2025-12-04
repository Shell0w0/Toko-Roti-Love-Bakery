document.addEventListener('alpine:init', () => {
    
    // DATA PRODUK
    Alpine.data('products', () => ({
        items: [
            {id: 1, name: 'Wedding Cakes 1', Image: 'produk1.jpg', price: 450000},
            {id: 2, name: 'Wedding Cakes 2', Image: 'produk2.jpg', price: 550000},
            {id: 3, name: 'Wedding Cakes 3', Image: 'produk3.jpg', price: 650000},
            {id: 4, name: 'Wedding Cakes 4', Image: 'produk4.jpg', price: 750000},
        ],
    }));

    // Alpine Data untuk Modal Product
document.addEventListener('alpine:init', () => {
  Alpine.data('modalProduct', () => ({
    isOpen: false,
    selectedItem: {
      id: 0,
      name: '',
      Image: '',
      price: 0,
      description: ''
    },
    
    showModal(item) {
      this.selectedItem = item;
      this.isOpen = true;
      // Refresh feather icons setelah modal terbuka
      setTimeout(() => feather.replace(), 100);
    },
    
    closeModal() {
      this.isOpen = false;
    },
    
    addToCart() {
      Alpine.store('cart').add(this.selectedItem);
      this.closeModal();
    }
  }));
  
  // Fungsi global untuk dipanggil dari products section
  window.showModal = function(item) {
    // Trigger modal melalui Alpine
    const modal = document.querySelector('#item-detail-modal');
    if (modal) {
      Alpine.evaluate(modal, '$data.showModal(item)', { item });
    }
  };
});

    // CART STORE
    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            const cartItem = this.items.find((item) => item.id === newItem.id);
            if (!cartItem) {
                this.items.push({...newItem, quantity: 1, total: newItem.price});
                this.quantity++;
                this.total += newItem.price;
            } else {
                this.items = this.items.map((item) => {
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            // ambil item yang mau di remove idnya
            const cartItem = this.items.find((item) => item.id === id);
            // jika item lebih dari 1
            if(cartItem.quantity > 1) {
                // telusuri 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }

                })
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});


// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    let allFilled = true;
    
    // Hanya validasi input yang visible dan required
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    
    if (nameInput.value.trim() === '' || 
        emailInput.value.trim() === '' || 
        phoneInput.value.trim() === '') {
        allFilled = false;
    }
    
    // Enable/disable button
    if (allFilled) {
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('disabled');
    } else {
        checkoutButton.disabled = true;
        checkoutButton.classList.add('disabled');
    }
});

// Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    
    const message = formatMessage(objData);
    
    window.open(
        'https://wa.me/6285215718399?text=' + encodeURIComponent(message)
    );
});

// Format pesan whatsapp
const formatMessage = (obj) => {
    return `Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No HP: ${obj.phone}

Data Pesanan
${JSON.parse(obj.items)
    .map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})`)
    .join('\n')}

TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

// konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
