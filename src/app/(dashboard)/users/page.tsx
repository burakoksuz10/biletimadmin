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
  Loader2,
  ShieldCheck,
  UserCog,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { usersService } from "@/lib/api/services";
import type { BackendUser } from "@/lib/api/types/biletleme.types";
import type { UserRole, UserStatus } from "@/types/user.types";

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
  org_admin: "Org. Admin",
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
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kullanıcı
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="body-md font-medium text-on-surface">
                {row.original.name}
              </p>
              <div className="flex items-center gap-1 body-sm text-on-surface-variant">
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
          <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
            İletişim
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-on-surface-variant" />
            <p className="body-md text-on-surface-variant">{row.original.phone || "-"}</p>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
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
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
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
            className="flex items-center gap-1 label-sm font-semibold text-on-surface-variant uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Katılma Tarihi
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            <p className="body-md text-on-surface-variant">
              {formatDate(row.original.created_at)}
            </p>
          </div>
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
                  href={`/users/${row.original.id}`}
                  className="flex items-center gap-2 px-3 py-2 body-md text-on-surface hover:bg-surface-low transition-colors"
                  onClick={() => setShowActionsId(null)}
                >
                  <Eye className="w-4 h-4" />
                  Detayları Görüntüle
                </Link>
                <Link
                  href={`/users/${row.original.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 body-md text-on-surface hover:bg-surface-low transition-colors"
                  onClick={() => setShowActionsId(null)}
                >
                  <Edit className="w-4 h-4" />
                  Düzenle
                </Link>
                {row.original.status === "active" && (
                  <button
                    onClick={() => setShowActionsId(null)}
                    className="flex items-center gap-2 w-full px-3 py-2 body-md text-warning hover:bg-warning/10 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Askıya Al
                  </button>
                )}
                {row.original.status !== "active" && (
                  <button
                    onClick={() => setShowActionsId(null)}
                    className="flex items-center gap-2 w-full px-3 py-2 body-md text-success hover:bg-success/10 transition-colors"
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
          <h1 className="headline-lg text-on-surface">
            Kullanıcılar
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Tüm kullanıcıları ve izinlerini yönetin
          </p>
        </div>
        <Button variant="primary">
          <UserCog className="w-4 h-4 mr-2" />
          Kullanıcı Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam</p>
              <p className="display-lg text-on-surface leading-none">
                {users.length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Users className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Aktif</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.active}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-7 h-7 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Org. Admin</p>
              <p className="display-lg text-on-surface leading-none">
                {roleCounts.org_admin}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center shadow-sm">
              <Crown className="w-7 h-7 text-info" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Askıya Alındı</p>
              <p className="display-lg text-on-surface leading-none">
                {statusCounts.suspended}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center shadow-sm">
              <Ban className="w-7 h-7 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 border-b border-outline/30">
        {(["all", "super_admin", "org_admin", "co_admin"] as const).map(
          (role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-3 body-md font-medium border-b-2 transition-colors ${
                roleFilter === role
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline/50"
              }`}
            >
              {role === "super_admin"
                ? "Süper Admin"
                : role === "org_admin"
                ? "Org. Admin"
                : "Co-Admin"}
              <span className="ml-2 body-sm text-on-surface-variant">
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
            className={`px-3 py-1.5 rounded-lg body-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-gradient-primary text-white shadow-glow"
                : "bg-surface-low text-on-surface-variant hover:text-on-surface hover:bg-surface-low/80"
            }`}
          >
            {status === "all"
              ? "Tümü"
              : status === "active"
              ? "Aktif"
              : status === "suspended"
              ? "Askıda"
              : "Yasaklı"}
            <span className="ml-1 label-sm opacity-75">
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
            placeholder="Kullanıcı ara..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          Filtreler
        </Button>
      </div>

      {/* Table */}
      <Card variant="default" padding="none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
                            <UserCog className="w-12 h-12 text-on-surface-variant" />
                            <p className="body-md text-on-surface-variant">Kullanıcı bulunamadı</p>
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
    </div>
  );
}
