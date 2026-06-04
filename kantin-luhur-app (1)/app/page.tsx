"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Scroll, Award, Truck, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/lib/store"

const features = [
  {
    icon: Package,
    title: "Kemasan Batik",
    description: "Kemasan ramah lingkungan dengan motif batik khas Jawa",
  },
  {
    icon: Scroll,
    title: "Resep Warisan",
    description: "Resep turun-temurun dari dapur tradisional Nusantara",
  },
  {
    icon: Award,
    title: "Kualitas Premium",
    description: "Bahan pilihan terbaik untuk kesehatan anak-anak",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Antar langsung ke kelas dalam 15 menit",
  },
]

export default function LandingPage() {
  const { products } = useStore()
  const featuredProducts = products.filter(p => p.category === "food").slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden batik-pattern">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">Kantin Sekolah Terbaik 2024</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                  Warisan Rasa{" "}
                  <span className="gold-text">di Sekolah</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Nikmati kelezatan masakan tradisional Nusantara di lingkungan sekolah. 
                  Cita rasa autentik dengan pelayanan modern untuk generasi penerus bangsa.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link href="/menu">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Jelajahi Menu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Mulai Memesan
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mt-12">
                  <div>
                    <div className="font-serif text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Siswa Puas</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Menu Pilihan</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-primary">4.9</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 rounded-full batik-border" />
                  <Image
                    src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop"
                    alt="Nasi Campur Tradisional"
                    fill
                    className="object-cover rounded-full p-4"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary kawung-pattern">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                Mengapa Kantin Luhur?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kami berkomitmen menghadirkan pengalaman kuliner terbaik dengan nilai-nilai warisan budaya Jawa
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Menu Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                  Menu Unggulan
                </h2>
                <p className="text-muted-foreground">
                  Pilihan terbaik dari dapur Kantin Luhur
                </p>
              </div>
              <Link href="/menu">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Siap Memesan?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan dapatkan akses ke menu eksklusif serta penawaran spesial untuk anggota premium.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Daftar Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
