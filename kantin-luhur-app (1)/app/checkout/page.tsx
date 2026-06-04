"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Minus, Plus, Trash2, ShoppingBag, Clock, Truck, 
  Users, AlertTriangle, ArrowLeft, Crown, CheckCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const DELIVERY_FEE = 5000
const PEAK_HOUR_FEE = 2000

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, user, removeFromCart, updateQuantity, clearCart, addOrder, isPeakHour } = useStore()
  const [deliveryType, setDeliveryType] = useState<"delivery" | "queue">("delivery")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountPercent = user?.isVIP ? 20 : 0
  const discountAmount = (subtotal * discountPercent) / 100
  const deliveryFee = deliveryType === "delivery" ? DELIVERY_FEE : 0
  const peakHourFee = isPeakHour && deliveryType === "queue" ? PEAK_HOUR_FEE : 0
  const total = subtotal - discountAmount + deliveryFee + peakHourFee

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create order
    const order = {
      id: `KL-${String(Date.now()).slice(-6)}`,
      customer: user.name,
      items: cart,
      status: "pending" as const,
      total,
      deliveryType,
      isPeakHour,
      discount: discountPercent,
      createdAt: new Date(),
    }

    addOrder(order)
    clearCart()
    setIsProcessing(false)
    setOrderSuccess(true)
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center batik-pattern">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-primary mb-4">
              Pesanan Berhasil!
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Terima kasih atas pesanan Anda. Silakan pantau status pesanan di dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Lihat Pesanan
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" className="border-primary text-primary">
                  Pesan Lagi
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center batik-pattern">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary mb-4">
              Keranjang Kosong
            </h1>
            <p className="text-muted-foreground mb-8">
              Belum ada item di keranjang Anda
            </p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Jelajahi Menu
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 batik-pattern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/menu" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Menu
          </Link>

          <h1 className="font-serif text-3xl font-bold text-primary mb-8">
            Checkout
          </h1>

          {/* Peak Hour Alert */}
          {isPeakHour && (
            <div className="mb-6 p-4 bg-accent/20 border border-accent rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">Jam Padat Aktif</h3>
                <p className="text-sm text-muted-foreground">
                  Biaya Jam Padat: +{formatPrice(PEAK_HOUR_FEE)} (Otomatis untuk Booking Online)
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl bg-card p-6 border border-border">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">Produk yang Akan Dibayar</h2>
                <p className="text-sm text-muted-foreground">Lihat detail dan tampilan produk yang ada di checkout.</p>
              </div>

              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <p className="font-bold text-primary">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Delivery Type Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Metode Pengambilan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDeliveryType("delivery")}
                      className={cn(
                        "flex-1 p-4 rounded-lg border-2 transition-all",
                        deliveryType === "delivery"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Truck className={cn(
                        "w-8 h-8 mx-auto mb-2",
                        deliveryType === "delivery" ? "text-primary" : "text-muted-foreground"
                      )} />
                      <div className="font-medium text-foreground">Pesan Antar</div>
                      <div className="text-sm text-muted-foreground">Delivery</div>
                      <div className="text-sm font-medium text-accent mt-2">
                        +{formatPrice(DELIVERY_FEE)}
                      </div>
                    </button>
                    <button
                      onClick={() => setDeliveryType("queue")}
                      className={cn(
                        "flex-1 p-4 rounded-lg border-2 transition-all",
                        deliveryType === "queue"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Users className={cn(
                        "w-8 h-8 mx-auto mb-2",
                        deliveryType === "queue" ? "text-primary" : "text-muted-foreground"
                      )} />
                      <div className="font-medium text-foreground">Booking Antrean</div>
                      <div className="text-sm text-muted-foreground">Queue</div>
                      <div className="text-sm font-medium text-green-600 mt-2">
                        Gratis
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* VIP Badge */}
                  {user?.isVIP && (
                    <div className="p-3 bg-accent/20 rounded-lg flex items-center gap-2">
                      <Crown className="w-5 h-5 text-accent" />
                      <div>
                        <div className="font-medium text-sm text-foreground">Member VIP</div>
                        <div className="text-xs text-muted-foreground">Diskon 20% aktif</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatPrice(subtotal)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Membership Discount ({discountPercent}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    {deliveryType === "delivery" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biaya Pengiriman</span>
                        <span className="text-foreground">{formatPrice(deliveryFee)}</span>
                      </div>
                    )}

                    {peakHourFee > 0 && (
                      <div className="flex justify-between text-accent">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Biaya Jam Padat
                        </span>
                        <span>+{formatPrice(peakHourFee)}</span>
                      </div>
                    )}

                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Memproses..." : user ? "Bayar Sekarang" : "Login untuk Checkout"}
                  </Button>

                  {!user && (
                    <p className="text-xs text-center text-muted-foreground">
                      Anda perlu login untuk melanjutkan checkout
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
