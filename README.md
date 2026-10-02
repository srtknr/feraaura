# feraaura

El yapımı ürünler için vitrin sitesi ve yönetim paneli. Tek bir Next.js uygulaması; veritabanı Prisma ve PostgreSQL, görseller dosya olarak saklanır.

## Kurulum

```bash
npm install
docker compose up -d
cp .env.example .env
npm run db:setup
npm run dev
```

Docker yoksa ve makinede PostgreSQL çalışıyorsa `feraaura` kullanıcısı ve veritabanını oluşturup `DATABASE_URL` içindeki portu `5432` yapın. `docker-compose.yml` çakışmasın diye `5433` kullanır.

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır.

Yönetim: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Yerel örnek giriş (seed):

- E-posta: `admin@feraaura.com`
- Şifre: `.env` içindeki `ADMIN_PASSWORD` (örnek dosyada yoksa seed varsayılanı `Feraaura2026!`)

`db:setup` migrasyonu uygular ve örnek kategorileri, ürünleri, ana sayfa metinlerini ve site ayarlarını yükler. Seed’i yeniden çalıştırmak demo içeriği sıfırlar.

## Ortam değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantısı |
| `AUTH_SECRET` | Oturum imzası, en az 16 karakter |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed ile oluşan yönetici |
| `STORAGE_PROVIDER` | Şu an `local`. Görseller `public/uploads` altına yazılır |
| `NEXT_PUBLIC_SITE_URL` | Sitemap ve Open Graph için site adresi |

Üretim parolalarını ve `AUTH_SECRET` değerini repoya koymayın.

## Görseller

Veritabanında yalnızca adres ve kısa bilgi durur. Yükleme `lib/storage` üzerinden gider. Yerel sağlayıcı dosyayı diske yazar. Cloudinary, S3 veya Supabase eklemek için `StorageProvider` arayüzüne uyan yeni bir sınıf yazıp `lib/storage/index.ts` içinden seçmek yeter.

## Komutlar

```bash
npm run dev
npm run build
npm run lint
npm run db:migrate
npm run db:seed
```
