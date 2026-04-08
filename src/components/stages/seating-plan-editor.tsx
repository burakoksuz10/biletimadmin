"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Monitor, Users, Minus, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { seatTypesService, stagesService } from "@/lib/api/services";
import type { SeatType } from "@/lib/api/services/seat-types.service";

// Dinamik renk paleti - her koltuk tipi için farklı renk
const SEAT_TYPE_COLOR_PALETTE = [
  "bg-[#e5e7eb] hover:bg-[#d1d5db]", // Standart gri
  "bg-[#fef3c7] hover:bg-[#fde68a]", // Sarı (VIP)
  "bg-[#dbeafe] hover:bg-[#bfdbfe]", // Mavi (Engelli)
  "bg-[#dcfce7] hover:bg-[#bbf7d0]", // Yeşil
  "bg-[#fae8ff] hover:bg-[#f0abfc]", // Mor
  "bg-[#fed7aa] hover:bg-[#fdba74]", // Turuncu
  "bg-[#fecdd3] hover:bg-[#fda4af]", // Pembe
  "bg-[#e9d5ff] hover:bg-[#d8b4fe]", // Açık mor
];

function getSeatTypeColor(seatTypeId: number, seatTypes: SeatType[]): string {
  const index = seatTypes.findIndex((t) => t.id === seatTypeId);
  return SEAT_TYPE_COLOR_PALETTE[index % SEAT_TYPE_COLOR_PALETTE.length] || SEAT_TYPE_COLOR_PALETTE[0];
}

// Hücre tipleri
type CellType = "seat" | "aisle" | "stage" | "empty";

interface GridCell {
  row: number;
  col: number;
  type: CellType;
  seatTypeId?: number;
  seatTypeName?: string;
}

interface SeatingPlanEditorProps {
  venueId: number;
  stageId: number;
  stageName: string;
  onSave?: (seats: any[]) => void;
  onCancel?: () => void;
}

// Sabit araçlar
const FIXED_TOOLS = [
  { type: "stage" as CellType, icon: Monitor, label: "Sahne", color: "bg-purple-100" },
  { type: "aisle" as CellType, icon: Minus, label: "Koridor", color: "bg-gray-100" },
  { type: "empty" as CellType, icon: Trash2, label: "Temizle", color: "bg-red-50" },
];

export function SeatingPlanEditor({ venueId, stageId, stageName, onSave, onCancel }: SeatingPlanEditorProps) {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(15);
  const [grid, setGrid] = useState<Map<string, GridCell>>(new Map());
  const [selectedTool, setSelectedTool] = useState<CellType>("seat");
  const [selectedSeatTypeId, setSelectedSeatTypeId] = useState<number | null>(null);

  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Yeni koltuk tipi formu
  const [showNewSeatTypeForm, setShowNewSeatTypeForm] = useState(false);
  const [newSeatTypeName, setNewSeatTypeName] = useState("");
  const [newSeatTypeDescription, setNewSeatTypeDescription] = useState("");
  const [isCreatingSeatType, setIsCreatingSeatType] = useState(false);

  // Koltuk tiplerini yükle
  const loadSeatTypes = useCallback(async () => {
    try {
      const types = await seatTypesService.getActive();
      setSeatTypes(types);
      // Varsayılan olarak ilk tipi seç
      if (types.length > 0 && !selectedSeatTypeId) {
        setSelectedSeatTypeId(types[0].id);
      }
    } catch (err) {
      console.error("Failed to load seat types:", err);
    } finally {
      setIsLoadingTypes(false);
    }
  }, [selectedSeatTypeId]);

  useEffect(() => {
    loadSeatTypes();
  }, [loadSeatTypes]);

  // Grid oluşturucu
  const initializeGrid = useCallback((newRows: number, newCols: number) => {
    setGrid((prevGrid) => {
      const newGrid = new Map<string, GridCell>();
      for (let r = 0; r < newRows; r++) {
        for (let c = 0; c < newCols; c++) {
          const key = `${r}-${c}`;
          const existingCell = prevGrid.get(key);
          if (existingCell) {
            newGrid.set(key, existingCell);
          } else {
            newGrid.set(key, { row: r, col: c, type: "empty" });
          }
        }
      }
      return newGrid;
    });
  }, []);

  // Grid boyutu değiştiğinde
  useEffect(() => {
    initializeGrid(rows, cols);
  }, [rows, cols, initializeGrid]);

  // Hücreye tıklama
  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    const newGrid = new Map(grid);

    if (selectedTool === "empty") {
      newGrid.set(key, { row, col, type: "empty" });
    } else if (selectedTool === "stage" || selectedTool === "aisle") {
      newGrid.set(key, { row, col, type: selectedTool });
    } else if (selectedTool === "seat" && selectedSeatTypeId) {
      // Seçili koltuk tipini kullan
      const seatType = seatTypes.find((t) => t.id === selectedSeatTypeId);
      newGrid.set(key, {
        row,
        col,
        type: "seat",
        seatTypeId: selectedSeatTypeId,
        seatTypeName: seatType?.name,
      });
    }

    setGrid(newGrid);
  };

  // Tıklama ile sürükle
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      handleCellClick(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Satır etiketi hesaplama (A, B, C...)
  const getRowLabel = (rowIndex: number) => {
    return String.fromCharCode(65 + rowIndex);
  };

  // Yeni koltuk tipi oluştur
  const handleCreateSeatType = async () => {
    if (!newSeatTypeName.trim()) {
      setError("Koltuk tipi adı boş olamaz");
      return;
    }

    try {
      setIsCreatingSeatType(true);
      setError(null);

      const newType = await seatTypesService.create({
        name: newSeatTypeName.trim(),
        description: newSeatTypeDescription.trim() || undefined,
        is_active: true,
      });

      setSeatTypes((prev) => [...prev, newType]);
      setSelectedSeatTypeId(newType.id);
      setSelectedTool("seat");

      // Formu temizle
      setNewSeatTypeName("");
      setNewSeatTypeDescription("");
      setShowNewSeatTypeForm(false);
    } catch (err: any) {
      console.error("Failed to create seat type:", err);
      const apiError = err?.response?.data || err?.data;
      const errorMessage = apiError?.message || err?.message || "Koltuk tipi oluşturulamadı";
      setError(errorMessage);
    } finally {
      setIsCreatingSeatType(false);
    }
  };

  // Kaydet
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Grid'den koltukları topla ve (row_label, seat_type_id) bazında grupla
      const groupedSeats = new Map<string, { row_label: string; seat_type_id: number; numbers: number[] }>();

      grid.forEach((cell) => {
        if (cell.type === "seat" && cell.seatTypeId) {
          const rowLabel = getRowLabel(cell.row);
          const key = `${rowLabel}-${cell.seatTypeId}`;

          if (!groupedSeats.has(key)) {
            groupedSeats.set(key, {
              row_label: rowLabel,
              seat_type_id: cell.seatTypeId,
              numbers: [],
            });
          }
          groupedSeats.get(key)!.numbers.push(cell.col + 1);
        }
      });

      if (groupedSeats.size === 0) {
        setError("Lütfen en az bir koltuk ekleyin");
        return;
      }

      // Her grup için ardışık aralıkları bul
      const bulkPayload: any[] = [];

      groupedSeats.forEach((group) => {
        const sorted = [...group.numbers].sort((a, b) => a - b);

        // Ardışık aralıkları tespit et
        let start = sorted[0];
        let end = sorted[0];

        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i] === end + 1) {
            end = sorted[i];
          } else {
            // Aralık bitti, ekle
            bulkPayload.push({
              row_label: group.row_label,
              seat_type_id: group.seat_type_id,
              start_number: start,
              end_number: end,
            });
            start = sorted[i];
            end = sorted[i];
          }
        }
        // Son aralığı ekle
        bulkPayload.push({
          row_label: group.row_label,
          seat_type_id: group.seat_type_id,
          start_number: start,
          end_number: end,
        });
      });

      console.log("Saving seats (bulk ranges):", { venueId, stageId, payload: bulkPayload });

      // Her aralığı ayrı ayrı gönder
      for (let i = 0; i < bulkPayload.length; i++) {
        const payload = bulkPayload[i];
        console.log(`Sending range ${i + 1}/${bulkPayload.length}:`, payload);
        try {
          await stagesService.createBulkSeats(venueId, stageId, payload);
        } catch (rangeErr: any) {
          const errMsg = rangeErr?.message || '';
          // Duplicate key hatası - koltuklar zaten var
          if (errMsg.includes('Duplicate') || errMsg.includes('1062')) {
            throw new Error(`${payload.row_label} satırı ${payload.start_number}-${payload.end_number} numaralı koltuklar zaten mevcut. Backend'de upsert desteği gerekli.`);
          }
          throw new Error(`${payload.row_label} satırı ${payload.start_number}-${payload.end_number} kaydedilemedi: ${errMsg}`);
        }
      }

      onSave?.(bulkPayload);
    } catch (err: any) {
      console.error("Failed to save seating plan - Full error:", err);

      // API'den gelen detaylı hata mesajını al
      let errorMessage = "Oturma planı kaydedilemedi";

      const errorData = err?.response?.data || err?.responseData || err?.data;

      console.error("Full error object:", err);
      console.error("Response data (full):", JSON.stringify(errorData, null, 2));

      if (errorData) {
        console.error("Error data details:", errorData);

        if (errorData?.errors) {
          const errorKeys = Object.keys(errorData.errors);
          if (errorKeys.length > 0) {
            const firstError = errorData.errors[errorKeys[0]];
            errorMessage = Array.isArray(firstError) ? firstError.join(', ') : firstError;
          }
        } else if (errorData?.message) {
          errorMessage = errorData.message;
          // 500 hatası için backend'in detaylı mesajını göster
          if (err?.status === 500) {
            if (errorData?.exception) {
              console.error("Server exception:", errorData.exception);
              errorMessage = `Backend hatası: ${errorData.exception}`;
            }
            if (errorData?.trace) {
              console.error("Server trace:", errorData.trace);
            }
          }
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Seçili araç tipine göre renk
  const getToolColor = (tool: CellType, seatTypeId?: number) => {
    if (tool === "stage") return "bg-purple-200";
    if (tool === "aisle") return "bg-gray-300";
    if (tool === "empty") return "bg-red-100";
    if (seatTypeId) return getSeatTypeColor(seatTypeId, seatTypes);
    return "bg-gray-300";
  };

  // Grid hücresi için renk hesaplama
  const getCellColor = (cell: GridCell | undefined) => {
    if (!cell || cell.type === "empty") return "bg-gray-100";
    if (cell.type === "stage") return "bg-[#f3e8ff] hover:bg-[#e9d5ff]";
    if (cell.type === "aisle") return "bg-white border-2 border-dashed border-gray-300";
    if (cell.type === "seat" && cell.seatTypeId) {
      return getSeatTypeColor(cell.seatTypeId, seatTypes);
    }
    return "bg-gray-100";
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold">{stageName}</h2>
          <p className="text-[14px] text-[#666d80]">Oturma planı düzenleyin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            İptal
          </Button>
          <Button
            className="bg-[#09724a] hover:bg-[#066d41]"
            onClick={handleSave}
            disabled={isSaving || isLoadingTypes}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Ayarları */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Satır:</label>
              <Input
                type="number"
                min={1}
                max={50}
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sütun:</label>
              <Input
                type="number"
                min={1}
                max={50}
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-20"
              />
            </div>
            <Button variant="secondary" onClick={() => initializeGrid(rows, cols)}>
              Grid Oluştur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Araç Çubuğu */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium mr-2">Araçlar:</span>

            {/* Sabit araçlar */}
            {FIXED_TOOLS.map((tool) => (
              <button
                key={tool.type}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                  ${selectedTool === tool.type ? "border-[#09724a] " + tool.color : "border-gray-200 hover:border-gray-300"}
                `}
                onClick={() => setSelectedTool(tool.type)}
              >
                <tool.icon className="w-4 h-4" />
                <span className="text-sm">{tool.label}</span>
              </button>
            ))}

            <div className="w-px h-8 bg-gray-300 mx-2" />

            {/* API'den gelen koltuk tipleri */}
            {isLoadingTypes ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {seatTypes.map((seatType) => (
                  <button
                    key={seatType.id}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                      ${selectedSeatTypeId === seatType.id && selectedTool === "seat"
                        ? "border-[#09724a] " + getToolColor("seat", seatType.id)
                        : "border-gray-200 hover:border-gray-300"}
                      ${getSeatTypeColor(seatType.id, seatTypes).split(" ")[0]}
                    `}
                    onClick={() => {
                      setSelectedTool("seat");
                      setSelectedSeatTypeId(seatType.id);
                    }}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{seatType.name}</span>
                  </button>
                ))}

                {/* Yeni koltuk tipi ekle butonu */}
                {!showNewSeatTypeForm && (
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#09724a] hover:bg-green-50 transition-all text-gray-500 hover:text-[#09724a]"
                    onClick={() => setShowNewSeatTypeForm(true)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Yeni Tip</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Yeni Koltuk Tipi Formu */}
          {showNewSeatTypeForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Yeni Koltuk Tipi</h4>
                <button
                  onClick={() => {
                    setShowNewSeatTypeForm(false);
                    setNewSeatTypeName("");
                    setNewSeatTypeDescription("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Koltuk tipi adı (örn: VIP, Premium)"
                  value={newSeatTypeName}
                  onChange={(e) => setNewSeatTypeName(e.target.value)}
                  className="flex-1"
                  disabled={isCreatingSeatType}
                />
                <Input
                  placeholder="Açıklama (opsiyonel)"
                  value={newSeatTypeDescription}
                  onChange={(e) => setNewSeatTypeDescription(e.target.value)}
                  className="flex-1"
                  disabled={isCreatingSeatType}
                />
                <Button
                  onClick={handleCreateSeatType}
                  disabled={isCreatingSeatType || !newSeatTypeName.trim()}
                  className="bg-[#09724a] hover:bg-[#066d41]"
                >
                  {isCreatingSeatType ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ekle"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Bilgi */}
          <div className="mt-4 text-xs text-[#666d80]">
            Bir aracı seçin ve grid hücrelerine tıklayarak yerleştirin. Sürükle ile toplu işaretlemek için tıklı basılı tutun.
            Her koltuk tipi otomatik olarak farklı renkte gösterilir.
          </div>
        </CardContent>
      </Card>

      {/* Koltuk Tipi Legend */}
      {seatTypes.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-[#666d80]">Koltuk Tipleri:</span>
              {seatTypes.map((seatType) => (
                <div key={seatType.id} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded border ${getSeatTypeColor(seatType.id, seatTypes).split(" ")[0]}`} />
                  <span className="text-sm text-[#666d80]">{seatType.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Sütun numaraları */}
              <div className="flex ml-8 mb-2">
                {Array.from({ length: cols }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-6 flex items-center justify-center text-xs text-[#666d80]"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex items-center">
                    {/* Satır etiketi */}
                    <div className="w-8 h-10 flex items-center justify-center text-sm font-medium text-[#666d80]">
                      {getRowLabel(rowIndex)}
                    </div>

                    {/* Hücreler */}
                    {Array.from({ length: cols }).map((_, colIndex) => {
                      const key = `${rowIndex}-${colIndex}`;
                      const cell = grid.get(key);

                      let cellType = cell?.type || "empty";
                      let cellContent = null;

                      if (cellType === "stage") {
                        cellContent = "🎭";
                      } else if (cellType === "aisle") {
                        cellContent = null;
                      } else if (cellType === "seat") {
                        cellContent = (
                          <div className="w-4 h-4 rounded-full bg-current opacity-50" />
                        );
                      }

                      const isSelected =
                        (selectedTool === "empty" && cellType === "empty") ||
                        (selectedTool === "stage" && cellType === "stage") ||
                        (selectedTool === "aisle" && cellType === "aisle") ||
                        (selectedTool === "seat" && cell?.seatTypeId === selectedSeatTypeId);

                      return (
                        <div
                          key={key}
                          className={`
                            w-10 h-10 border border-gray-200 flex items-center justify-center cursor-pointer transition-all
                            ${getCellColor(cell)}
                            ${isSelected ? "ring-2 ring-[#09724a]" : ""}
                          `}
                          onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                          onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        >
                          {cellContent}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
