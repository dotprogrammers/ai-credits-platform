"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrderFormLimit } from "@/components/trading/order-form-limit"
import { OrderFormMarket } from "@/components/trading/order-form-market"

const PRODUCTS = [
  { id: "openai-gpt4", name: "OpenAI GPT-4", price: 0.042 },
  { id: "anthropic-claude", name: "Anthropic Claude", price: 0.038 },
  { id: "google-gemini", name: "Google Gemini", price: 0.025 },
  { id: "meta-llama", name: "Meta Llama", price: 0.015 },
  { id: "midjourney-v6", name: "Midjourney v6", price: 0.085 },
]

export function OrderForm() {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [product, setProduct] = useState(PRODUCTS[0].id)
  const [orderType, setOrderType] = useState<"limit" | "market">("limit")

  const selectedProduct = PRODUCTS.find((p) => p.id === product)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Place Order</CardTitle>
          <Select value={product} onValueChange={(v) => setProduct(v ?? PRODUCTS[0].id)}>
            <SelectTrigger className="h-7 w-40 text-xs">
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
      </CardHeader>
      <CardContent>
        {/* Buy/Sell Toggle */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setSide("buy")}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
              side === "buy"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
              side === "sell"
                ? "bg-red-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sell
          </button>
        </div>

        {/* Order Type */}
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "limit" | "market")}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="limit" className="flex-1">Limit</TabsTrigger>
            <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
          </TabsList>
          <TabsContent value="limit">
            <OrderFormLimit
              side={side}
              onSubmit={(price, qty) => console.log("Limit order:", { product, price, qty, side })}
            />
          </TabsContent>
          <TabsContent value="market">
            <OrderFormMarket
              side={side}
              onSubmit={(qty) => console.log("Market order:", { product, qty, side })}
              bestPrice={selectedProduct?.price}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
