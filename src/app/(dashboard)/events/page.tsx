"use client";

export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import Link from "next/link";
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
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter,
  Calendar,
  MapPin,
  Building,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { useEvents, useEventMutations } from "@/lib/hooks/use-events";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Event, EventStatus } from "@/lib/api/types/biletleme.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusList: (EventStatus | "all")[] = ["all", "draft", "published", "cancelled", "completed", "ongoing"];

export default function EventsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [showActionsId, setShowActionsId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const { events, loading, error, refresh } = useEvents();
  const { deleteEvent, deleting } = useEventMutations();

  // Filter events by status
  const filteredData = useMemo(() => {
    return statusFilter === "all"
      ? events
      : events.filter((event) => event.status === statusFilter);
  }, [events, statusFilter]);

  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Etkinlik Adı
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e1eee3] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#09724a]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                {row.original.title}
              </p>
              <p className="text-[12px] text-[#666d80]">
                {row.original.category?.name}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "start_date",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tarih & Saat
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] text-[#666d80]">
            {formatDate(row.original.start_date)}
          </p>
        ),
      },
      {
        accessorKey: "venue",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            Konum
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] text-[#666d80]">
              {row.original.venue?.name} - {row.original.venue?.city}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "organization",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            Organizasyon
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] text-[#666d80]">
              {row.original.organization?.name}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "sold_tickets",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Biletler
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => {
          const sold = row.original.sold_tickets || 0;
          const total = row.original.total_tickets || 0;
          const percentage = total > 0 ? Math.round((sold / total) * 100) : 0;
          
          return (
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                {sold}/{total}
              </p>
              <div className="w-full h-1.5 bg-[#f7f7f7] rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#09724a] rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "ticket_price",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fiyat
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] font-semibold text-[#0d0d12]">
            {row.original.ticket_price ? formatCurrency(row.original.ticket_price) : "Ücretsiz"}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            Durum
          </span>
        ),
        cell: ({ row }) => (
          <EventStatusBadge status={row.original.status} />
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
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-[#e5e7eb] shadow-lg py-1 z-10">
                <Link
                  href={`/events/${row.original.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                  onClick={() => setShowActionsId(null)}
                >
                  <Eye className="w-4 h-4" />
                  Detayları Görüntüle
                </Link>
                <Link
                  href={`/events/${row.original.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                  onClick={() => setShowActionsId(null)}
                >
                  <Edit className="w-4 h-4" />
                  Düzenle
                </Link>
                <button
                  onClick={() => {
                    setEventToDelete(row.original.id);
                    setDeleteDialogOpen(true);
                    setShowActionsId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#df1c41] hover:bg-[#fff0f3]"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
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
    const counts = { all: events.length, draft: 0, published: 0, cancelled: 0, completed: 0, ongoing: 0 };
    events.forEach((e) => {
      counts[e.status]++;
    });
    return counts;
  }, [events]);

  const handleDelete = async () => {
    if (eventToDelete) {
      const success = await deleteEvent(eventToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setEventToDelete(null);
        refresh();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">Etkinlikler</h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Tüm etkinliklerinizi ve detaylarını yönetin
          </p>
        </div>
        <Link href="/events/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Etkinlik Oluştur
          </Button>
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
        {statusList.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
              statusFilter === status
                ? "border-[#09724a] text-[#09724a]"
                : "border-transparent text-[#666d80] hover:text-[#0d0d12]"
            }`}
          >
            {status === "all" ? "Tümü" : status.charAt(0).toUpperCase() + status.slice(1)}
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
            placeholder="Etkinlik ara..."
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#09724a]" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-[14px] text-[#df1c41]">{error}</p>
            </div>
          ) : (
            <>
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
                          Etkinlik bulunamadı.
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etkinliği Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Evet, Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
