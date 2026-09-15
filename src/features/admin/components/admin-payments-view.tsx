"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/error-state";
import { formatCurrency } from "@/utils/format";
import type { BankTransaction } from "@/types/subscription";
import { useAdminUnmatchedPayments } from "../hooks/use-admin-unmatched-payments";
import { useApprovePayment } from "../hooks/use-approve-payment";
import { useScanPayments } from "../hooks/use-scan-payments";

function TransactionRow({ transaction }: { transaction: BankTransaction }) {
  const [refCode, setRefCode] = useState(transaction.referenceCode ?? "");
  const approve = useApprovePayment();

  function handleApprove() {
    if (!refCode.trim()) return;
    if (
      !window.confirm(
        `Credit ${formatCurrency(transaction.amount)} to invoice with ref code "${refCode.trim()}"? This activates the subscription immediately.`
      )
    ) {
      return;
    }
    approve.mutate(refCode.trim().toUpperCase());
  }

  return (
    <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{formatCurrency(transaction.amount)}</p>
        <p className="truncate text-xs text-white/50">{transaction.description}</p>
        <p className="text-[11px] text-white/30">
          {new Date(transaction.transactionDate).toLocaleString("vi-VN")}
        </p>
      </div>
      <input
        value={refCode}
        onChange={(e) => setRefCode(e.target.value)}
        placeholder="Ref code (e.g. SOFILM7K2M9P)"
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 sm:w-48"
      />
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={approve.isPending || !refCode.trim()}
      >
        {approve.isPending ? "Approving..." : "Approve"}
      </Button>
      {approve.isError && <p className="text-xs text-red-500">Failed — check the ref code.</p>}
    </div>
  );
}

export function AdminPaymentsView() {
  const { data: transactions, isLoading, isError, refetch } = useAdminUnmatchedPayments();
  const scan = useScanPayments();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg text-white">Unmatched Bank Transactions</h2>
          <p className="text-xs text-white/50">
            Transfers SePay couldn&apos;t auto-match to a pending checkout — underpaid, expired,
            or missing/garbled ref code. Enter the correct ref code to credit manually.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => scan.mutate()} disabled={scan.isPending}>
          {scan.isPending ? "Scanning..." : "Scan Now"}
        </Button>
      </div>

      {isError ? (
        <ErrorState title="Failed to load transactions." onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/10 rounded-md border border-white/10">
          {transactions?.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
          {transactions?.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-white/50">
              No unmatched transactions — everything is reconciled.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
