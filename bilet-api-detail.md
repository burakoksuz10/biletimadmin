========================================
  Starting Database Seeding
========================================

  Database\Seeders\SuperAdminSeeder .................................. RUNNING
✓ Super Admin user created successfully.
  Email: superadmin@biletix.com
  Password: password
  Please change the password after first login!
  Database\Seeders\SuperAdminSeeder .............................. 291 ms DONE

  Database\Seeders\UserSeeder ........................................ RUNNING
✓ Customers created successfully.
  Email: ahmet@user.com
  Password: password
  Email: ayse@user.com
  Password: password
  Database\Seeders\UserSeeder .................................... 578 ms DONE

  Database\Seeders\EventCategorySeeder ............................... RUNNING
  Database\Seeders\EventCategorySeeder ............................. 5 ms DONE

  Database\Seeders\OrganizationAndUserSeeder ......................... RUNNING
✓ Organization A (BKM) and admin created.
✓ Organization B (Zorlu PSM) and admin created.
✓ Organization C (Anadolu Gösteri) and admin created.
✓ Organization D (Ege Etkinlik) and admin created.

Organization IDs for reference:
  BKM (A): 1
  Zorlu PSM (B): 2
  Anadolu (C): 3
  Ege (D): 4
  Database\Seeders\OrganizationAndUserSeeder ................... 1,180 ms DONE

  Database\Seeders\VenueAndEventSeeder ............................... RUNNING
  ✓ BKM: 2 venues, 3 events created
  ✓ Zorlu PSM: 1 venue, 2 events created
  ✓ Anadolu Gösteri: 1 venue, 2 events created
  ✓ Ege Etkinlik: 1 venue, 2 events created

✓ All venues and events created successfully.
  Database\Seeders\VenueAndEventSeeder ............................ 31 ms DONE

  Database\Seeders\CoAdminSeeder ..................................... RUNNING

✓ Co-Admin user created successfully.
  Email: coadmin@biletleme.com
  Password: password
  Role: CO_ADMIN

  Accessible Organizations:
    - Anadolu Gösteri Grubu (ID: 3)
    - Ege Etkinlik Grubu (ID: 4)

  This user can ONLY manage Anadolu Gösteri Grubu and Ege Etkinlik Grubu.
  BKM and Zorlu PSM data will NOT be visible to this user.
  Database\Seeders\CoAdminSeeder ................................. 300 ms DONE


========================================
  Database Seeding Completed!
========================================

Test Users Created:
┌─────────────────────────────────────────────────────────────────┐
│ Role          │ Email                    │ Password  │ Access   │
├─────────────────────────────────────────────────────────────────┤
│ SUPER_ADMIN   │ superadmin@biletix.com   │ password  │ ALL DATA │
│ ORG_ADMIN     │ bkm@admin.com            │ password  │ BKM only │
│ ORG_ADMIN     │ zorlu@admin.com          │ password  │ Zorlu    │
│ ORG_ADMIN     │ anadolu@admin.com        │ password  │ Anadolu  │
│ ORG_ADMIN     │ ege@admin.com            │ password  │ Ege      │
│ CO_ADMIN      │ coadmin@biletleme.com    │ password  │ Anadolu+ │
│                                                      │ Ege      │
└─────────────────────────────────────────────────────────────────┘


Endpointler

- Organizasyonları listeleme
{{base_url}}/api/v1/organizations

- Organizasyon Detail
{{base_url}}/api/v1/organizations/{id}

- Mekanları Listeleme
{{base_url}}/api/v1/venues

- Mekan Detail
{{base_url}}/api/v1/venues/{id}

- Etkinlikler
{{base_url}}/api/v1/events

- Etkinlik Detay
{{base_url}}/api/v1/events/{id}

- Etkinlik Kategorileri
/api/v1/event-categories