"use client";

export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Check,
  X,
  ArrowUpDown,
  Filter,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  CreditCard,
  TrendingUp,
  Clock,
  XCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockPayouts } from "@/lib/mock-data/payouts";
import type { PayoutRequest, PayoutStatus } from "@/types/payout.types";

const statusVariantMap: Record<PayoutStatus, "success" | "warning" | "danger"> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

const statusLabels: Record<PayoutStatus, string> = {
  approved: "Onaylandı",
  pending: "Beklemede",
  rejected: "Reddedildi",
};

export default function PayoutsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | "all">("all");
  const [showActionsId, setShowActionsId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return statusFilter === "all"
      ? mockPayouts
      : mockPayouts.filter((payout) => payout.status === statusFilter);
  }, [statusFilter]);

  const columns = useMemo<ColumnDef<PayoutRequest>[]>(
    () => [
      {
        accessorKey: "organizer",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Organizatör
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="body-md font-medium text-on-surface">
              {row.original.organizer}
            </p>
            <div className="flex items-center gap-1 body-sm text-on-surface-variant">
              <Mail className="w-3 h-3" />
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tutar
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="body-md font-semibold text-on-surface">
            {formatCurrency(row.original.amount)}
          </p>
        ),
      },
      {
        accessorKey: "contact",
        header: () => (
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
            İletişim
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-on-surface-variant" />
            <p className="body-md text-on-surface-variant">{row.original.contact}</p>
          </div>
        ),
      },
      {
        accessorKey: "requestedOn",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Talep Tarihi
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            <p className="body-md text-on-surface-variant">
              {formatDate(row.original.requestedOn)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "processedOn",
        header: () => (
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
            İşlenme Tarihi
          </span>
        ),
        cell: ({ row }) => (
          <p className="body-md text-on-surface-variant">
            {row.original.processedOn
              ? formatDate(row.original.processedOn)
              : "-"}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Durum
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <Badge variant={statusVariantMap[row.original.status]}>
            {statusLabels[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => (
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
            İşlemler
          </span>
        ),
        cell: ({ row }) => (
          <div className="relative">
            <button
              onClick={() =>
                setShowActionsId(
                  showActionsId === row.original.id ? null : row.original.id
                )
              }
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-low transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-on-surface-variant" />
            </button>

            {showActionsId === row.original.id && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-higher rounded-xl border border-outline/30 shadow-glow py-1 z-10">
                <button
                  onClick={() => setShowActionsId(null)}
                  className="flex items-center gap-2 w-full px-3 py-2 body-md text-on-surface hover:bg-surface-low transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Detayları Görüntüle
                </button>
                {row.original.status === "pending" && (
                  <>
                    <button
                      onClick={() => setShowActionsId(null)}
                      className="flex items-center gap-2 w-full px-3 py-2 body-md text-success hover:bg-success/10 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Onayla
                    </button>
                    <button
                      onClick={() => setShowActionsId(null)}
                      className="flex items-center gap-2 w-full px-3 py-2 body-md text-danger hover:bg-danger/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reddet
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ),
      },
    ],
    [showActionsId]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const statusCounts = useMemo(() => {
    const counts = { all: mockPayouts.length, pending: 0, approved: 0, rejected: 0 };
    mockPayouts.forEach((p) => {
      counts[p.status]++;
    });
    return counts;
  }, []);

  const totalAmount = useMemo(() => {
    return mockPayouts.reduce((sum, p) => sum + p.amount, 0);
  }, []);

  const pendingAmount = useMemo(() => {
    return mockPayouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Ödemeler
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Organizatör ödeme taleplerini yönetin
          </p>
        </div>
        <Button variant="primary">
          <CreditCard className="w-4 h-4 mr-2" />
          Ödemeleri İşle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam Tutar</p>
              <p className="display-lg text-on-surface leading-none">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Beklemede</p>
              <p className="display-lg text-on-surface leading-none">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center shadow-sm">
              <Clock className="w-7 h-7 text-warning" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Onaylanan</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.approved}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shadow-sm">
              <Check className="w-7 h-7 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Reddedilen</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.rejected}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center shadow-sm">
              <XCircle className="w-7 h-7 text-danger" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-outline/30">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-3 body-md font-medium border-b-2 transition-colors ${
              statusFilter === status
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline/50"
            }`}
          >
            {status === "all" ? "Tümü" : status === "pending" ? "Beklemede" : status === "approved" ? "Onaylanan" : "Reddedilen"}
            <span className="ml-2 body-sm text-on-surface-variant">
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Ödeme ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button variant="secondary" size="medium">
          <Filter className="w-4 h-4 mr-2" />
          Filtreler
        </Button>
      </div>

      {/* Table */}
      <Card variant="default" padding="none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-outline/30 bg-surface-low/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left py-4 px-6"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 body-md text-on-surface-variant"
                    >
                      Ödeme bulunamadı.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-outline/30 last:border-0 hover:bg-surface-low/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-4 px-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-outline/30">
            <p className="body-md text-on-surface-variant">
              {table.getFilteredRowModel().rows.length} sonuçtan{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              -{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              arası gösteriliyor
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Önceki
              </Button>
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`w-8 h-8 rounded-lg body-md font-medium transition-colors ${
                    table.getState().pagination.pageIndex === i
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "text-on-surface-variant hover:bg-surface-low"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="secondary"
                size="small"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Sonraki
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
