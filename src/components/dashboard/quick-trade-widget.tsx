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
import { ArrowLeftRight } from "lucide-react"

const PRODUCTS = [
  { id: "openai-gpt4", name: "OpenAI GPT-4", price: 0.042 },
  { id: "anthropic-claude", name: "Anthropic Claude", price: 0.038 },
  { id: "google-gemini", name: "Google Gemini", price: 0.025 },
  { id: "meta-llama", name: "Meta Llama", price: 0.015 },
  { id: "midjourney-v6", name: "Midjourney v6", price: 0.085 },
]

export function QuickTradeWidget() {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [product, setProduct] = useState(PRODUCTS[0].id)
  const [quantity, setQuantity] = useState("")
  const [total, setTotal] = useState("")

  const selectedProduct = PRODUCTS.find((p) => p.id === product)

  const handleQuantityChange = (val: string) => {
    setQuantity(val)
    if (selectedProduct && val) {
      setTotal((parseFloat(val) * selectedProduct.price).toFixed(2))
    } else {
      setTotal("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="size-4" />
          Quick Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                      {p.name} — ${p.price.toFixed(4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Credits</Label>
              <Input
                type="number"
                placeholder="Amount of credits"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total (USD)</Label>
              <Input
                type="text"
                placeholder="$0.00"
                value={total ? `$${total}` : ""}
                readOnly
              />
            </div>
            <Button
              className="w-full"
              variant={side === "buy" ? "default" : "destructive"}
              size="lg"
            >
              {side === "buy" ? "Buy" : "Sell"} {selectedProduct?.name}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
