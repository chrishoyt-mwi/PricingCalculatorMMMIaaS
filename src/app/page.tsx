
"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Calculator, Info, PlusCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const ONBOARDING_PER_PRODUCT = 15000;
const SUPPORT_PER_PRODUCT_PM = 750;
const CONSULTING_PER_HOUR = 250;

const TIERS: { threshold: number; price: number; label: string }[] = [
  { threshold: 365, price: 200, label: "Daily (≥365/yr)" },
  { threshold: 180, price: 300, label: "15 per month (≥180/yr)" },
  { threshold: 104, price: 350, label: "2 per week (≥104/yr)" },
  { threshold: 52,  price: 450, label: "1 per week (≥52/yr)" },
];

const MIN_MONTHLY_PLATFORM = 2500;
const INCLUDED_MODELS_PER_MONTH = 3;
const EXTRA_MODEL_PRICE_ABOVE_MIN = 450;

const PRESETS: { key: string; label: string; annual: number }[] = [
  { key: "daily", label: "Daily", annual: 365 },
  { key: "15pm", label: "15 per month", annual: 15 * 12 },
  { key: "2pw", label: "2 per week", annual: 2 * 52 },
  { key: "1pw", label: "1 per week", annual: 52 },
  { key: "1pm", label: "Monthly (1 per month)", annual: 12 },
  { key: "custom", label: "Custom (per year)", annual: 0 },
];

type ProductRow = {
  id: string;
  name: string;
  presetKey: string;
  customAnnual: number;
};

function formatUSD(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function annualFromRow(r: ProductRow) {
  if (r.presetKey === "custom") return Math.max(0, Math.floor(r.customAnnual || 0));
  return PRESETS.find(p => p.key === r.presetKey)?.annual ?? 0;
}

function selectPerModelPrice(totalAnnualModels: number) {
  for (const t of TIERS) {
    if (totalAnnualModels >= t.threshold) return t.price;
  }
  return 450;
}

export default function Page() {
  const [products, setProducts] = useState<ProductRow[]>([
    { id: crypto.randomUUID(), name: "", presetKey: "1pw", customAnnual: 0 },
  ]);
  const [consultingHoursPerMonth, setConsultingHoursPerMonth] = useState<number>(0);

  const totals = useMemo(() => {
    const productCount = products.length;
    const withAnnual = products.map(r => ({ ...r, annual: annualFromRow(r) }));
    const totalAnnualModels = withAnnual.reduce((s, r) => s + r.annual, 0);
    const perModelPrice = selectPerModelPrice(totalAnnualModels);
    const annualModelCost = totalAnnualModels * perModelPrice;
    const avgMonthlyModelCost = annualModelCost / 12;
    const monthlySupport = productCount * SUPPORT_PER_PRODUCT_PM;
    const baselineMonthlyPlatform = monthlySupport + avgMonthlyModelCost;
    const modelsPerMonth = totalAnnualModels / 12;

    let platformMonthly = baselineMonthlyPlatform;
    let minimumApplies = false;
    let aboveIncludedModels = 0;

    if (baselineMonthlyPlatform < MIN_MONTHLY_PLATFORM) {
      minimumApplies = true;
      aboveIncludedModels = Math.max(0, modelsPerMonth - INCLUDED_MODELS_PER_MONTH);
      platformMonthly = MIN_MONTHLY_PLATFORM + (aboveIncludedModels * EXTRA_MODEL_PRICE_ABOVE_MIN);
    }

    const consultingMonthly = consultingHoursPerMonth * CONSULTING_PER_HOUR;
    const monthlyAllInAfterHandoff = platformMonthly + consultingMonthly;
    const onboardingOneTime = productCount * ONBOARDING_PER_PRODUCT;
    const year1Total = onboardingOneTime + (monthlyAllInAfterHandoff * 9);

    return {
      productCount,
      withAnnual,
      totalAnnualModels,
      perModelPrice,
      annualModelCost,
      avgMonthlyModelCost,
      monthlySupport,
      baselineMonthlyPlatform,
      modelsPerMonth,
      minimumApplies,
      aboveIncludedModels,
      platformMonthly,
      consultingMonthly,
      monthlyAllInAfterHandoff,
      onboardingOneTime,
      year1Total,
    };
  }, [products, consultingHoursPerMonth]);

  const addProduct = () => setProducts(p => ([...p, { id: crypto.randomUUID(), name: "", presetKey: "1pw", customAnnual: 0 }]));
  const removeProduct = (id: string) => setProducts(p => p.filter(r => r.id !== id));
  const updateProduct = (id: string, patch: Partial<ProductRow>) => setProducts(p => p.map(r => r.id === id ? { ...r, ...patch } : r));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="max-w-6xl mx-auto px-6 py-10">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-semibold tracking-tight">
          MetricWorks Pricing & Estimator
        </motion.h1>
        <p className="mt-3 text-slate-600 max-w-3xl">
          Transparent pricing for MMM Infrastructure-as-a-Service (IaaS). Estimate your costs by selecting your products and model cadence.
          Pricing is per <span className="font-medium">product</span> for onboarding and per <span className="font-medium">model</span> thereafter, with company-wide tiering.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24 grid gap-8">
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>1) Onboarding & Handoff</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-600">First 3 months include onboarding, education, and transfer of ownership.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">{formatUSD(ONBOARDING_PER_PRODUCT)}</span> per product (one-time for months 1–3)</li>
                <li>Scope is per product (e.g., <em>Microsoft Office</em>, not OS-specific)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>2) Ongoing Models (Company Tiered)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-600">After month 3, you pay per model. Your company-wide annual commitment sets your per‑model price.</p>
              <ul className="list-disc pl-5 space-y-1">
                {TIERS.map(t => (
                  <li key={t.threshold}><span className="font-semibold">{t.label}</span>: {formatUSD(t.price)}/model</li>
                ))}
              </ul>
              <p className="text-slate-600">Below 52/year defaults to {formatUSD(450)}/model.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>3) Support & Minimums</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>{formatUSD(SUPPORT_PER_PRODUCT_PM)}/month per product for basic support</li>
                <li>Minimum platform fee: <span className="font-semibold">{formatUSD(MIN_MONTHLY_PLATFORM)}/month</span> (includes support + up to {INCLUDED_MODELS_PER_MONTH} models/mo; overage {formatUSD(EXTRA_MODEL_PRICE_ABOVE_MIN)}/model)</li>
                <li>Optional consulting: {formatUSD(CONSULTING_PER_HOUR)}/hour</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Estimator</h2>
            <Button onClick={addProduct} className="flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Add product</Button>
          </div>

          <div className="grid gap-3">
            {products.map((row, idx) => (
              <Card key={row.id} className="rounded-2xl">
                <CardContent className="py-5 grid md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3">
                    <label className="block text-sm text-slate-600 mb-1">Product name</label>
                    <Input placeholder={`e.g., Product ${idx + 1}`} value={row.name} onChange={e => updateProduct(row.id, { name: (e.target as HTMLInputElement).value })} />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-sm text-slate-600 mb-1">Model cadence</label>
                    <NativeSelect
                      value={row.presetKey}
                      onChange={(v) => updateProduct(row.id, { presetKey: v })}
                      options={PRESETS.map(p => ({ value: p.key, label: p.label }))}
                    />
                  </div>

                  {row.presetKey === "custom" && (
                    <div className="md:col-span-3">
                      <label className="block text-sm text-slate-600 mb-1">Custom models per year</label>
                      <Input type="number" min={0} value={row.customAnnual} onChange={e => updateProduct(row.id, { customAnnual: Number((e.target as HTMLInputElement).value || 0) })} />
                    </div>
                  )}

                  <div className="md:col-span-2 flex items-end justify-end">
                    <Button variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => removeProduct(row.id)}>
                      <Trash2 className="w-4 h-4 mr-2"/>Remove
                    </Button>
                  </div>

                  <div className="md:col-span-12 text-sm text-slate-600 mt-1">
                    Annual models for this product: <span className="font-medium">{annualFromRow(row)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-2xl">
            <CardContent className="py-5 grid md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="block text-sm text-slate-600 mb-1">Optional consulting hours per month</label>
                <Input type="number" min={0} value={consultingHoursPerMonth} onChange={e => setConsultingHoursPerMonth(Number((e.target as HTMLInputElement).value || 0))} />
              </div>
              <div className="md:col-span-8 text-sm text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4"/>
                <span>Consulting is billed separately and not covered by the platform minimum.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5"/> Estimate</CardTitle>
              <div className="text-sm text-slate-500">Per‑model price (based on your annual commitment): <span className="font-semibold text-slate-800">{formatUSD(totals.perModelPrice)}</span></div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Your commitment</h3>
                <ul className="space-y-1">
                  <li>Total products: <span className="font-medium">{totals.productCount}</span></li>
                  <li>Total annual models: <span className="font-medium">{totals.totalAnnualModels}</span> (~{totals.modelsPerMonth.toFixed(1)}/mo)</li>
                  <li>Support: <span className="font-medium">{formatUSD(totals.monthlySupport)}</span>/mo</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Costs after month 3</h3>
                <ul className="space-y-1">
                  <li>Avg model cost: <span className="font-medium">{formatUSD(totals.avgMonthlyModelCost)}</span>/mo</li>
                  <li className={totals.minimumApplies ? "text-amber-700 font-medium" : ""}>
                    Platform monthly{totals.minimumApplies ? " (minimum applied)" : ""}: <span className="font-medium">{formatUSD(totals.platformMonthly)}</span>
                  </li>
                  {totals.minimumApplies && (
                    <li className="text-slate-600">Includes up to {INCLUDED_MODELS_PER_MONTH}/mo; est. overage at {formatUSD(EXTRA_MODEL_PRICE_ABOVE_MIN)}/model for ~{Math.max(0, totals.aboveIncludedModels).toFixed(1)} extra models/mo.</li>
                  )}
                  <li>Consulting: <span className="font-medium">{formatUSD(totals.consultingMonthly)}</span>/mo</li>
                  <li className="border-t pt-2 mt-2">All‑in monthly after handoff: <span className="font-semibold">{formatUSD(totals.monthlyAllInAfterHandoff)}</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">One‑time & Year 1</h3>
                <ul className="space-y-1">
                  <li>Onboarding (months 1–3): <span className="font-medium">{formatUSD(totals.onboardingOneTime)}</span> one‑time</li>
                  <li>Estimated Year‑1 total: <span className="font-semibold">{formatUSD(totals.year1Total)}</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Support Package (Included at {formatUSD(SUPPORT_PER_PRODUCT_PM)}/product/mo)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <ul className="list-disc pl-5 space-y-1">
                <li>Live chat via the MetricWorks platform</li>
                <li>Email support with a dedicated CSM</li>
                <li>24×5 coverage with ≤24h first response time</li>
                <li>Monthly 1‑hour check‑in for education, Q&A, and planning</li>
                <li>Quarterly analysis: market feedback, performance review, recommendations, and a custom report</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Definitions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">Product</span>: an app or suite (e.g., <em>Microsoft Office</em> or <em>Candy Crush</em>). Not OS‑specific.</li>
                <li><span className="font-semibold">Model</span>: one processed batch of data for a single product (e.g., 7 days in → 7 daily KPIs out = 1 model).</li>
                <li><span className="font-semibold">Company‑wide tiering</span>: we price per‑model using your combined annual models across all products.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <footer className="text-center text-slate-500 text-xs mt-6">
          All pricing in USD. Taxes (if any) not included. This is an estimate and not a binding quote.
        </footer>
      </main>
    </div>
  );
}
