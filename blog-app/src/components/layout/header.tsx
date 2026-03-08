'use client'

import Link from "next/link"
import { Button } from "../ui/button"
import { useSession } from "@/lib/auth-client"
import UserMenu from "../auth/user-menu"
import ThemeToggle from "../theme/theme-toggle"
import { Search, Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { toast } from "sonner"

const Header = () => {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [router])

  const navItems = [
    { label: "Home", href: '/' },
    { label: "Create Post", href: '/post/create' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsMobileMenuOpen(false)
    }
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully!')
            setIsMobileMenuOpen(false)
            router.refresh()
          }
        }
      })
    } catch (e) {
      toast.error('Failed to log out!')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href='/' className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          BlogApp
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-4 py-2 pr-10 rounded-full border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 h-8 w-8 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {!isPending && (
            session?.user ? (
              <div className="hidden md:block">
                <UserMenu user={session.user} />
              </div>
            ) : (
              <Button
                className="hidden md:inline-flex bg-primary"
                onClick={() => router.push('/auth')}
              >
                Login
              </Button>
            )
          )}
        </div>
      </div>

      <div
        className={`
          fixed inset-x-0 top-16 z-50 md:hidden
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }
        `}
      >
        <div className="bg-background border-b shadow-xl">
          <div className="container mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="flex items-center relative mb-6">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-full border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-2 h-9 w-9 rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <nav className="flex flex-col space-y-3">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-lg font-medium rounded-lg hover:bg-muted transition-colors border border-border"
                  onClick={handleLinkClick}
                >
                  {item.label}
                </Link>
              ))}
              
              {session?.user && (
                <Link
                  href="/profile"
                  className="px-4 py-3 text-lg font-medium rounded-lg hover:bg-muted transition-colors border border-border"
                  onClick={handleLinkClick}
                >
                  Profile
                </Link>
              )}
              
              {!isPending && (
                <div className="pt-4 mt-2 border-t border-border">
                  {session?.user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-3 bg-muted rounded-lg border border-border">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                      
                      <Button
                        className="w-full gap-2"
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        router.push('/auth')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Login / Register
                    </Button>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header