"use client";

import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BambooHRViewProps {
  stepTitle: string;
}

export function BambooHRView({ stepTitle }: BambooHRViewProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600 dark:text-stone-400">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600 dark:text-stone-400">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600 dark:text-stone-400">
          <RotateCw className="h-4 w-4" />
        </Button>
        <div className="flex-1 rounded-full bg-stone-100 dark:bg-stone-700 px-4 py-1.5 text-sm text-stone-600 dark:text-stone-300">
          www.bamboohr.com/payroll
        </div>
      </div>

      {/* Fake BambooHR UI */}
      <div className="flex-1 overflow-auto p-6">
        {/* BambooHR Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600 text-white font-bold text-sm">
              B
            </div>
            <span className="text-lg font-semibold text-green-700">bambooHR</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Ask or search for anything..."
              className="w-64 rounded-full border border-stone-300 px-4 py-1.5 text-sm"
            />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-stone-200" />
              <div className="h-8 w-8 rounded-full bg-stone-200" />
              <div className="h-8 w-8 rounded-full bg-stone-200" />
            </div>
          </div>
        </div>

        {/* Payroll Title */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-stone-800">Payroll</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-sm">Open TRAXPayroll</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-sm">+ New off-cycle payroll</Button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-6 flex items-center gap-2">
          {["19", "26", "2", "9", "16", "22"].map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center rounded-lg border px-4 py-2 ${
                i === 1 ? "border-green-600 bg-green-50" : "border-stone-200"
              }`}
            >
              <span className={`text-xl font-bold ${i === 1 ? "text-green-600" : "text-stone-700"}`}>
                {day}
              </span>
              <span className="text-xs text-stone-500">
                {i < 2 ? "January" : "February"}
              </span>
              <span className="text-xs text-stone-400">Friday</span>
              {i === 1 && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-600" />}
            </div>
          ))}
        </div>

        {/* Payroll Details */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="rounded-lg border border-stone-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-stone-500">$</span>
                <span className="text-lg font-semibold">January 26 Payroll</span>
              </div>
              
              <div className="mb-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-stone-200" />
                  <div>
                    <div className="text-lg font-bold">88</div>
                    <div className="text-xs text-stone-500">People being paid</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">$</div>
                  <div>
                    <div className="text-lg font-bold">$1,234.00</div>
                    <div className="text-xs text-stone-500">Extra pay</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <div>
                    <div className="text-lg font-bold">113</div>
                    <div className="text-xs text-stone-500">Timesheets approved</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                <h3 className="mb-2 font-semibold text-stone-700">Reminders</h3>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Rebecca needs a paper check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Check direct deposit info for Jonathan Barry (new employee)</span>
                  </div>
                  <button className="text-green-600 text-sm">+ Add Reminder</button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-stone-700">
                <span className="text-green-600">✓</span>
                Updates since last payroll
              </h3>
              <p className="text-sm text-stone-600">
                Having information of what changed since last payroll could help you feel confident to start this payroll.
                Check out the report to see updates since your last scheduled payroll that was paid on January 11, 2024.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Jump to report
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-green-600 hover:bg-green-700">Start payroll</Button>
            <div className="rounded-lg border border-stone-200 p-4 text-sm">
              <div className="mb-2 text-stone-500">Due by Wed, Jan 4 at 1:00 PM</div>
              <div className="mb-4">
                <div className="font-semibold">Vinyl Design Lab (Weekly)</div>
                <div className="text-stone-500">Pay schedule</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold">Jan 13, 2024 - Jan 19, 2024</div>
                <div className="text-stone-500">Pay period</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold">Friday, January 26, 2024</div>
                <div className="text-stone-500">Pay date</div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Delete this payroll</Button>
              <div className="mt-2 text-xs text-stone-400 text-center">ID: 0376-1234567</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
