"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"

const PRODUCTS = [
  { id: "openai-gpt4", name: "OpenAI GPT-4", buyPrice: 0.043, sellPrice: 0.041 },
  { id: "anthropic-claude", name: "Anthropic Claude", buyPrice: 0.039, sellPrice: 0.037 },
  { id: "google-gemini", name: "Google Gemini", buyPrice: 0.026, sellPrice: 0.024 },
  { id: "meta-llama", name: "Meta Llama", buyPrice: 0.016, sellPrice: 0.014 },
  { id: "midjourney-v6", name: "Midjourney v6", buyPrice: 0.087, sellPrice: 0.083 },
]

export function InstantTradeForm() {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [product, setProduct] = useState(PRODUCTS[0].id)
  const [quantity, setQuantity] = useState("")

  const selectedProduct = PRODUCTS.find((p) => p.id === product)
  const price = side === "buy" ? selectedProduct?.buyPrice : selectedProduct?.sellPrice
  const total = price && quantity ? (parseFloat(quantity) * price).toFixed(2) : "0.00"

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5" />
          Instant Trade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="buy" onValueChange={(v) => setSide(v as "buy" | "sell")}>
          <TabsList className="w-full">
            <TabsTrigger value="buy" className="flex-1">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="flex-1">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value={side} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={product} onValueChange={(v) => setProduct(v ?? PRODUCTS[0].id)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {side === "buy" ? "Buy Price" : "Sell Price"}
                </span>
                <span className="font-mono font-bold">
                  ${price?.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quantity (Credits)</Label>
              <Input
                type="number"
                placeholder="Enter credit amount"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold font-mono">${total}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!quantity}
            >
              {side === "buy" ? "Buy" : "Sell"} Instantly
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
