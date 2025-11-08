'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { auth, googleProvider } from '../lib/firebase'
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
  Home,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ChevronDown,
  Sparkles,
  Link2,
  FileText,
  Mail,
  Download,
  BookOpen,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // 🆕 Add mobile menu state
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const login = async () => {
    setIsLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Successfully signed in!')
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
      toast.success('Successfully signed out!')
      setIsMobileMenuOpen(false) // 🆕 Close mobile menu on logout
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isActiveLink = (path: string) => {
    return pathname === path
  }

  // 🆕 Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
    const linkClass = (path: string) => `
      relative flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm
      transition-all duration-200 ease-in-out group
      ${isMobile ? 'w-full justify-start' : ''}
      ${isActiveLink(path) 
        ? 'text-cyan-400 bg-cyan-500/10' 
        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
      }
    `

    // 🆕 Create a wrapper component for mobile links that closes the menu
    const MobileLink = ({ href, children, className }: { href: string, children: React.ReactNode, className: string }) => {
      if (isMobile) {
        return (
          <Link 
            href={href} 
            className={className}
            onClick={closeMobileMenu} // 🆕 Close menu on click
          >
            {children}
          </Link>
        )
      }
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      )
    }

    return (
      <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-2'}`}>
        <MobileLink href="/" className={linkClass('/')}>
          <Home className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
          <span>Home</span>
        </MobileLink>

        {user && (
          <>
            <MobileLink href="/link" className={linkClass('/link')}>
              <Link2 className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/link') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Link Scanner</span>
            </MobileLink>
            <MobileLink href="/doc" className={linkClass('/doc')}>
              <FileText className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/doc') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Doc Scanner</span>
            </MobileLink>
            <MobileLink href="/email" className={linkClass('/email')}>
              <Mail className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/email') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Email Scanner</span>
            </MobileLink>
            <MobileLink href="/install" className={linkClass('/install')}>
              <Download className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/install') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Install</span>
            </MobileLink>
           
            <MobileLink href="/report" className={linkClass('/report')}>
              <ShieldCheck className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/report') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Report</span>
            </MobileLink>
            <MobileLink href="/dashboard" className={linkClass('/dashboard')}>
              <LayoutDashboard className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/dashboard') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Dashboard</span>
            </MobileLink>
            <MobileLink href="/awareness" className={linkClass('/awareness')}>
              <BookOpen className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/awareness') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Awareness Hub</span>
            </MobileLink>
            <MobileLink href="/chat" className={linkClass('/chat')}>
              <MessageCircle className={`w-4 h-4 transition-transform duration-200 ${isActiveLink('/chat') ? 'text-cyan-400' : 'group-hover:scale-105'}`} />
              <span>Chat Support</span>
            </MobileLink>
          </>
        )}
      </div>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      
      <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo Section - New Design */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="group flex items-center space-x-3 py-2 px-3 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-cyan-500/30"
            >
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl md:text-2xl font-black bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:via-white group-hover:to-cyan-200 transition-all duration-300">
                  PhishGuard
                </div>
                <div className="text-xs text-cyan-400/70 font-medium tracking-wider">SECURITY SHIELD</div>
              </div>
            </Link>
            
            {/* Desktop Navigation - Inline */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLinks />
            </div>
          </div>

          {/* Right Section - User & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* User Section - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 group border border-slate-700/50 hover:border-cyan-500/50 backdrop-blur-sm"
                    >
                      <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all duration-300 relative group-hover:scale-105 bg-gradient-to-br from-cyan-500 to-blue-600">
                        <Image
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                          alt={user.displayName || 'Profile'}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-white truncate max-w-32">{user.displayName || 'User'}</p>
                        <p className="text-xs text-cyan-400/70 truncate max-w-32">{user.email}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-cyan-400 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-6 py-5 border-b border-slate-700/50">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500 to-blue-600">
                              <Image
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                                alt={user.displayName || 'Profile'}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-white truncate">{user.displayName}</p>
                              <p className="text-sm text-cyan-400/70 truncate">{user.email}</p>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-xs text-green-400 font-medium">Active</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="py-3">
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              window.location.href = '/settings'
                            }}
                            className="w-full flex items-center gap-4 px-6 py-4 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-200">
                              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold">Settings</p>
                              <p className="text-xs text-slate-500">Manage your account</p>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              logout()
                            }}
                            disabled={isLoading}
                            className="w-full flex items-center gap-4 px-6 py-4 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-200">
                              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold">{isLoading ? 'Signing out...' : 'Sign out'}</p>
                              <p className="text-xs text-slate-500">Exit your session</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={login}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 px-8 py-3 rounded-2xl font-semibold disabled:opacity-50 group text-sm"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  ) : (
                    <LogIn className="w-5 h-5 mr-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                  )}
                  <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}> {/* 🆕 Control open state */}
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-slate-800/60 hover:text-cyan-400 transition-all duration-300 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 w-12 h-12 backdrop-blur-sm"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-cyan-500/20 w-80 md:w-96 flex flex-col h-full">
                  <SheetHeader className="border-b border-slate-700/50 pb-4 flex-shrink-0">
                    <SheetTitle className="flex items-center gap-3 text-lg">
                      <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                          <Sparkles className="w-2 h-2 text-white animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-black bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                          PhishGuard
                        </div>
                        <div className="text-xs text-cyan-400/70 font-medium tracking-wider text-left">SECURITY SHIELD</div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 flex flex-col mt-4 space-y-6 pb-4 overflow-y-auto">
                    {/* User Info - Mobile */}
                    {user && (
                      <div className="flex items-center space-x-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30 backdrop-blur-sm flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400/50 relative bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0">
                          <Image
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                            alt={user.displayName || 'Profile'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                          <p className="text-xs text-cyan-400/70 truncate">{user.email}</p>
                          <div className="flex items-center mt-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-xs text-green-400 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Links - Mobile */}
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Navigation</h3>
                      <div className="space-y-1">
                        <NavLinks isMobile={true} />
                      </div>
                    </div>

                    {/* Account Actions - Mobile (Fixed at bottom) */}
                    <div className="border-t border-slate-700/50 pt-4 flex-shrink-0 space-y-3">
                      {!user ? (
                        <Button 
                          onClick={() => {
                            login()
                            closeMobileMenu() // 🆕 Close menu after login attempt
                          }}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg text-sm"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          ) : (
                            <LogIn className="w-5 h-5 mr-2" />
                          )}
                          <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Account</h3>
                          
                          {/* Settings Button */}
                          <button
                            onClick={() => {
                              window.location.href = '/settings'
                              closeMobileMenu() // 🆕 Close menu when navigating to settings
                            }}
                            className="w-full flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 text-sm font-medium transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-200 flex-shrink-0">
                              <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-semibold">Settings</p>
                              <p className="text-xs text-slate-500">Manage account</p>
                            </div>
                          </button>
                          
                          {/* Sign Out Button */}
                          <button
                            onClick={logout} // 🆕 logout function already closes menu
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 p-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 shadow-lg group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-800/50 flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-200 flex-shrink-0">
                              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="font-semibold">{isLoading ? 'Signing out...' : 'Sign Out'}</p>
                              <p className="text-xs text-red-400/70">Exit session</p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}