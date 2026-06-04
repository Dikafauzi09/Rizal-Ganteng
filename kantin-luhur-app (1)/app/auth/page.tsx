"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useStore, VIP_MEMBERS } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function AuthPage() {
  const router = useRouter()
  const { login, user } = useStore()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // Redirect if already logged in
  if (user) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      const success = login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Email atau password salah. Gunakan password: demo123")
      }
    } else {
      // For demo, just log in with the registered info
      const success = login(email, "demo123")
      if (success) {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen flex batik-pattern">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 kawung-pattern opacity-10" />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto mb-8">
            <span className="text-accent-foreground font-serif font-bold text-4xl">K</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-primary-foreground mb-4">
            Kantin Luhur
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Sugeng Rawuh. Selamat datang di sistem pemesanan Kantin Luhur, 
            warisan cita rasa Nusantara di lingkungan sekolah.
          </p>

          {/* VIP Members Preview */}
          <div className="mt-12 bg-primary-foreground/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-serif font-semibold text-primary-foreground mb-4">
              Anggota VIP (Diskon 20%)
            </h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              {VIP_MEMBERS.map((member) => (
                <div key={member.id} className="flex justify-between">
                  <span>{member.name}</span>
                  <span className="opacity-60">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            href="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>

          {/* Form Card */}
          <div className="bg-card rounded-xl p-8 shadow-lg batik-border">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin 
                  ? "Sugeng Rawuh. Masuk untuk memesan boga Jawi."
                  : "Bergabung dan nikmati layanan eksklusif kami."}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                  isLogin 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Masuk
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                  !isLogin 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Daftar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="text-foreground">Nama Lengkap</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kantinluhur.id"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}

              {email && (
                <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
                  {email.toLowerCase().trim() === "admin@kantinluhur.id" ? (
                    <p>Masuk sebagai <strong>Admin</strong>. Panel admin akan muncul setelah berhasil login.</p>
                  ) : VIP_MEMBERS.some(
                    (member) => `${member.name.toLowerCase().replace(/\s+/g, ".")}@kantinluhur.id` === email.toLowerCase().trim()) ? (
                    <p>Masuk sebagai <strong>VIP / Guru</strong>. Anda akan mendapatkan diskon 20%.</p>
                  ) : email.toLowerCase().trim().endsWith("@kantinluhur.id") ? (
                    <p>Masuk sebagai <strong>Siswa</strong>. Anda dapat memesan menu dan melihat dashboard.</p>
                  ) : (
                    <p>Gunakan email <strong>@kantinluhur.id</strong> untuk demo login siswa atau admin.</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLogin ? "Masuk" : "Daftar"}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 grid gap-3">
              <div className="p-4 bg-secondary rounded-lg text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">Contoh akun demo</p>
                <p>Admin: <strong>admin@kantinluhur.id</strong> / <strong>demo123</strong></p>
                <p>VIP Guru: <strong>ustadz.ahmad@kantinluhur.id</strong> / <strong>demo123</strong></p>
                <p>Siswa: <strong>nama.siswa@kantinluhur.id</strong> / <strong>demo123</strong></p>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-sm text-muted-foreground">
                Akun admin akan melihat akses khusus di dashboard. Siswa akan masuk sebagai pengguna biasa dengan hak memesan menu.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
