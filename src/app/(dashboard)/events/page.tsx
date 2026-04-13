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
  Calendar,
  MapPin,
  Building2,
  Loader2,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";

const statusList: (EventStatus | "all")[] = ["all", "draft", "published", "cancelled", "completed", "ongoing"];

const statusConfig = {
  draft: { label: "Taslak", color: "text-warning", bg: "bg-warning/10", icon: Clock },
  published: { label: "Yayında", color: "text-success", bg: "bg-success/10", icon: CheckCircle },
  cancelled: { label: "İptal", color: "text-danger", bg: "bg-danger/10", icon: XCircle },
  completed: { label: "Tamamlandı", color: "text-info", bg: "bg-info/10", icon: CheckCircle },
  ongoing: { label: "Devam Ediyor", color: "text-primary", bg: "bg-primary/10", icon: Calendar },
};

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
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Etkinlik Adı
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="body-md font-medium text-on-surface">
                {row.original.title}
              </p>
              <p className="body-sm text-on-surface-variant">
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
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tarih & Saat
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="body-md text-on-surface-variant">
            {formatDate(row.original.start_date)}
          </p>
        ),
      },
      {
        accessorKey: "venue",
        header: () => (
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
            Konum
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-on-surface-variant" />
            <p className="body-md text-on-surface-variant">
              {row.original.venue?.name} - {row.original.venue?.city}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "organization",
        header: () => (
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
            Organizasyon
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-on-surface-variant" />
            <p className="body-md text-on-surface-variant">
              {row.original.organization?.name}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "sold_tickets",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
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
              <p className="body-md font-medium text-on-surface">
                {sold}/{total}
              </p>
              <div className="w-full h-1.5 bg-surface-low rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
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
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fiyat
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <p className="body-md font-semibold text-on-surface">
            {row.original.ticket_price ? formatCurrency(row.original.ticket_price) : "Ücretsiz"}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
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
                <Link
                  href={`/events/${row.original.id}`}
                  className="flex items-center gap-2 px-3 py-2 body-md text-on-surface hover:bg-surface-low transition-colors"
                  onClick={() => setShowActionsId(null)}
                >
                  <Eye className="w-4 h-4" />
                  Detayları Görüntüle
                </Link>
                <Link
                  href={`/events/${row.original.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 body-md text-on-surface hover:bg-surface-low transition-colors"
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
                  className="flex items-center gap-2 w-full px-3 py-2 body-md text-danger hover:bg-danger/10 transition-colors"
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
          <h1 className="headline-lg text-on-surface">
            Etkinlikler
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Tüm etkinliklerinizi ve detaylarını yönetin
          </p>
        </div>
        <Link href="/events/create">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Etkinlik Oluştur
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.all}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Ticket className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Yayında</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.published}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Taslak</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.draft}
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
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Tamamlandı</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.completed}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center shadow-sm">
              <XCircle className="w-7 h-7 text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-outline/30">
        {statusList.map((status) => {
          const config = status !== "all" ? statusConfig[status] : null;
          const Icon = config?.icon;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-3 body-md font-medium border-b-2 transition-colors ${
                statusFilter === status
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline/50"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {status === "all" ? "Tümü" : config.label}
              <span className="label-sm text-on-surface-variant">
                ({statusCounts[status]})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Etkinlik ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      {/* Table */}
      <Card variant="default" padding="none">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="body-md text-danger">{error}</p>
            </div>
          ) : (
            <>
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
                          className="text-center py-12"
                        >
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Ticket className="w-12 h-12 text-on-surface-variant" />
                            <p className="body-md text-on-surface-variant">Etkinlik bulunamadı</p>
                          </div>
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
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-danger text-white hover:bg-danger/90">
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
