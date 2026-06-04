"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  LayoutDashboard, Package, History, Settings, LogOut, Crown, 
  MapPin, Clock, CheckCircle, Truck, ChefHat, ShoppingBag,
  Users, Edit, Save, X, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore, VIP_MEMBERS, type Order } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"

const sidebarItems = [
  { id: "overview", name: "Dashboard", icon: LayoutDashboard },
  { id: "tracking", name: "Tracking Menu", icon: MapPin },
  { id: "history", name: "Riwayat Transaksi", icon: History },
  { id: "admin", name: "Admin Panel", icon: Settings, adminOnly: true },
]

const orderStatusSteps = [
  { key: "pending", label: "Dipesan", icon: ShoppingBag },
  { key: "preparing", label: "Diproses", icon: ChefHat },
  { key: "out_for_delivery", label: "Diantar", icon: Truck },
  { key: "delivered", label: "Selesai", icon: CheckCircle },
]

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, logout, orders, updateOrderStatus, products, updateProduct } = useStore()
  
  // Get initial tab from URL query param
  const tabFromUrl = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview")
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [editStock, setEditStock] = useState("")

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl && ["overview", "tracking", "history", "admin"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center batik-pattern">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-primary mb-4">
              Silakan Login
            </h2>
            <p className="text-muted-foreground mb-6">
              Anda perlu login untuk mengakses dashboard
            </p>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Login Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "preparing": return "bg-blue-100 text-blue-800"
      case "out_for_delivery": return "bg-purple-100 text-purple-800"
      case "delivered": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIndex = (status: Order["status"]) => {
    return orderStatusSteps.findIndex(step => step.key === status)
  }

  const userOrders = orders.filter(o => o.customer === user.name)
  const latestOrder = userOrders[0]

  const handleSaveProduct = (productId: number) => {
    updateProduct(productId, {
      price: parseInt(editPrice) || products.find(p => p.id === productId)?.price,
      stock: parseInt(editStock) || products.find(p => p.id === productId)?.stock,
    })
    setEditingProduct(null)
    setEditPrice("")
    setEditStock("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Navigation */}
      <Header />
      
      <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground hidden lg:block">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-serif font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold">Kantin Luhur</h1>
              <p className="text-xs opacity-60">Dashboard</p>
            </div>
          </Link>

          {/* User Info */}
          <div className="mb-8 p-4 bg-sidebar-accent rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-lg">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {user.name}
                  {user.isVIP && <Crown className="w-4 h-4 text-sidebar-primary" />}
                </div>
                <div className="text-xs opacity-60">{user.role}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              if (item.adminOnly && !user.isAdmin) return null
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                    activeTab === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent mt-8 text-sidebar-foreground/80"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto batik-pattern">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">K</span>
              </div>
              <h1 className="font-serif text-lg font-bold text-primary">Kantin Luhur</h1>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Selamat Datang, {user.name}!
                </h2>
                <p className="text-muted-foreground">
                  Kelola pesanan dan pantau aktivitas Anda
                </p>
              </div>

              {/* VIP Card */}
              {user.isVIP && (
                <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-6 h-6 text-accent" />
                        <h3 className="font-serif text-xl font-bold">Premium Member</h3>
                      </div>
                      <p className="text-primary-foreground/80">
                        Status: Premium Member {user.role.includes("Ustadz") && "(Special for Ustadz)"}
                      </p>
                      <p className="text-sm text-primary-foreground/60 mt-1">
                        Diskon 20% untuk semua pembelian
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-accent">20%</div>
                      <div className="text-sm text-primary-foreground/60">Diskon</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{userOrders.length}</div>
                        <div className="text-sm text-muted-foreground">Total Pesanan</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {userOrders.filter(o => o.status === "delivered").length}
                        </div>
                        <div className="text-sm text-muted-foreground">Selesai</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {userOrders.filter(o => o.status !== "delivered").length}
                        </div>
                        <div className="text-sm text-muted-foreground">Dalam Proses</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Pesanan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  {userOrders.length > 0 ? (
                    <div className="space-y-4">
                      {userOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.items.map(i => i.name).join(", ")}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {orderStatusSteps.find(s => s.key === order.status)?.label}
                            </Badge>
                            <div className="text-sm font-medium text-foreground mt-1">
                              {formatPrice(order.total)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Belum ada pesanan
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tracking Tab */}
          {activeTab === "tracking" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Live Tracking</h2>
                <p className="text-muted-foreground">Pantau status pesanan Anda secara real-time</p>
              </div>

              {latestOrder ? (
                <>
                  {/* Status Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif flex items-center justify-between">
                        <span>Pesanan #{latestOrder.id}</span>
                        <Badge className={getStatusColor(latestOrder.status)}>
                          {orderStatusSteps.find(s => s.key === latestOrder.status)?.label}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-8">
                        {orderStatusSteps.map((step, index) => {
                          const currentIndex = getStatusIndex(latestOrder.status)
                          const isCompleted = index <= currentIndex
                          const isCurrent = index === currentIndex

                          return (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                              <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors",
                                isCompleted 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-secondary text-muted-foreground"
                              )}>
                                <step.icon className="w-6 h-6" />
                              </div>
                              <span className={cn(
                                "text-sm font-medium text-center",
                                isCompleted ? "text-foreground" : "text-muted-foreground"
                              )}>
                                {step.label}
                              </span>
                              {index < orderStatusSteps.length - 1 && (
                                <div className={cn(
                                  "absolute h-1 w-full",
                                  isCompleted ? "bg-primary" : "bg-secondary"
                                )} />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Map Placeholder */}
                      <div className="bg-secondary rounded-lg p-8 text-center">
                        <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
                        <h3 className="font-serif font-semibold text-foreground mb-2">
                          {latestOrder.deliveryType === "delivery" 
                            ? "Pesanan sedang diantar" 
                            : "Silakan ambil di kantin"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Estimasi waktu: 10-15 menit
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Detail Pesanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {latestOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{item.name}</div>
                              <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                            </div>
                            <div className="font-medium text-foreground">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif font-semibold text-foreground mb-2">
                      Tidak ada pesanan aktif
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Mulai pesan untuk melacak pesanan Anda
                    </p>
                    <Link href="/menu">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Pesan Sekarang
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Riwayat Transaksi</h2>
                <p className="text-muted-foreground">Semua pesanan yang pernah Anda buat</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pesanan</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Diskon</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.length > 0 ? (
                        userOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                              {order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {orderStatusSteps.find(s => s.key === order.status)?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.discount > 0 ? (
                                <span className="text-green-600">-{order.discount}%</span>
                              ) : "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(order.total)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Belum ada riwayat transaksi
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Tab */}
          {activeTab === "admin" && user.isAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Admin Panel</h2>
                <p className="text-muted-foreground">Kelola pesanan dan produk</p>
              </div>

              <Tabs defaultValue="orders">
                <TabsList>
                  <TabsTrigger value="orders">Kelola Pesanan</TabsTrigger>
                  <TabsTrigger value="products">Kelola Produk</TabsTrigger>
                  <TabsTrigger value="vip">Member VIP</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Manage Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {order.customer}
                                  {VIP_MEMBERS.some(m => m.name === order.customer) && (
                                    <Crown className="w-4 h-4 text-accent" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value: Order["status"]) => 
                                    updateOrderStatus(order.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatPrice(order.total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Product Management</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="relative w-10 h-10 rounded overflow-hidden">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                  </div>
                                  <span className="font-medium">{product.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">{product.category}</TableCell>
                              <TableCell>
                                {editingProduct === product.id ? (
                                  <Input
                                    type="number"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    className="w-24"
                                    placeholder={String(product.price)}
                                  />
                                ) : (
                                  formatPrice(product.price)
                                )}
                              </TableCell>
                              <TableCell>
                                {editingProduct === product.id ? (
                                  <Input
                                    type="number"
                                    value={editStock}
                                    onChange={(e) => setEditStock(e.target.value)}
                                    className="w-20"
                                    placeholder={String(product.stock)}
                                  />
                                ) : (
                                  product.stock
                                )}
                              </TableCell>
                              <TableCell>
                                {editingProduct === product.id ? (
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleSaveProduct(product.id)}
                                      className="bg-primary text-primary-foreground"
                                    >
                                      <Save className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => setEditingProduct(null)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setEditingProduct(product.id)
                                      setEditPrice(String(product.price))
                                      setEditStock(String(product.stock))
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vip" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif flex items-center gap-2">
                        <Crown className="w-5 h-5 text-accent" />
                        Member VIP (Diskon 20%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {VIP_MEMBERS.map((member) => (
                          <div 
                            key={member.id} 
                            className="p-4 bg-secondary rounded-lg flex items-center gap-4"
                          >
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                              <span className="text-accent font-bold text-lg">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.role}</div>
                              <Badge className="mt-1 bg-accent/20 text-accent border-0">
                                -{member.discount}% Discount
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  )
}
