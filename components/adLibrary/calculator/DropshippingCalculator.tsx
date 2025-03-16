"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  CreditCard,
  DollarSign,
  Info,
  Package,
  PackageOpen,
  Plus,
  RefreshCcw,
  ShoppingCart,
  TicketPlus,
  TicketX,
  Trash2,
  TrendingUp,
  Truck,
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

const DropshippingCalculator: React.FC = () => {
  // Primary Inputs
  const [quantity, setQuantity] = useState(1);
  const [productCostPrice, setProductCostPrice] = useState(0);
  const [productSellingPrice, setProductSellingPrice] = useState(0);
  const [advertisingCosts, setAdvertisingCosts] = useState(0);
  const [returnCost, setReturnCost] = useState(0);

  // Percentage Inputs
  const [shippingCostPercentage, setShippingCostPercentage] = useState([5]);
  const [transactionFeePercentage, setTransactionFeePercentage] = useState([3]);
  const [returnsRatePercentage, setReturnsRatePercentage] = useState([2]);

  // Extra Charges
  const [extraCharges, setExtraCharges] = useState<ExtraChargeType[]>([]);

  // Calculations
  const totalCOGS = useMemo(() => {
    return productCostPrice * quantity;
  }, [productCostPrice, quantity]);

  const totalShippingCosts = useMemo(() => {
    return (shippingCostPercentage[0] / 100) * productSellingPrice * quantity;
  }, [shippingCostPercentage, productSellingPrice, quantity]);

  const totalTransactionFees = useMemo(() => {
    return (transactionFeePercentage[0] / 100) * productSellingPrice * quantity;
  }, [transactionFeePercentage, productSellingPrice, quantity]);

  const totalRevenue = useMemo(() => {
    return productSellingPrice * quantity;
  }, [productSellingPrice, quantity]);

  const totalReturnsCost = useMemo(() => {
    return (returnsRatePercentage[0] / 100) * quantity * returnCost;
  }, [returnsRatePercentage, quantity, returnCost]);

  const totalExtraCharges = useMemo(() => {
    return extraCharges.reduce((total, charge) => {
      if (charge.type === "flat") {
        return (
          total +
          (charge.application === "perOrder"
            ? charge.amount * quantity
            : charge.amount)
        );
      }
      return (
        total +
        (charge.amount / 100) *
          productSellingPrice *
          (charge.application === "perOrder" ? quantity : 1)
      );
    }, 0);
  }, [extraCharges, productSellingPrice, quantity]);

  const totalSpending = useMemo(() => {
    return (
      totalCOGS +
      totalShippingCosts +
      totalTransactionFees +
      totalReturnsCost +
      advertisingCosts +
      totalExtraCharges
    );
  }, [
    totalCOGS,
    totalShippingCosts,
    totalTransactionFees,
    totalReturnsCost,
    advertisingCosts,
    totalExtraCharges,
  ]);

  const netProfit = useMemo(() => {
    return totalRevenue - totalSpending;
  }, [totalRevenue, totalSpending]);

  const roi = useMemo(() => {
    return totalSpending > 0 ? (netProfit / totalSpending) * 100 : 0;
  }, [netProfit, totalSpending]);

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
              Dropshipping Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Primary Inputs */}
            <div className="grid gap-4 md:grid-cols-3">
              <InputComponent
                label="Quantity"
                value={quantity}
                onChange={setQuantity}
                min={1}
                icon={<PackageOpen size={20} />}
                variant="primary"
              />
              <InputComponent
                label="Cost Price"
                value={productCostPrice}
                onChange={setProductCostPrice}
                type="currency"
                icon={<DollarSign size={20} />}
                variant="primary"
              />
              <InputComponent
                label="Selling Price"
                value={productSellingPrice}
                onChange={setProductSellingPrice}
                type="currency"
                icon={<ShoppingCart size={20} />}
                variant="primary"
              />
            </div>

            {/* Percentage Inputs */}
            <div className="grid gap-4 md:grid-cols-3">
              <SliderInput
                label="Shipping Cost"
                value={shippingCostPercentage}
                onValueChange={setShippingCostPercentage}
                icon={<Truck size={20} />}
              />
              <SliderInput
                label="Transaction Fee"
                value={transactionFeePercentage}
                onValueChange={setTransactionFeePercentage}
                icon={<CreditCard size={20} />}
              />
              <SliderInput
                label="Returns Rate"
                value={returnsRatePercentage}
                onValueChange={setReturnsRatePercentage}
                icon={<RefreshCcw size={20} />}
              />
            </div>

            {/* Additional Costs */}
            <div className="grid gap-4 md:grid-cols-2">
              <InputComponent
                label="Return Cost"
                value={returnCost}
                onChange={setReturnCost}
                type="currency"
                icon={<TicketX size={20} />}
                variant="secondary"
              />
              <InputComponent
                label="Advertising"
                value={advertisingCosts}
                onChange={setAdvertisingCosts}
                type="currency"
                icon={<TrendingUp size={20} />}
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

            {/* ℹ️ User Note */}
            <div className="mx-auto mb-8 max-w-6xl rounded-xl bg-purple-50 p-2 shadow-sm dark:bg-gray-900/60">
              <div className="flex items-center space-x-2 text-sm text-purple-700 dark:text-purple-300">
                <Info className="h-5 w-5" />
                <p>
                  <span className="font-medium">Note:</span> Refund costs are
                  calculated only if a refund amount is entered (default: 0).
                </p>
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
                  <Package size={20} className="text-[#6566F1]" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {quantity} orders
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
                  totalSpending={totalSpending}
                  totalRefundCost={totalReturnsCost}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DropshippingCalculator;
