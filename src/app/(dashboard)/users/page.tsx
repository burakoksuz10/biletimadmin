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
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Shield,
  ArrowUpDown,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  Users,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { mockUsers } from "@/lib/mock-data/users";
import type { UserListItem, UserRole, UserStatus } from "@/types/user.types";

const roleVariantMap: Record<UserRole, "success" | "info" | "neutral"> = {
  super_admin: "success",
  admin: "info",
  organizer: "neutral",
  attendee: "neutral",
};

const statusVariantMap: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  suspended: "warning",
  banned: "danger",
};

const roleLabels: Record<UserRole, string> = {
  super_admin: "Süper Admin",
  admin: "Admin",
  organizer: "Organizatör",
  attendee: "Katılımcı",
};

const statusLabels: Record<UserStatus, string> = {
  active: "Aktif",
  suspended: "Askıya Alındı",
  banned: "Yasaklandı",
};

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [showActionsId, setShowActionsId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesRole && matchesStatus;
    });
  }, [roleFilter, statusFilter]);

  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kullanıcı
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e1eee3] border border-[#09724a] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#09724a]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                {row.original.name}
              </p>
              <div className="flex items-center gap-1 text-[12px] text-[#666d80]">
                <Mail className="w-3 h-3" />
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            İletişim
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] text-[#666d80]">{row.original.phone}</p>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rol
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <Badge variant={roleVariantMap[row.original.role]} dot={false}>
            {roleLabels[row.original.role]}
          </Badge>
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
        accessorKey: "joinedDate",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[12px] font-medium text-[#818898] uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Katılma Tarihi
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#818898]" />
            <p className="text-[14px] text-[#666d80]">
              {formatDate(row.original.joinedDate)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "eventsCreated",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            Etkinlikler
          </span>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] font-medium text-[#0d0d12]">
            {row.original.eventsCreated || 0}
          </p>
        ),
      },
      {
        accessorKey: "ticketsPurchased",
        header: () => (
          <span className="text-[12px] font-medium text-[#818898] uppercase tracking-wider">
            Biletler
          </span>
        ),
        cell: ({ row }) => (
          <p className="text-[14px] font-medium text-[#0d0d12]">
            {row.original.ticketsPurchased || 0}
          </p>
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
                <Link
                  href={`/users/${row.original.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                  onClick={() => setShowActionsId(null)}
                >
                  <Eye className="w-4 h-4" />
                  Detayları Görüntüle
                </Link>
                <Link
                  href={`/users/${row.original.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                  onClick={() => setShowActionsId(null)}
                >
                  <Edit className="w-4 h-4" />
                  Düzenle
                </Link>
                {row.original.status === "active" && (
                  <button
                    onClick={() => setShowActionsId(null)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#d39c3d] hover:bg-[#fff8f0]"
                  >
                    <Ban className="w-4 h-4" />
                    Askıya Al
                  </button>
                )}
                {row.original.status !== "active" && (
                  <button
                    onClick={() => setShowActionsId(null)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#09724a] hover:bg-[#e1eee3]"
                  >
                    <Shield className="w-4 h-4" />
                    Etkinleştir
                  </button>
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

  const roleCounts = useMemo(() => {
    const counts = { all: mockUsers.length, super_admin: 0, admin: 0, organizer: 0, attendee: 0 };
    mockUsers.forEach((u) => {
      counts[u.role]++;
    });
    return counts;
  }, []);

  const statusCounts = useMemo(() => {
    const counts = { all: mockUsers.length, active: 0, suspended: 0, banned: 0 };
    mockUsers.forEach((u) => {
      counts[u.status]++;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">Kullanıcılar</h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Tüm kullanıcıları ve izinlerini yönetin
          </p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Kullanıcı Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1eee3] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Kullanıcı</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {mockUsers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#effefa] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Aktif</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {statusCounts.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff8f0] flex items-center justify-center">
                <Ban className="w-6 h-6 text-[#d39c3d]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Askıya Alındı</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {statusCounts.suspended}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f3] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#df1c41]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Organizatörler</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {roleCounts.organizer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
        {(["all", "super_admin", "admin", "organizer", "attendee"] as const).map(
          (role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                roleFilter === role
                  ? "border-[#09724a] text-[#09724a]"
                  : "border-transparent text-[#666d80] hover:text-[#0d0d12]"
              }`}
            >
              {role === "super_admin"
                ? "Süper Adminler"
                : role === "admin"
                ? "Adminler"
                : role === "organizer"
                ? "Organizatörler"
                : "Katılımcılar"}
              <span className="ml-2 text-[12px] text-[#818898]">
                ({roleCounts[role]})
              </span>
            </button>
          )
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "active", "suspended", "banned"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${
              statusFilter === status
                ? "bg-[#09724a] text-white"
                : "bg-[#f7f7f7] text-[#666d80] hover:text-[#0d0d12]"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1 text-[12px] opacity-75">
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
            placeholder="Kullanıcı ara..."
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
                      Kullanıcı bulunamadı.
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
