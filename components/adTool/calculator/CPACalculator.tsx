"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  DollarSign,
  Info,
  Plus,
  Sparkles,
  Target,
  Trash2,
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
    label: "Agency Fee",
    type: "percentage" as const,
    amount: 15,
    application: "total" as const,
  },
  {
    label: "Creative Cost",
    type: "flat" as const,
    amount: 200,
    application: "total" as const,
  },
  {
    label: "Landing Page",
    type: "flat" as const,
    amount: 100,
    application: "total" as const,
  },
  {
    label: "Tool Subscription",
    type: "flat" as const,
    amount: 50,
    application: "total" as const,
  },
];

const STORAGE_KEY = "cpa-calculator-data";

const CPACalculator: React.FC = () => {
  const [adSpend, setAdSpend] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [conversionRate, setConversionRate] = useState([2]);
  const [orderValue, setOrderValue] = useState(0);
  const [extraCharges, setExtraCharges] = useState<ExtraChargeType[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAdSpend(data.adSpend ?? 0);
        setClicks(data.clicks ?? 0);
        setConversionRate(data.conversionRate ?? [2]);
        setOrderValue(data.orderValue ?? 0);
        setExtraCharges(data.extraCharges ?? []);
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  useEffect(() => {
    const data = { adSpend, clicks, conversionRate, orderValue, extraCharges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [adSpend, clicks, conversionRate, orderValue, extraCharges]);

  const conversions = clicks * (conversionRate[0] / 100);

  const cpa = conversions > 0 ? adSpend / conversions : 0;

  const totalRevenue = orderValue * conversions;

  const totalExtraCharges = extraCharges.reduce((total, charge) => {
    if (charge.type === "flat") {
      return (
        total +
        (charge.application === "perOrder"
          ? charge.amount * conversions
          : charge.amount)
      );
    }
    const base =
      charge.application === "perOrder" ? totalRevenue : totalRevenue;
    return total + (charge.amount / 100) * base;
  }, 0);

  const netProfit = totalRevenue - adSpend - totalExtraCharges;

  const roi = (() => {
    const totalInvestment = adSpend + totalExtraCharges;
    return totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  })();

  const chartData: ChartDataItem[] = [
    { name: "Ad Spend", value: adSpend, color: "#FF6B6B", icon: Target },
    {
      name: "Extra Charges",
      value: totalExtraCharges,
      color: "#4ECDC4",
      icon: DollarSign,
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
        application: "total",
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
              <Target className="h-5 w-5 text-[#6566F1]" />
              CPA Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ad Spend ($)</Label>
                <Input
                  type="number"
                  value={adSpend}
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  min={0}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Total Clicks</Label>
                <Input
                  type="number"
                  value={clicks}
                  onChange={(e) => setClicks(Number(e.target.value))}
                  min={0}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Conversion Rate: {conversionRate[0].toFixed(1)}%
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={conversionRate}
                  onValueChange={setConversionRate}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={conversionRate[0]}
                  onChange={(e) =>
                    setConversionRate([
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
                Average Order Value ($)
              </Label>
              <Input
                type="number"
                value={orderValue}
                onChange={(e) => setOrderValue(Number(e.target.value))}
                min={0}
                className="h-10"
              />
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
                        <SelectItem value="perOrder">Per Conv.</SelectItem>
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
                  Add agency fees, creative costs, and tools. Your data is
                  automatically saved.
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
                  ROI: {roi.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Target size={18} className="text-[#6566F1]" />
                  CPA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${cpa.toFixed(2)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {conversions.toFixed(0)} conversions
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
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-semibold">
                  ${totalRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ad Spend:</span>
                <span className="font-semibold">${adSpend.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extra Charges:</span>
                <span className="font-semibold">
                  ${totalExtraCharges.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-bold">
                <span>Total Costs:</span>
                <span>${(adSpend + totalExtraCharges).toFixed(2)}</span>
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

export default CPACalculator;
