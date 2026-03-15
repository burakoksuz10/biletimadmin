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
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Organizatör
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="text-[14px] font-medium text-[#0d0d12]">
              {row.original.organizer}
            </p>
            <div className="flex items-center gap-1 text-[12px] text-[#666d80]">
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
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tutar
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] font-semibold text-[#0d0d12]">
            {formatCurrency(row.original.amount)}
          </p>
        ),
      },
      {
        accessorKey: "contact",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            İletişim
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] text-[#666d80]">{row.original.contact}</p>
          </div>
        ),
      },
      {
        accessorKey: "requestedOn",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Talep Tarihi
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] text-[#666d80]">
              {formatDate(row.original.requestedOn)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "processedOn",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            İşlenme Tarihi
          </span>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] text-[#666d80]">
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
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
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
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
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
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f7f7f7] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-[#666d80]" />
            </button>

            {showActionsId === row.original.id && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-[#e5e7eb] shadow-lg py-1 z-10">
                <button
                  onClick={() => setShowActionsId(null)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                >
                  <Eye className="w-4 h-4" />
                  Detayları Görüntüle
                </button>
                {row.original.status === "pending" && (
                  <>
                    <button
                      onClick={() => setShowActionsId(null)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#09724a] hover:bg-[#e1eee3]"
                    >
                      <Check className="w-4 h-4" />
                      Onayla
                    </button>
                    <button
                      onClick={() => setShowActionsId(null)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#df1c41] hover:bg-[#fff0f3]"
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
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">Ödemeler</h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Organizatör ödeme taleplerini yönetin
          </p>
        </div>
        <Button>
          <CreditCard className="w-4 h-4 mr-2" />
          Ödemeleri İşle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1eee3] flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Tutar</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff8f0] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#d39c3d]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Beklemede</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {formatCurrency(pendingAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#effefa] flex items-center justify-center">
                <Check className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Onaylanan</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {statusCounts.approved}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f3] flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#df1c41]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Reddedilen</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {statusCounts.rejected}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
              statusFilter === status
                ? "border-[#09724a] text-[#09724a]"
                : "border-transparent text-[#666d80] hover:text-[#0d0d12]"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-[12px] text-[#818898]">
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
          <Input
            type="search"
            placeholder="Ödeme ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 h-10 rounded-lg bg-[#f7f7f7] border-[#e5e7eb]"
          />
        </div>
        <Button variant="secondary" className="h-10">
          <Filter className="w-4 h-4 mr-2" />
          Filtreler
        </Button>
      </div>

      {/* Table */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-[#e5e7eb]"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left py-3 px-4"
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
                      className="text-center py-12 text-[14px] text-[#666d80]"
                    >
                      Ödeme bulunamadı.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7] transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3 px-4">
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
          <div className="flex items-center justify-between p-4 border-t border-[#e5e7eb]">
            <p className="text-[14px] text-[#666d80]">
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
                  className={`w-8 h-8 rounded-lg text-[14px] font-medium transition-colors ${
                    table.getState().pagination.pageIndex === i
                      ? "bg-[#09724a] text-white"
                      : "text-[#666d80] hover:bg-[#f7f7f7]"
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
