import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-serif font-bold text-lg">K</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Kantin Luhur</h3>
                <p className="text-xs opacity-80">Warisan Rasa di Sekolah</p>
              </div>
            </div>
            <p className="text-sm opacity-80 max-w-md">
              Menyajikan cita rasa nusantara dengan sentuhan modern untuk generasi penerus bangsa.
              Kantin Luhur hadir sebagai warisan kuliner Jawa di lingkungan sekolah.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/" className="hover:opacity-100 transition-opacity">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:opacity-100 transition-opacity">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:opacity-100 transition-opacity">
                  Keranjang
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:opacity-100 transition-opacity">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jl. Pendidikan No. 123, Yogyakarta</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(0274) 123-456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@kantinluhur.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} Kantin Luhur. Hak Cipta Dilindungi.</p>
          <p className="mt-1">Dengan Cinta dari Nusantara 🇮🇩</p>
        </div>
      </div>
    </footer>
  )
}
