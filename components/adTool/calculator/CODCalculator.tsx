"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Info,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import DonutChart, { type ChartDataItem } from "./DonutChart";

type ExtraChargeType = {
  id: string;
  label: string;
  amount: number;
  type: "flat" | "percentage";
  application: "perOrder" | "total";
};

const PRESET_CHARGES = [
  {
    label: "Shipping Cost",
    type: "percentage" as const,
    amount: 5,
    application: "perOrder" as const,
  },
  {
    label: "Fulfillment Fee",
    type: "percentage" as const,
    amount: 3,
    application: "perOrder" as const,
  },
  {
    label: "COD Fee",
    type: "percentage" as const,
    amount: 2,
    application: "perOrder" as const,
  },
  {
    label: "Packaging Cost",
    type: "flat" as const,
    amount: 2,
    application: "perOrder" as const,
  },
  {
    label: "Platform Fee",
    type: "percentage" as const,
    amount: 5,
    application: "total" as const,
  },
  {
    label: "Payment Gateway Fee",
    type: "percentage" as const,
    amount: 2.5,
    application: "total" as const,
  },
  {
    label: "Marketing Cost",
    type: "flat" as const,
    amount: 50,
    application: "total" as const,
  },
  {
    label: "Storage Fee",
    type: "flat" as const,
    amount: 10,
    application: "total" as const,
  },
];

const STORAGE_KEY = "cod-calculator-data";

const CODCalculator: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [confirmationRate, setConfirmationRate] = useState([100]);
  const [deliveryRate, setDeliveryRate] = useState([100]);
  const [extraCharges, setExtraCharges] = useState<ExtraChargeType[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setQuantity(data.quantity ?? 1);
        setCostPrice(data.costPrice ?? 0);
        setSellingPrice(data.sellingPrice ?? 0);
        setConfirmationRate(data.confirmationRate ?? [100]);
        setDeliveryRate(data.deliveryRate ?? [100]);
        setExtraCharges(data.extraCharges ?? []);
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      quantity,
      costPrice,
      sellingPrice,
      confirmationRate,
      deliveryRate,
      extraCharges,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    quantity,
    costPrice,
    sellingPrice,
    confirmationRate,
    deliveryRate,
    extraCharges,
  ]);

  const confirmedOrders = quantity * (confirmationRate[0] / 100);
  const deliveredOrders = confirmedOrders * (deliveryRate[0] / 100);

  const totalCost = costPrice * confirmedOrders;
  const totalRevenue = sellingPrice * deliveredOrders;

  const totalExtraCharges = extraCharges.reduce((total, charge) => {
    if (charge.type === "flat") {
      return (
        total +
        (charge.application === "perOrder"
          ? charge.amount * confirmedOrders
          : charge.amount)
      );
    }
    const base =
      charge.application === "perOrder"
        ? sellingPrice * confirmedOrders
        : totalRevenue;
    return total + (charge.amount / 100) * base;
  }, 0);

  const netProfit = totalRevenue - totalCost - totalExtraCharges;

  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const chartData: ChartDataItem[] = [
    { name: "Product Cost", value: totalCost, color: "#FF6B6B", icon: Package },
    {
      name: "Extra Charges",
      value: totalExtraCharges,
      color: "#4ECDC4",
      icon: Truck,
    },
    {
      name: "Net Profit",
      value: Math.max(0, netProfit),
      color: "#45B7D1",
      icon: Wallet,
    },
  ];

  const addExtraCharge = () => {
    setExtraCharges([
      ...extraCharges,
      {
        id: `charge-${Date.now()}`,
        label: "",
        amount: 0,
        type: "flat",
        application: "perOrder",
      },
    ]);
  };

  const addPresetCharge = (preset: (typeof PRESET_CHARGES)[0]) => {
    setExtraCharges([
      ...extraCharges,
      {
        id: `charge-${Date.now()}`,
        ...preset,
      },
    ]);
    setShowPresets(false);
  };

  const updateExtraCharge = (id: string, updates: Partial<ExtraChargeType>) => {
    setExtraCharges(
      extraCharges.map((charge) =>
        charge.id === id ? { ...charge, ...updates } : charge,
      ),
    );
  };

  const removeExtraCharge = (id: string) => {
    setExtraCharges(extraCharges.filter((charge) => charge.id !== id));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-[#6566F1]" />
              COD Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  min={1}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cost Price ($)</Label>
                <Input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selling Price ($)</Label>
                <Input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Confirmation Rate: {confirmationRate[0].toFixed(1)}%
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={confirmationRate}
                  onValueChange={setConfirmationRate}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={confirmationRate[0]}
                  onChange={(e) =>
                    setConfirmationRate([
                      Math.max(0, Math.min(100, Number(e.target.value))),
                    ])
                  }
                  className="h-9 w-20 text-sm"
                  step={0.1}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Delivery Rate: {deliveryRate[0].toFixed(1)}%
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={deliveryRate}
                  onValueChange={setDeliveryRate}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={deliveryRate[0]}
                  onChange={(e) =>
                    setDeliveryRate([
                      Math.max(0, Math.min(100, Number(e.target.value))),
                    ])
                  }
                  className="h-9 w-20 text-sm"
                  step={0.1}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Extra Charges</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPresets(!showPresets)}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Sparkles size={14} className="mr-1.5" />
                    Presets
                  </Button>
                  <Button
                    onClick={addExtraCharge}
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                  >
                    <Plus size={14} className="mr-1.5" />
                    Custom
                  </Button>
                </div>
              </div>

              {showPresets && (
                <div className="space-y-1.5 rounded-lg border bg-gray-50/50 p-2 dark:bg-gray-900/30">
                  {PRESET_CHARGES.map((preset, idx) => (
                    <Button
                      key={idx}
                      onClick={() => addPresetCharge(preset)}
                      variant="ghost"
                      className="h-8 w-full justify-start text-left text-xs"
                      size="sm"
                    >
                      {preset.label} ({preset.amount}
                      {preset.type === "percentage" ? "%" : "$"})
                    </Button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {extraCharges.map((charge) => (
                  <div
                    key={charge.id}
                    className="flex items-center gap-2 rounded-lg border bg-white p-2 dark:bg-gray-900"
                  >
                    <Input
                      placeholder="Label"
                      value={charge.label}
                      onChange={(e) =>
                        updateExtraCharge(charge.id, { label: e.target.value })
                      }
                      className="h-9 flex-1 text-sm"
                    />
                    <Input
                      type="number"
                      value={charge.amount}
                      onChange={(e) =>
                        updateExtraCharge(charge.id, {
                          amount: Number(e.target.value),
                        })
                      }
                      className="h-9 w-20 text-sm"
                    />
                    <Select
                      value={charge.type}
                      onValueChange={(value: "flat" | "percentage") =>
                        updateExtraCharge(charge.id, { type: value })
                      }
                    >
                      <SelectTrigger className="h-9 w-16 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">$</SelectItem>
                        <SelectItem value="percentage">%</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={charge.application}
                      onValueChange={(value: "perOrder" | "total") =>
                        updateExtraCharge(charge.id, { application: value })
                      }
                    >
                      <SelectTrigger className="h-9 w-24 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perOrder">Per Item</SelectItem>
                        <SelectItem value="total">Total</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExtraCharge(charge.id)}
                      className="h-9 w-9"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  Add charges like shipping, fulfillment, or COD fees. Your data
                  is automatically saved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-[#6566F1]/20 bg-gradient-to-br from-[#6566F1] to-[#8B7DF8] text-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Wallet size={18} />
                  Net Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${netProfit.toFixed(2)}</p>
                <p className="mt-1 text-xs opacity-90">
                  Margin: {profitMargin.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ShoppingCart size={18} className="text-[#6566F1]" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {deliveredOrders.toFixed(0)} delivered orders
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product Cost:</span>
                <span className="font-semibold">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extra Charges:</span>
                <span className="font-semibold">
                  ${totalExtraCharges.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-bold">
                <span>Total Expenses:</span>
                <span>${(totalCost + totalExtraCharges).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <DonutChart data={chartData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CODCalculator;
