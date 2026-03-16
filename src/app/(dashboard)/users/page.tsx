"use client";

export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect } from "react";
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
import { usersService } from "@/lib/api/services";
import type { BackendUser } from "@/lib/api/types/biletleme.types";
import type { UserListItem, UserRole, UserStatus } from "@/types/user.types";

const roleVariantMap: Record<UserRole, "success" | "info" | "neutral"> = {
  super_admin: "success",
  org_admin: "info",
  co_admin: "neutral",
};

const statusVariantMap: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  suspended: "warning",
  banned: "danger",
};

const roleLabels: Record<UserRole, string> = {
  super_admin: "Süper Admin",
  org_admin: "Organizatör Admini",
  co_admin: "Co-Admin",
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
  const [showActionsId, setShowActionsId] = useState<number | null>(null);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const response = await usersService.getAdminUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesRole && matchesStatus;
    });
  }, [users, roleFilter, statusFilter]);

  const columns = useMemo<ColumnDef<BackendUser>[]>(
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
            <p className="text-[14px] text-[#666d80]">{row.original.phone || "-"}</p>
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
            {row.original.role_label || roleLabels[row.original.role]}
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
          <Badge variant={statusVariantMap[row.original.status || "active"]}>
            {statusLabels[row.original.status || "active"]}
          </Badge>
        ),
      },
      {
        accessorKey: "created_at",
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
              {formatDate(row.original.created_at)}
            </p>
          </div>
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
    const counts = { all: users.length, super_admin: 0, org_admin: 0, co_admin: 0 };
    users.forEach((u) => {
      if (u.role) {
        counts[u.role]++;
      }
    });
    return counts;
  }, [users]);

  const statusCounts = useMemo(() => {
    const counts = { all: users.length, active: 0, suspended: 0, banned: 0 };
    users.forEach((u) => {
      if (u.status) {
        counts[u.status]++;
      }
    });
    return counts;
  }, [users]);

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
              <div className="w-12 h-12 rounded-xl bg-[#e1eee3] dark:bg-[#1a2e1f] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#09724a] dark:text-[#00fb90]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af]">Toplam Kullanıcı</p>
                <p className="text-[20px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                  {users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#effefa] dark:bg-[#1a2e2e] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#09724a] dark:text-[#00fb90]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af]">Aktif</p>
                <p className="text-[20px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                  {statusCounts.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff8f0] dark:bg-[#2e241a] flex items-center justify-center">
                <Ban className="w-6 h-6 text-[#d39c3d] dark:text-[#f5a623]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af]">Askıya Alındı</p>
                <p className="text-[20px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                  {statusCounts.suspended}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f3] dark:bg-[#2e1a1f] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#df1c41] dark:text-[#ff6b8a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af]">Org. Adminler</p>
                <p className="text-[20px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                  {roleCounts.org_admin}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] dark:border-[#374151]">
        {(["all", "super_admin", "org_admin", "co_admin"] as const).map(
          (role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                roleFilter === role
                  ? "border-[#09724a] text-[#09724a] dark:text-[#00fb90] dark:border-[#00fb90]"
                  : "border-transparent text-[#666d80] dark:text-[#9ca3af] hover:text-[#0d0d12] dark:hover:text-[#f9fafb]"
              }`}
            >
              {role === "super_admin"
                ? "Süper Adminler"
                : role === "org_admin"
                ? "Org. Adminler"
                : "Co-Adminler"}
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
                ? "bg-[#09724a] text-white dark:bg-[#00fb90] dark:text-[#0d0d12]"
                : "bg-[#f7f7f7] text-[#666d80] hover:text-[#0d0d12] dark:bg-[#1f2937] dark:text-[#9ca3af] dark:hover:text-[#f9fafb]"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898] dark:text-[#9ca3af]" />
          <Input
            type="search"
            placeholder="Kullanıcı ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 h-10 rounded-lg bg-[#f7f7f7] border-[#e5e7eb] dark:bg-[#1f2937] dark:border-[#374151] dark:text-[#f9fafb] dark:placeholder:text-[#6b7280]"
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
                    className="border-b border-[#e5e7eb] dark:border-[#374151] bg-[#f7f7f7] dark:bg-[#1f2937]"
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
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-[14px] text-[#666d80] dark:text-[#9ca3af]"
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-[14px] text-[#666d80] dark:text-[#9ca3af]"
                    >
                      Kullanıcı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[#e5e7eb] dark:border-[#374151] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2937] transition-colors"
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
          <div className="flex items-center justify-between p-4 border-t border-[#e5e7eb] dark:border-[#374151]">
            <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">
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
                      ? "bg-[#09724a] text-white dark:bg-[#00fb90] dark:text-[#0d0d12]"
                      : "text-[#666d80] hover:bg-[#f7f7f7] dark:text-[#9ca3af] dark:hover:bg-[#1f2937]"
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
