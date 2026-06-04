"use client"

import { useState } from "react"
import { Search, Filter, UtensilsCrossed, Coffee, Pencil, Shirt } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useStore, type Product } from "@/lib/store"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "Semua", icon: Filter },
  { id: "food", name: "Makanan", icon: UtensilsCrossed },
  { id: "drinks", name: "Minuman", icon: Coffee },
  { id: "stationery", name: "Alat Tulis", icon: Pencil },
  { id: "uniforms", name: "Seragam", icon: Shirt },
]

export default function MenuPage() {
  const { products } = useStore()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return products.length
    return products.filter(p => p.category === categoryId).length
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 batik-pattern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
              Eksplorasi Menu
            </h1>
            <p className="text-muted-foreground">
              Temukan cita rasa Nusantara favorit Anda
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-serif font-semibold text-lg text-foreground mb-4">
                  Kategori
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge 
                        variant={selectedCategory === category.id ? "secondary" : "outline"}
                        className={cn(
                          selectedCategory === category.id && "bg-primary-foreground text-primary"
                        )}
                      >
                        {getCategoryCount(category.id)}
                      </Badge>
                    </button>
                  ))}
                </div>

                {/* Price Range Info */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium text-foreground mb-2">Rentang Harga</h3>
                  <p className="text-sm text-muted-foreground">
                    Rp 3.000 - Rp 150.000
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari menu favorit Anda..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Menampilkan <span className="font-semibold text-foreground">{filteredProducts.length}</span> produk
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-border">
                    Terbaru
                  </Button>
                  <Button variant="outline" size="sm" className="border-border">
                    Terlaris
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2">
                    Tidak ada hasil
                  </h3>
                  <p className="text-muted-foreground">
                    Coba kata kunci lain atau ubah filter kategori
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
