const mobileToggle = document.getElementById('mobile-menu-toggle');
const menuOpenIcon = document.getElementById('menu-open-icon');
const menuCloseIcon = document.getElementById('menu-close-icon');
const mobileMenu = document.getElementById('mobile-menu');
const cartBadge = document.getElementById('cart-count-badge');
const currentYear = document.getElementById('current-year');

// Cart persistence helpers (stored in localStorage as 'kl_cart')
const getCart = () => {
  try {
    const raw = localStorage.getItem('kl_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem('kl_cart', JSON.stringify(cart));
  } catch (e) {
    // ignore
  }
};

const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

const updateCartBadge = () => {
  if (!cartBadge) return;
  const count = getCartCount();
  cartBadge.textContent = count;
  if (count > 0) {
    cartBadge.classList.remove('hidden');
  } else {
    cartBadge.classList.add('hidden');
  }
};

if (mobileToggle && menuOpenIcon && menuCloseIcon && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
      mobileMenu.classList.add('hidden');
      menuOpenIcon.classList.remove('hidden');
      menuCloseIcon.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      menuOpenIcon.classList.add('hidden');
      menuCloseIcon.classList.remove('hidden');
    }
  });
}

const addProductToCart = (id) => {
  const cart = getCart();
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.quantity = (existing.quantity || 0) + 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  saveCart(cart);
  updateCartBadge();
};

const removeProductFromCart = (id) => {
  const cart = getCart().filter((c) => c.id !== id);
  saveCart(cart);
  updateCartBadge();
};

const page = document.documentElement.dataset.page || 'home';
let globalRenderCheckout = null;

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const products = [
  {
    id: 1,
    name: 'Nasi Bakar Ayam',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    category: 'food',
    rating: 4.8,
    description: 'Nasi bakar dengan ayam suwir bumbu rempah Jawa',
    stock: 50,
  },
  {
    id: 2,
    name: 'Jamu Kunyit Asam',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    category: 'drinks',
    rating: 4.5,
    description: 'Jamu tradisional kunyit asam segar',
    stock: 100,
  },
  {
    id: 3,
    name: 'Sate Taichan',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    category: 'food',
    rating: 4.7,
    description: 'Sate ayam dengan sambal pedas khas',
    stock: 40,
  },
  {
    id: 4,
    name: 'Rendang Sapi',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop',
    category: 'food',
    rating: 4.9,
    description: 'Rendang daging sapi masakan Padang',
    stock: 30,
  },
  {
    id: 5,
    name: 'Es Teh Manis',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    category: 'drinks',
    rating: 4.3,
    description: 'Teh manis dingin menyegarkan',
    stock: 200,
  },
  {
    id: 6,
    name: 'Bakso Malang',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    category: 'food',
    rating: 4.6,
    description: 'Bakso dengan mie dan pangsit goreng',
    stock: 45,
  },
  {
    id: 7,
    name: 'Buku Tulis',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop',
    category: 'stationery',
    rating: 4.0,
    description: 'Buku tulis 40 lembar',
    stock: 300,
  },
  {
    id: 8,
    name: 'Seragam Batik',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop',
    category: 'uniforms',
    rating: 4.8,
    description: 'Seragam batik sekolah premium',
    stock: 20,
  },
  {
    id: 9,
    name: 'Wedang Jahe',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    category: 'drinks',
    rating: 4.4,
    description: 'Minuman jahe hangat tradisional',
    stock: 80,
  },
  {
    id: 10,
    name: 'Nasi Gudeg',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    category: 'food',
    rating: 4.7,
    description: 'Gudeg Jogja dengan ayam dan telur',
    stock: 35,
  },
  {
    id: 11,
    name: 'Pensil 2B',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop',
    category: 'stationery',
    rating: 4.2,
    description: 'Pensil 2B untuk ujian',
    stock: 500,
  },
  {
    id: 12,
    name: 'Dasi Sekolah',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400&h=300&fit=crop',
    category: 'uniforms',
    rating: 4.5,
    description: 'Dasi seragam sekolah',
    stock: 60,
  },
];

const renderProductCard = (product) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.floor(product.rating);
    return `<svg class="w-4 h-4 ${filled ? 'fill-accent text-accent' : 'fill-muted text-muted'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }).join('');

  return `
    <article class="overflow-hidden group hover:shadow-lg transition-all duration-300 border border-border bg-card rounded-xl">
      <div class="relative aspect-[4/3] overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full" />
      </div>
      <div class="p-4">
        <h3 class="font-serif font-semibold text-lg text-foreground mb-1 line-clamp-1">${product.name}</h3>
        <p class="text-sm text-muted-foreground mb-2 line-clamp-2">${product.description}</p>
        <div class="flex items-center gap-1 mb-3">
          ${stars}
          <span class="text-sm text-muted-foreground ml-1">(${product.rating})</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-bold text-lg text-primary">${formatPrice(product.price)}</span>
          <button type="button" data-product-id="${product.id}" class="add-to-cart-button inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
            <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Pesan
          </button>
        </div>
      </div>
    </article>
  `;
};

if (page === 'menu') {
  const searchInput = document.getElementById('search-input');
  const productCount = document.getElementById('product-count');
  const productGrid = document.getElementById('product-grid');
  const noResults = document.getElementById('no-results');
  const categoryButtons = document.querySelectorAll('.category-button');
  const sortButtons = document.querySelectorAll('.sort-button');

  let selectedCategory = 'all';
  let searchQuery = '';
  let sortMode = '';

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    return products.filter((product) => product.category === categoryId).length;
  };

  const setActiveCategory = () => {
    categoryButtons.forEach((button) => {
      const categoryId = button.dataset.category;
      if (categoryId === selectedCategory) {
        button.classList.add('bg-primary', 'text-primary-foreground');
        button.classList.remove('hover:bg-secondary', 'text-foreground');
      } else {
        button.classList.remove('bg-primary', 'text-primary-foreground');
        button.classList.add('hover:bg-secondary', 'text-foreground');
      }
    });
  };

  const renderProducts = (items) => {
    if (!productGrid) return;
    if (items.length === 0) {
      noResults?.classList.remove('hidden');
      productGrid.innerHTML = '';
      return;
    }

    noResults?.classList.add('hidden');
    productGrid.innerHTML = items.map(renderProductCard).join('');
  };

  const sortProducts = (items) => {
    if (sortMode === 'latest') {
      return [...items].reverse();
    }
    if (sortMode === 'best') {
      return [...items].sort((a, b) => b.rating - a.rating);
    }
    return items;
  };

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const sorted = sortProducts(filtered);

    if (productCount) {
      productCount.textContent = sorted.length;
    }
    renderProducts(sorted);
  };

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.category || 'all';
      setActiveCategory();
      filterProducts();
    });
  });

  searchInput?.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    filterProducts();
  });

  sortButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const label = button.textContent?.toLowerCase() || '';
      sortMode = label.includes('terbaru') ? 'latest' : 'best';
      sortButtons.forEach((btn) => {
        btn.classList.remove('bg-primary', 'text-primary-foreground');
      });
      button.classList.add('bg-primary', 'text-primary-foreground');
      filterProducts();
    });
  });

  setActiveCategory();
  filterProducts();
}

if (page === 'auth') {
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const nameField = document.getElementById('name-field');
  const authTitle = document.getElementById('auth-title');
  const authDescription = document.getElementById('auth-description');
  const authSubmit = document.getElementById('auth-submit');
  const authForm = document.getElementById('auth-form');
  const passwordInput = document.getElementById('password');
  const emailInput = document.getElementById('email');
  const errorMessage = document.getElementById('error-message');
  const togglePassword = document.getElementById('toggle-password');

  let authMode = 'login';

  const updateAuthView = () => {
    const isRegister = authMode === 'register';
    if (nameField) {
      nameField.classList.toggle('hidden', !isRegister);
    }
    if (authTitle) {
      authTitle.textContent = isRegister ? 'Daftar Akun Baru' : 'Masuk ke Akun';
    }
    if (authDescription) {
      authDescription.textContent = isRegister
        ? 'Isi data untuk membuat akun baru dan langsung mulai memesan.'
        : 'Masuk untuk melanjutkan pemesanan makanan tradisional.';
    }
    if (authSubmit) {
      authSubmit.textContent = isRegister ? 'Daftar' : 'Login';
    }
    if (loginTab && registerTab) {
      loginTab.classList.toggle('bg-primary', !isRegister);
      loginTab.classList.toggle('text-primary-foreground', !isRegister);
      loginTab.classList.toggle('bg-secondary', isRegister);
      loginTab.classList.toggle('text-secondary-foreground', isRegister);
      registerTab.classList.toggle('bg-primary', isRegister);
      registerTab.classList.toggle('text-primary-foreground', isRegister);
      registerTab.classList.toggle('bg-secondary', !isRegister);
      registerTab.classList.toggle('text-secondary-foreground', !isRegister);
    }
  };

  const showError = (message) => {
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  };

  const clearError = () => {
    if (!errorMessage) return;
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  };

  const setAuthMode = (mode) => {
    authMode = mode;
    clearError();
    updateAuthView();
  };

  loginTab?.addEventListener('click', () => setAuthMode('login'));
  registerTab?.addEventListener('click', () => setAuthMode('register'));

  togglePassword?.addEventListener('click', () => {
    if (!passwordInput) return;
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  });

  authForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();
    if (!emailInput || !passwordInput) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError('Lengkapi email dan password terlebih dahulu.');
      return;
    }

    if (authMode === 'login') {
      if (password !== 'demo123') {
        showError('Password tidak valid. Gunakan demo123 untuk demo.');
        return;
      }
      window.location.href = 'dashboard.html';
      return;
    }

    if (password.length < 6) {
      showError('Password harus minimal 6 karakter untuk pendaftaran.');
      return;
    }

    window.location.href = 'dashboard.html';
  });

  updateAuthView();
}

if (page === 'checkout') {
  const cartContainer = document.getElementById('cart-container');
  const cartList = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const emptyNotice = document.getElementById('empty-cart');

  const renderCheckout = () => {
    globalRenderCheckout = renderCheckout;
    const cart = getCart();
    if (!cart || cart.length === 0) {
      emptyNotice?.classList.remove('hidden');
      cartList && (cartList.innerHTML = '');
      cartTotalEl && (cartTotalEl.textContent = 'Rp 0');
      return;
    }

    emptyNotice?.classList.add('hidden');
    const itemsHtml = cart.map((entry) => {
      const prod = products.find((p) => p.id === entry.id);
      if (!prod) return '';
      const qty = entry.quantity || 1;
      const subtotal = prod.price * qty;
      return `
        <div class="flex items-center justify-between p-4 bg-card rounded-xl mb-3">
          <div class="flex items-center gap-4">
            <img src="${prod.image}" alt="${prod.name}" class="w-16 h-12 object-cover rounded-md" />
            <div>
              <div class="font-semibold">${prod.name}</div>
              <div class="text-sm text-muted-foreground">${formatPrice(prod.price)} x ${qty}</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="font-semibold">${formatPrice(subtotal)}</div>
            <button data-remove-id="${prod.id}" class="remove-from-cart text-sm text-destructive">Hapus</button>
          </div>
        </div>
      `;
    }).join('');

    if (cartList) cartList.innerHTML = itemsHtml;
    const total = cart.reduce((sum, entry) => {
      const prod = products.find((p) => p.id === entry.id);
      return sum + (prod ? prod.price * (entry.quantity || 1) : 0);
    }, 0);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
  };

  renderCheckout();

  // expose simple clear cart action if present
  const clearBtn = document.getElementById('clear-cart');
  clearBtn?.addEventListener('click', () => {
    saveCart([]);
    renderCheckout();
    updateCartBadge();
  });

  const proceedBtn = document.getElementById('proceed-checkout');
  proceedBtn?.addEventListener('click', () => {
    const cart = getCart();
    if (!cart || cart.length === 0) {
      alert('Keranjang Anda kosong. Tambahkan beberapa item terlebih dahulu.');
      return;
    }
    // simulate order placement
    saveCart([]);
    updateCartBadge();
    // redirect to dashboard or success page
    window.location.href = 'dashboard.html';
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

document.body.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const addButton = target.closest('.add-to-cart-button');
  if (addButton) {
    event.preventDefault();
    const id = Number(addButton.dataset.productId || addButton.dataset.id || addButton.getAttribute('data-id'));
    if (!id) return;
    addProductToCart(id);
    return;
  }

  const removeButton = target.closest('.remove-from-cart');
  if (removeButton) {
    event.preventDefault();
    const id = Number(removeButton.dataset.removeId);
    if (!id) return;
    removeProductFromCart(id);
    if (page === 'checkout' && typeof globalRenderCheckout === 'function') {
      globalRenderCheckout();
    }
    return;
  }
});

updateCartBadge();
