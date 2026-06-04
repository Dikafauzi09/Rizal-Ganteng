"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// VIP Members with 20% discount
export const VIP_MEMBERS = [
  { id: 1, name: "Ustadz Ahmad", role: "Guru Agama", discount: 20 },
  { id: 2, name: "Rivan", role: "Siswa Kelas 12", discount: 20 },
  { id: 3, name: "Hasan", role: "Siswa Kelas 11", discount: 20 },
  { id: 4, name: "Fauzi", role: "Staff TU", discount: 20 },
  { id: 5, name: "Ilham", role: "Siswa Kelas 10", discount: 20 },
]

export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: "food" | "drinks" | "stationery" | "uniforms"
  rating: number
  description: string
  stock: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  customer: string
  items: CartItem[]
  status: "pending" | "preparing" | "out_for_delivery" | "delivered"
  total: number
  deliveryType: "delivery" | "queue"
  isPeakHour: boolean
  discount: number
  createdAt: Date
}

export interface User {
  id: number
  name: string
  email: string
  isVIP: boolean
  role: string
  isAdmin: boolean
}

interface StoreContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  products: Product[]
  updateProduct: (productId: number, updates: Partial<Product>) => void
  isPeakHour: boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Nasi Bakar Ayam",
    price: 25000,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.8,
    description: "Nasi bakar dengan ayam suwir bumbu rempah Jawa",
    stock: 50,
  },
  {
    id: 2,
    name: "Jamu Kunyit Asam",
    price: 8000,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
    category: "drinks",
    rating: 4.5,
    description: "Jamu tradisional kunyit asam segar",
    stock: 100,
  },
  {
    id: 3,
    name: "Sate Taichan",
    price: 20000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.7,
    description: "Sate ayam dengan sambal pedas khas",
    stock: 40,
  },
  {
    id: 4,
    name: "Rendang Sapi",
    price: 35000,
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.9,
    description: "Rendang daging sapi masakan Padang",
    stock: 30,
  },
  {
    id: 5,
    name: "Es Teh Manis",
    price: 5000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    category: "drinks",
    rating: 4.3,
    description: "Teh manis dingin menyegarkan",
    stock: 200,
  },
  {
    id: 6,
    name: "Bakso Malang",
    price: 18000,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.6,
    description: "Bakso dengan mie dan pangsit goreng",
    stock: 45,
  },
  {
    id: 7,
    name: "Buku Tulis",
    price: 5000,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop",
    category: "stationery",
    rating: 4.0,
    description: "Buku tulis 40 lembar",
    stock: 300,
  },
  {
    id: 8,
    name: "Seragam Batik",
    price: 150000,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop",
    category: "uniforms",
    rating: 4.8,
    description: "Seragam batik sekolah premium",
    stock: 20,
  },
  {
    id: 9,
    name: "Wedang Jahe",
    price: 7000,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
    category: "drinks",
    rating: 4.4,
    description: "Minuman jahe hangat tradisional",
    stock: 80,
  },
  {
    id: 10,
    name: "Nasi Gudeg",
    price: 28000,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
    category: "food",
    rating: 4.7,
    description: "Gudeg Jogja dengan ayam dan telur",
    stock: 35,
  },
  {
    id: 11,
    name: "Pensil 2B",
    price: 3000,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop",
    category: "stationery",
    rating: 4.2,
    description: "Pensil 2B untuk ujian",
    stock: 500,
  },
  {
    id: 12,
    name: "Dasi Sekolah",
    price: 25000,
    image: "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400&h=300&fit=crop",
    category: "uniforms",
    rating: 4.5,
    description: "Dasi seragam sekolah",
    stock: 60,
  },
]

const DEMO_ORDERS: Order[] = [
  {
    id: "KL-001",
    customer: "Ustadz Ahmad",
    items: [{ ...INITIAL_PRODUCTS[0], quantity: 2 }],
    status: "pending",
    total: 40000,
    deliveryType: "delivery",
    isPeakHour: true,
    discount: 20,
    createdAt: new Date(),
  },
  {
    id: "KL-002",
    customer: "Rivan",
    items: [{ ...INITIAL_PRODUCTS[2], quantity: 1 }],
    status: "preparing",
    total: 16000,
    deliveryType: "queue",
    isPeakHour: false,
    discount: 20,
    createdAt: new Date(),
  },
  {
    id: "KL-003",
    customer: "Budi Santoso",
    items: [{ ...INITIAL_PRODUCTS[3], quantity: 1 }],
    status: "out_for_delivery",
    total: 35000,
    deliveryType: "delivery",
    isPeakHour: false,
    discount: 0,
    createdAt: new Date(),
  },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)

  // Check if current hour is peak hour (11:00-13:00 or 17:00-19:00)
  const currentHour = new Date().getHours()
  const isPeakHour = (currentHour >= 11 && currentHour < 13) || (currentHour >= 17 && currentHour < 19)

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => setCart([])

  const login = (email: string, password: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim()

    // Demo login - check VIP members first
    const vipMember = VIP_MEMBERS.find(
      (m) => `${m.name.toLowerCase().replace(/\s+/g, ".")}@kantinluhur.id` === normalizedEmail
    )

    if (vipMember && password === "demo123") {
      setUser({
        id: vipMember.id,
        name: vipMember.name,
        email: normalizedEmail,
        isVIP: true,
        role: vipMember.role,
        isAdmin: vipMember.name === "Ustadz Ahmad",
      })
      return true
    }

    if (normalizedEmail === "admin@kantinluhur.id" && password === "demo123") {
      setUser({
        id: 0,
        name: "Admin Kantin",
        email: normalizedEmail,
        isVIP: false,
        role: "Admin",
        isAdmin: true,
      })
      return true
    }

    if (normalizedEmail.endsWith("@kantinluhur.id") && password === "demo123") {
      setUser({
        id: 100,
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        isVIP: false,
        role: "Siswa",
        isAdmin: false,
      })
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setCart([])
  }

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    )
  }

  const updateProduct = (productId: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    )
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        user,
        login,
        logout,
        orders,
        addOrder,
        updateOrderStatus,
        products,
        updateProduct,
        isPeakHour,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
