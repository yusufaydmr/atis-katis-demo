# Atık Yönetim Sistemi (Mobil)

Bu proje, mevcut Next.js tabanlı "Atık Yönetim Sistemi" web uygulamasının mobil (React Native / Expo) versiyonudur. Proje, web sürümündeki mimariyi, veri akışını ve tasarım dilini koruyarak mobil platformlara (iOS ve Android) uyarlanmıştır.

## 📱 Teknoloji Yığını

Bu projede kullanılan temel teknolojiler ve seçim nedenleri:

*   **Expo (Managed Workflow)**: Geliştirme sürecini hızlandırmak ve native modül konfigürasyonlarıyla uğraşmadan hızlıca prototipleme yapmak için seçildi.
*   **Expo Router**: Next.js App Router yapısına aşina olan geliştiriciler için benzer bir dosya tabanlı yönlendirme (file-based routing) deneyimi sunar. Bu sayede web projesindeki sayfa yapısı (`app/` klasörü) birebir mobiye taşınabildi.
*   **NativeWind**: Tailwind CSS'in React Native uyarlamasıdır. Web projesindeki görsel tasarım dilini ve utility sınıflarını (örneğin `bg-blue-600`, `p-4`) doğrudan React Native bileşenlerinde kullanmayı sağlar.
*   **Mock Context API**: Web projesindeki global state yönetim mantığı (`MockDataContext`) korunarak, uygulamanın durum yönetimi (state management) merkezi bir yapıya oturtuldu.

## 🏗 Mimari ve Kararlar

### 1. Veri Yönetimi (Migration Strategy)
Web projesindeki `MockDataContext.tsx` dosyası temel alınmıştır.
*   **Neden?**: İş mantığını (Business Logic) yeniden yazmak yerine, mevcut mantığı koruyarak sadece UI katmanını değiştirmek, hataları minimize eder ve tutarlılık sağlar.
*   **Uyarlama**: Web'deki `toast` bildirimleri yerine React Native'in `Alert` API'sı kullanılmıştır. Veriler in-memory (RAM) üzerinde tutulur, uygulama yeniden başlatıldığında sıfırlanır (Demo amaçlı).

### 2. UI Bileşenleri (Primitive Components)
Web projesinde kullanılan `shadcn/ui` kütüphanesinin mantığı korunarak, `components/ui` altında temel React Native bileşenleri oluşturulmuştur.
*   **Card**: İçerikleri gruplamak için.
*   **Button**: Etkileşimler için (Loading state desteği ile).
*   **Badge**: Durumları (Status) renk kodlarıyla göstermek için.
*   **Input**: Kullanıcı veri girişi için.

### 3. Rol Bazlı Erişim
Uygulama, farklı kullanıcı rollerine (Admin, Sender, Receiver, Security) göre özelleştirilmiş deneyimler sunar.
*   **Role Switcher**: Demo ortamında hızlı test yapılabilmesi için kullanıcının rolünü anlık olarak değiştirebilmesini sağlayan bir bileşen eklendi.
*   **Navigasyon**: Her rolün kendine ait bir "Dashboard" ekranı vardır ve `app/` dizini altında ayrı klasörlerde (`sender/`, `receiver/` vb.) organize edilmiştir.

### 4. PDF Oluşturma ve Paylaşım
Web'deki `window.print()` işlevi mobilde bulunmadığı için **Expo Print** ve **Expo Sharing** kütüphaneleri kullanılmıştır.
*   **Nasıl Çalışır?**: HTML şablonu string olarak hazırlanır, PDF'e dönüştürülür ve kullanıcının paylaşım menüsü açılır. Bu sayede "Sevk İrsaliyesi" veya "MOTAT Belgesi" fiziksel çıktı alınabilir veya dijital olarak paylaşılabilir.

## 🚀 Kurulum ve Çalıştırma

Projeyi çalıştırmak için aşağıdaki adımları izleyin:

1.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

2.  Projeyi başlatın:
    ```bash
    npm start
    ```

3.  Uygulamayı test edin:
    *   **Expo Go**: Telefonunuzdaki Expo Go uygulaması ile QR kodu taratın.
    *   **Simülatör**: `i` (iOS) veya `a` (Android) tuşlarına basarak emülatörde çalıştırın.

## 📂 Proje Yapısı

```
mobile-waste-management/
├── app/                  # Sayfalar ve Yönlendirme (Expo Router)
│   ├── admin/            # Yönetici ekranları
│   ├── receiver/         # Alıcı ekranları
│   ├── sender/           # Gönderici ekranları
│   ├── security/         # Güvenlik ekranları
│   ├── index.tsx         # Ana Karşılama Ekranı
│   └── _layout.tsx       # Global Layout ve Context Provider
├── components/           # UI Bileşenleri
│   ├── ui/               # Temel Bileşenler (Button, Card, Text vb.)
│   └── RoleSwitcher.tsx  # Rol Değiştirici
├── context/              # Global State (Mock Data)
├── data/                 # Örnek Veriler
└── types/                # TypeScript Tipleri
```
