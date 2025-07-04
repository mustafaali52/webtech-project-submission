"use client"

import { useState } from "react"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/types/product"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      addToCart(product)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
          {product.featured && <Badge className="absolute top-2 left-2 bg-blue-600">Featured</Badge>}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
          )}
          {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-500 ml-2">(4.5)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            <Badge variant="outline">{product.category}</Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} disabled={product.stock === 0 || isLoading} className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Out of Stock" : isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
