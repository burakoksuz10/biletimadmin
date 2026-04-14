"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, MapPin, Building, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventSchema, type EventFormValues } from "@/lib/validations/event.schema";
import { useEventCategories } from "@/lib/hooks/use-events";
import { venuesService, organizationsService, eventsService } from "@/lib/api/services";
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  Organization,
  Venue,
  EventCategory
} from "@/lib/api/types/biletleme.types";

interface EventFormProps {
  event?: Event;
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const { categories, loading: categoriesLoading } = useEventCategories();

  const isEditing = !!event;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      short_description: event?.short_description || "",
      organization_id: event?.organization_id || 0,
      venue_id: event?.venue_id || 0,
      category_id: event?.category_id || 0,
      start_date: event?.start_date ? event.start_date.slice(0, 16) : "",
      end_date: event?.end_date ? event.end_date.slice(0, 16) : "",
      featured_image: event?.featured_image || "",
      ticket_price: event?.ticket_price || null,
      total_tickets: event?.total_tickets || null,
      min_tickets_per_order: event?.min_tickets_per_order || null,
      max_tickets_per_order: event?.max_tickets_per_order || null,
      is_featured: event?.is_featured || false,
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [orgsData, venuesData] = await Promise.all([
          organizationsService.getAll(),
          venuesService.getAll(),
        ]);
        setOrganizations(orgsData.data || []);
        setVenues(venuesData.data || []);
      } catch (err) {
        console.error("Failed to fetch form options:", err);
      }
    };

    fetchOptions();
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestData: CreateEventRequest | UpdateEventRequest = {
        title: values.title,
        description: values.description || undefined,
        short_description: values.short_description || undefined,
        organization_id: values.organization_id,
        venue_id: values.venue_id,
        category_id: values.category_id,
        start_date: values.start_date,
        end_date: values.end_date,
        featured_image: values.featured_image || undefined,
        ticket_price: values.ticket_price ?? undefined,
        total_tickets: values.total_tickets ?? undefined,
        min_tickets_per_order: values.min_tickets_per_order ?? undefined,
        max_tickets_per_order: values.max_tickets_per_order ?? undefined,
        is_featured: values.is_featured,
      };

      let result: Event;

      if (isEditing && event) {
        result = await eventsService.update(event.id, requestData);
      } else {
        result = await eventsService.create(requestData as CreateEventRequest);
      }

      onSuccess?.(result);
    } catch (err: any) {
      console.error("Failed to save event:", err);

      if (err?.errors) {
        Object.keys(err.errors).forEach((field) => {
          if (field in form.getValues()) {
            form.setError(field as keyof EventFormValues, {
              type: "server",
              message: Array.isArray(err.errors[field])
                ? err.errors[field][0]
                : err.errors[field],
            });
          }
        });
      }

      const errorMessage = err?.message || "Bir hata oluştu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Error message - Glassmorphism style */}
        {error && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-danger/10 backdrop-blur-glass animate-fade-in">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <p className="body-md text-danger">{error}</p>
          </div>
        )}

        {/* Basic Info Section - Surface layering */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <h3 className="headline-sm text-on-surface">Temel Bilgiler</h3>
          </div>

          <div className="grid gap-5 pl-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etkinlik Adı *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Örn: İstanbul Caz Festivali"
                      error={!!form.formState.errors.title}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kısa Açıklama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Etkinlik hakkında kısa açıklama (max 255 karakter)"
                      error={!!form.formState.errors.short_description}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {(field.value?.length || 0)}/255 karakter
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Etkinlik hakkında detaylı açıklama"
                      className="min-h-[120px]"
                      error={!!form.formState.errors.description}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Organization, Venue, Category Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-secondary to-primary" />
            <h3 className="headline-sm text-on-surface">Konum ve Organizasyon</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pl-4">
            <FormField
              control={form.control}
              name="organization_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizasyon *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger error={!!form.formState.errors.organization_id}>
                        <SelectValue placeholder="Organizasyon seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={String(org.id)}>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {org.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mekan *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger error={!!form.formState.errors.venue_id}>
                        <SelectValue placeholder="Mekan seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={String(venue.id)}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {venue.name} - {venue.city}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                    value={field.value ? String(field.value) : undefined}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger error={!!form.formState.errors.category_id}>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Date Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <h3 className="headline-sm text-on-surface">Tarih ve Saat</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlangıç Tarihi *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      error={!!form.formState.errors.start_date}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bitiş Tarihi *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      error={!!form.formState.errors.end_date}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Ticket Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-secondary to-primary" />
            <h3 className="headline-sm text-on-surface">Bilet Bilgileri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pl-4">
            <FormField
              control={form.control}
              name="ticket_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bilet Fiyatı (₺)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      error={!!form.formState.errors.ticket_price}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_tickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toplam Bilet</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      error={!!form.formState.errors.total_tickets}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_tickets_per_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Bilet/Sipariş</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      error={!!form.formState.errors.min_tickets_per_order}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_tickets_per_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max. Bilet/Sipariş</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="10"
                      error={!!form.formState.errors.max_tickets_per_order}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Media & Settings Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <h3 className="headline-sm text-on-surface">Medya ve Ayarlar</h3>
          </div>

          <div className="grid gap-5 pl-4">
            <FormField
              control={form.control}
              name="featured_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapak Görseli URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      error={!!form.formState.errors.featured_image}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Etkinlik kapak görseli için bir URL girin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Öne Çıkan Etkinlik</FormLabel>
                    <FormDescription>
                      Bu etkinlik ana sayfada öne çıkarılacak
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Actions - No border, surface separation */}
        <div className="flex justify-end gap-4 pt-8">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              İptal
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Güncelleniyor..." : "Oluşturuluyor..."}
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                {isEditing ? "Etkinliği Güncelle" : "Etkinlik Oluştur"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
