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
  Download,
  ArrowUpDown,
  Filter,
  Ticket,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockEvents } from "@/lib/mock-data/events";

interface TicketSale {
  id: string;
  ticketId: string;
  eventName: string;
  eventDate: string;
  buyerName: string;
  buyerEmail: string;
  ticketType: string;
  price: number;
  quantity: number;
  totalAmount: number;
  purchaseDate: string;
  status: "confirmed" | "pending" | "cancelled" | "refunded";
}

const mockTicketSales: TicketSale[] = [
  {
    id: "sale-001",
    ticketId: "TKT-001234",
    eventName: "Artistic Odyssey",
    eventDate: "2025-03-12T14:00:00",
    buyerName: "John Smith",
    buyerEmail: "john.smith@example.com",
    ticketType: "General Admission",
    price: 50,
    quantity: 2,
    totalAmount: 100,
    purchaseDate: "2025-03-01",
    status: "confirmed",
  },
  {
    id: "sale-002",
    ticketId: "TKT-001235",
    eventName: "Innovators' Gala",
    eventDate: "2025-10-06T08:00:00",
    buyerName: "Sarah Johnson",
    buyerEmail: "sarah.j@example.com",
    ticketType: "VIP Pass",
    price: 150,
    quantity: 1,
    totalAmount: 150,
    purchaseDate: "2025-03-02",
    status: "confirmed",
  },
  {
    id: "sale-003",
    ticketId: "TKT-001236",
    eventName: "Spectrum Showcase",
    eventDate: "2025-12-02T09:00:00",
    buyerName: "Michael Brown",
    buyerEmail: "m.brown@example.com",
    ticketType: "General Admission",
    price: 75,
    quantity: 3,
    totalAmount: 225,
    purchaseDate: "2025-03-03",
    status: "pending",
  },
  {
    id: "sale-004",
    ticketId: "TKT-001237",
    eventName: "Elysium Festival",
    eventDate: "2025-04-22T15:00:00",
    buyerName: "Emily Davis",
    buyerEmail: "emily.d@example.com",
    ticketType: "Early Bird",
    price: 45,
    quantity: 2,
    totalAmount: 90,
    purchaseDate: "2025-03-04",
    status: "confirmed",
  },
  {
    id: "sale-005",
    ticketId: "TKT-001238",
    eventName: "Artistry Unleashed",
    eventDate: "2025-09-15T18:00:00",
    buyerName: "David Wilson",
    buyerEmail: "david.w@example.com",
    ticketType: "Premium",
    price: 120,
    quantity: 1,
    totalAmount: 120,
    purchaseDate: "2025-03-05",
    status: "refunded",
  },
  {
    id: "sale-006",
    ticketId: "TKT-001239",
    eventName: "Visionary Vibes",
    eventDate: "2025-02-17T21:00:00",
    buyerName: "Lisa Anderson",
    buyerEmail: "lisa.a@example.com",
    ticketType: "General Admission",
    price: 35,
    quantity: 4,
    totalAmount: 140,
    purchaseDate: "2025-03-06",
    status: "confirmed",
  },
  {
    id: "sale-007",
    ticketId: "TKT-001240",
    eventName: "Imagination Expo",
    eventDate: "2026-01-31T19:00:00",
    buyerName: "James Thomas",
    buyerEmail: "james.t@example.com",
    ticketType: "VIP Pass",
    price: 200,
    quantity: 2,
    totalAmount: 400,
    purchaseDate: "2025-03-07",
    status: "confirmed",
  },
  {
    id: "sale-008",
    ticketId: "TKT-001241",
    eventName: "Cultural Fusion Fest",
    eventDate: "2026-07-26T21:00:00",
    buyerName: "Mary Jackson",
    buyerEmail: "mary.j@example.com",
    ticketType: "General Admission",
    price: 55,
    quantity: 2,
    totalAmount: 110,
    purchaseDate: "2025-03-08",
    status: "cancelled",
  },
];

const statusVariantMap: Record<
  TicketSale["status"],
  "success" | "warning" | "danger" | "neutral"
> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "neutral",
  refunded: "danger",
};

const statusLabels: Record<TicketSale["status"], string> = {
  confirmed: "Onaylandı",
  pending: "Beklemede",
  cancelled: "İptal Edildi",
  refunded: "İade Edildi",
};

export default function TicketSalesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    TicketSale["status"] | "all"
  >("all");
  const [showActionsId, setShowActionsId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return statusFilter === "all"
      ? mockTicketSales
      : mockTicketSales.filter((sale) => sale.status === statusFilter);
  }, [statusFilter]);

  const columns = useMemo<ColumnDef<TicketSale>[]>(
    () => [
      {
        accessorKey: "ticketId",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Bilet ID
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] font-medium text-[#0d0d12]">
              {row.original.ticketId}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "eventName",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Etkinlik
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="text-[14px] font-medium text-[#0d0d12]">
              {row.original.eventName}
            </p>
            <div className="flex items-center gap-1 text-[12px] text-[#666d80]">
              <Calendar className="w-3 h-3" />
              {formatDate(row.original.eventDate)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "buyerName",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Alıcı
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#818898]" />
              <p className="text-[14px] font-medium text-[#0d0d12]">
                {row.original.buyerName}
              </p>
            </div>
            <p className="text-[12px] text-[#666d80]">
              {row.original.buyerEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "ticketType",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            Bilet Türü
          </span>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] text-[#666d80]">
            {row.original.ticketType}
          </p>
        ),
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qty
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] font-medium text-[#0d0d12]">
            {row.original.quantity}
          </p>
        ),
      },
      {
        accessorKey: "totalAmount",
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
            {formatCurrency(row.original.totalAmount)}
          </p>
        ),
      },
      {
        accessorKey: "purchaseDate",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Satın Alma Tarihi
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] text-[#666d80]">
            {formatDate(row.original.purchaseDate)}
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
                <button
                  onClick={() => setShowActionsId(null)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                >
                  <Download className="w-4 h-4" />
                  Bileti İndir
                </button>
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
    const counts = {
      all: mockTicketSales.length,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      refunded: 0,
    };
    mockTicketSales.forEach((s) => {
      counts[s.status]++;
    });
    return counts;
  }, []);

  const totalRevenue = useMemo(() => {
    return mockTicketSales
      .filter((s) => s.status === "confirmed")
      .reduce((sum, s) => sum + s.totalAmount, 0);
  }, []);

  const totalTickets = useMemo(() => {
    return mockTicketSales
      .filter((s) => s.status === "confirmed")
      .reduce((sum, s) => sum + s.quantity, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Bilet Satışları
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Tüm bilet satışlarını ve işlemleri yönetin
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Satışları Dışa Aktar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1eee3] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Gelir</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#effefa] flex items-center justify-center">
                <Ticket className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Satılan Biletler</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {totalTickets}
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
                  {statusCounts.pending}
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
                <p className="text-[12px] text-[#666d80]">İade Edilen</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {statusCounts.refunded}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
        {([
          "all",
          "confirmed",
          "pending",
          "cancelled",
          "refunded",
        ] as const).map((status) => (
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
            placeholder="Satış ara..."
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
                  <tr key={headerGroup.id} className="border-b border-[#e5e7eb]">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-left py-3 px-4">
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
                      Bilet satışı bulunamadı.
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
