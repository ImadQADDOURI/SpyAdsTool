"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  CreditCard,
  DollarSign,
  MousePointerClick,
  Package,
  Percent,
  Plus,
  RefreshCcw,
  ShoppingBag,
  TicketX,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
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

import CODPieChart from "./CODPieChart";

// Types for Extra Charge
type ExtraChargeType = {
  id: string;
  label: string;
  amount: number;
  type: "flat" | "percentage";
  application: "perOrder" | "total";
};

// Enhanced Input Component with Icon Support
type InputComponentProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: "text" | "number" | "percentage" | "currency";
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "optional";
  className?: string;
};

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  value,
  onChange,
  type = "number",
  min = 0,
  max = 100000,
  step = 0.01,
  icon,
  variant = "primary",
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(e.target.value);
    if (numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const variantStyles = {
    primary:
      "border-[#6566F1]/20 focus:ring-[#6566F1]/30 bg-white dark:bg-gray-900",
    secondary:
      "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50",
    optional:
      "border-dashed border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-900/30",
  };

  return (
    <div className={cn("group relative space-y-2", className)}>
      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        {icon && (
          <span className="transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}
        {label}
      </Label>
      <div className="relative transition-all duration-300 hover:translate-y-[-1px]">
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full rounded-xl pl-10 transition-all duration-300",
            "hover:shadow-md focus:shadow-lg",
            variantStyles[variant],
          )}
        />
        {type === "currency" && (
          <DollarSign
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            size={18}
          />
        )}
        {type === "percentage" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400">
            %
          </span>
        )}
      </div>
    </div>
  );
};

const SliderInput: React.FC<{
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
}> = ({ label, value, onValueChange, max = 100, step = 0.01, icon }) => (
  <div className="group space-y-2">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
      {icon && (
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      {label} ({value[0].toFixed(2)}%)
    </Label>
    <div className="flex items-center gap-4">
      <Slider
        defaultValue={value}
        max={max}
        step={step}
        onValueChange={onValueChange}
        className="flex-grow"
      />
      <Input
        type="number"
        value={value[0]}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        step={step}
        min={0}
        max={max}
        className="w-24 rounded-xl border-[#6566F1]/20 bg-white/50 text-center dark:bg-gray-900/50"
      />
    </div>
  </div>
);

const CPACalculator: React.FC = () => {
  // Primary Inputs
  const [adSpend, setAdSpend] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [refundCost, setRefundCost] = useState(0);

  // Percentage Inputs
  const [conversionRate, setConversionRate] = useState([2]); // Default 2%
  const [refundRate, setRefundRate] = useState([5]); // Default 5%

  // Extra Charges
  const [extraCharges, setExtraCharges] = useState<ExtraChargeType[]>([]);

  // Calculations
  const totalConversions = useMemo(() => {
    return (conversionRate[0] / 100) * totalClicks;
  }, [conversionRate, totalClicks]);

  const totalRevenue = useMemo(() => {
    return averageOrderValue * totalConversions;
  }, [averageOrderValue, totalConversions]);

  const totalRefundCost = useMemo(() => {
    return (refundRate[0] / 100) * totalConversions * refundCost;
  }, [refundRate, totalConversions, refundCost]);

  const netRevenue = useMemo(() => {
    return totalRevenue - totalRefundCost;
  }, [totalRevenue, totalRefundCost]);

  const cpa = useMemo(() => {
    return totalConversions > 0 ? adSpend / totalConversions : 0;
  }, [adSpend, totalConversions]);

  const totalExtraCharges = useMemo(() => {
    return extraCharges.reduce((total, charge) => {
      if (charge.type === "flat") {
        return (
          total +
          (charge.application === "perOrder"
            ? charge.amount * totalConversions
            : charge.amount)
        );
      }
      return (
        total +
        (charge.amount / 100) *
          totalRevenue *
          (charge.application === "perOrder" ? 1 : 1)
      );
    }, 0);
  }, [extraCharges, totalRevenue, totalConversions]);

  const netProfit = useMemo(() => {
    return netRevenue - (adSpend + totalExtraCharges);
  }, [netRevenue, adSpend, totalExtraCharges]);

  const roi = useMemo(() => {
    return adSpend > 0 ? (netProfit / adSpend) * 100 : 0;
  }, [netProfit, adSpend]);

  // Extra Charge Management
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
    <div className="relative space-y-6 rounded-3xl bg-gradient-to-r from-[#6566F1]/5 to-[#B977F8]/5 p-6 backdrop-blur-sm dark:from-gray-900/50 dark:to-gray-800/50">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs Column */}
        <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-900/80">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-2xl font-bold text-transparent">
              CPA Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Primary Inputs */}
            <div className="grid gap-4 md:grid-cols-2">
              <InputComponent
                label="Ad Spend"
                value={adSpend}
                onChange={setAdSpend}
                type="currency"
                icon={<BarChart size={20} />}
                variant="primary"
              />
              <InputComponent
                label="Total Clicks"
                value={totalClicks}
                onChange={setTotalClicks}
                min={0}
                icon={<MousePointerClick size={20} />}
                variant="primary"
              />
            </div>

            {/* Conversion Metrics */}
            <div className="grid gap-4 md:grid-cols-2">
              <SliderInput
                label="Conversion Rate"
                value={conversionRate}
                onValueChange={setConversionRate}
                icon={<Percent size={20} />}
              />
              <InputComponent
                label="Average Order Value"
                value={averageOrderValue}
                onChange={setAverageOrderValue}
                type="currency"
                icon={<ShoppingBag size={20} />}
                variant="primary"
              />
            </div>

            {/* Refund Metrics */}
            <div className="grid gap-4 md:grid-cols-2">
              <SliderInput
                label="Refund Rate"
                value={refundRate}
                onValueChange={setRefundRate}
                icon={<RefreshCcw size={20} />}
              />
              <InputComponent
                label="Refund Cost"
                value={refundCost}
                onChange={setRefundCost}
                type="currency"
                icon={<TicketX size={20} />}
                variant="secondary"
              />
            </div>

            {/* Extra Charges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <Plus size={16} className="" />
                  Extra Charges
                </Label>
                <Button
                  onClick={addExtraCharge}
                  variant="outline"
                  size="sm"
                  className="group border-[#6566F1]/20 bg-white/50 transition-all duration-300 hover:bg-[#6566F1]/10 dark:bg-gray-900/50"
                >
                  <Plus
                    size={16}
                    className="mr-2 transition-transform duration-300 group-hover:rotate-90"
                  />
                  Add Charge
                </Button>
              </div>

              {/* Extra Charges List */}
              <div className="space-y-2">
                {extraCharges.map((charge) => (
                  <div
                    key={charge.id}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/50 p-2 transition-all duration-300 hover:border-[#6566F1]/20 dark:border-gray-700 dark:bg-gray-900/50"
                  >
                    <Input
                      placeholder="Label"
                      value={charge.label}
                      onChange={(e) =>
                        updateExtraCharge(charge.id, { label: e.target.value })
                      }
                      className="flex-grow border-0 bg-transparent"
                    />
                    <Input
                      type="number"
                      value={charge.amount}
                      onChange={(e) =>
                        updateExtraCharge(charge.id, {
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-24 border-0 bg-transparent"
                    />
                    <Select
                      value={charge.type}
                      onValueChange={(value: "flat" | "percentage") =>
                        updateExtraCharge(charge.id, { type: value })
                      }
                    >
                      <SelectTrigger className="w-32 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={charge.application}
                      onValueChange={(value: "perOrder" | "total") =>
                        updateExtraCharge(charge.id, { application: value })
                      }
                    >
                      <SelectTrigger className="w-32 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perOrder">Per Order</SelectItem>
                        <SelectItem value="total">Total</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExtraCharge(charge.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Column */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#6566F1] to-[#B977F8] text-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet size={20} />
                  Net Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${netProfit.toFixed(2)}</p>
                <p className="text-sm opacity-80">ROI: {roi.toFixed(2)}%</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                  <CreditCard size={20} className="text-[#6566F1]" />
                  CPA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${cpa.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalConversions.toFixed(0)} conversions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pie Chart */}
          <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <CODPieChart
                  totalRevenue={totalRevenue}
                  netProfit={netProfit}
                  totalSpending={adSpend + totalExtraCharges}
                  totalRefundCost={totalRefundCost}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CPACalculator;
