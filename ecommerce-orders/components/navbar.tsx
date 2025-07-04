"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Package, Home, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { getTotalItems } = useCart()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EcomStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center text-gray-700 hover:text-blue-600">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link href="/admin" className="flex items-center text-gray-700 hover:text-blue-600">
              <Package className="h-4 w-4 mr-1" />
              Admin
            </Link>
            <Link href="/cart" className="flex items-center text-gray-700 hover:text-blue-600 relative">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Cart
              {getTotalItems() > 0 && (
                <Badge className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{getTotalItems()}</Badge>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                <Package className="h-4 w-4 mr-2" />
                Admin
              </Link>
              <Link
                href="/cart"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({getTotalItems()})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
