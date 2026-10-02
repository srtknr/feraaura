import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function photo(id: string, width = 1800) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@feraaura.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Feraaura2026!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.homepageContent.deleteMany();

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Atölye" },
    create: { email, passwordHash, name: "Atölye" },
  });

  const [seramik, tekstil, ahsap, taki, dekorasyon, ozel] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Seramik",
        slug: "seramik",
        description: "Tornada çekilen kaseler, vazolar ve sofraya oturan çanaklar.",
        displayOrder: 1,
        isPublished: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Tekstil",
        slug: "tekstil",
        description: "Keten, yün ve elde dikilmiş örtüler.",
        displayOrder: 2,
        isPublished: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Ahşap",
        slug: "ahsap",
        description: "Zeytin ve cevizden, tek parça oyulan ev eşyaları.",
        displayOrder: 3,
        isPublished: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Takı",
        slug: "taki",
        description: "Tezgâhta bitirilen küçük kolye ve küpeler.",
        displayOrder: 4,
        isPublished: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Dekorasyon",
        slug: "dekorasyon",
        description: "Duvar ve masa üstü için tek kalan objeler.",
        displayOrder: 5,
        isPublished: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Özel Tasarım",
        slug: "ozel-tasarim",
        description: "Ölçüsü ve sırı birlikte kararlaştırılan işler.",
        displayOrder: 6,
        isPublished: true,
      },
    }),
  ]);

  const products = [
    {
      name: "Ay Işığı Kasesi",
      slug: "ay-isigi-kasesi",
      shortDescription: "El tornasında çekilmiş, açık sırlı ve ince kenarlı seramik kase.",
      description:
        "Avuç içine oturan, ince kenarlı bir kase. Açık bej sır fırından hafif dalgalı çıkar; her parçada leke aynı yerde durmaz.\n\nMeyve, takı ya da tek başına bir masa üstü eşyası olarak durur. Bulaşık makinesine girmesin diye elde yıkamak yeterli.",
      price: 1450,
      categoryId: seramik.id,
      isFeatured: true,
      displayOrder: 1,
      cover: "1578749556568-bc2c40e68b61",
      images: ["1617038260897-41a1f14a8ca0", "1578500494198-246f612d3b3d"],
    },
    {
      name: "Toprak Vazo",
      slug: "toprak-vazo",
      shortDescription: "Dar ağızlı, elde şekillendirilmiş ve mat sırlı vazo.",
      description:
        "Dar ağız, geniş karın. İçine bir iki dal yeter; çiçeksiz de duvarda iz bırakır.\n\nÇamur atölyede bir gün dinlendirilir, sonra elle çekilir. Sır, pişmeden önce süngerle inceltilir. Bu yüzden yüzey parlak bir vitrin gibi değil, toprak gibi durur.",
      price: 2800,
      categoryId: seramik.id,
      isFeatured: true,
      displayOrder: 2,
      cover: "1565193566173-7a0ee3dbe261",
      images: ["1610701596007-11502861dcfa"],
    },
    {
      name: "Keten Sofra Örtüsü",
      slug: "keten-sofra-ortusu",
      shortDescription: "Yıkanmış keten, elde kıvrılmış kenar ve görünür dikiş.",
      description:
        "Sofranın ortasına serilen, yıkandıkça yumuşayan bir örtü. Kenarları makinede gizlenmez; dikiş görünür kalsın diye elde kıvrılır.\n\nDoğal keten kırışır. Ütülemek zorunda değilsiniz. Kırışıklık, kullanıldığının izidir.",
      price: 3200,
      categoryId: tekstil.id,
      isFeatured: true,
      displayOrder: 3,
      cover: "1615874959474-d609969a20ed",
      images: ["1522771739844-6a9f6d5f14af"],
    },
    {
      name: "Zeytin Ağacı Tepsi",
      slug: "zeytin-agaci-tepsi",
      shortDescription: "Tek kütükten oyulmuş, yağ ile bitirilmiş servis tepsisi.",
      description:
        "Zeytin ağacının damarı her tepside başka yerden geçer. Parça tek kütükten oyulur, zımparalanır ve gıda ile uyumlu yağla bitirilir.\n\nEkmek, meyve ya da boş bir orta sehpa için. Suya uzun süre bırakmayın; kuruladıktan sonra ara sıra yağlayın.",
      price: 4100,
      categoryId: ahsap.id,
      isFeatured: true,
      displayOrder: 4,
      cover: "1601924994987-69e26d50dc26",
      images: ["1603006905003-be475563bc59"],
    },
    {
      name: "Bakır Halka Kolye",
      slug: "bakir-halka-kolye",
      shortDescription: "Elde dövülmüş bakır halka ve boyasız pamuk kordon.",
      description:
        "İnce bir bakır şerit, tezgâhta halka haline getirilir. Yüzey parlatılmaz; zamanla kararır, teninize göre rengi değişir.\n\nKordon boyasız pamuktur ve boyna göre kısaltılabilir. Küpe ile takım değildir; tek duran bir parça.",
      price: 980,
      categoryId: taki.id,
      isFeatured: true,
      displayOrder: 5,
      cover: "1515562141207-7a88fb7ce338",
      images: ["1599643478518-a784e5dc4c8f"],
    },
    {
      name: "Ceviz Mumluk",
      slug: "ceviz-mumluk",
      shortDescription: "Ceviz kütüğünden oyulmuş, üç gözlü alçak mumluk.",
      description:
        "Alçak, ağır ve elde taşınırken kütüğün ağırlığını hissettiren bir mumluk. Üç göz aynı hizada değil; mumlar biraz farklı boyda durur.\n\nİnce çay mumları için oyuldu. Altına keçe yapıştırmadık; masa çizilmesin diye kullandığınız örtünün üstünde dursun.",
      price: 1650,
      categoryId: ahsap.id,
      isFeatured: false,
      displayOrder: 6,
      cover: "1603006905003-be475563bc59",
      images: ["1601924994987-69e26d50dc26"],
    },
    {
      name: "Sırlı Duvar Tabağı",
      slug: "sirli-duvar-tabagi",
      shortDescription: "Duvara asılan, tek kat sırlı ve hafif çukur tabak.",
      description:
        "Sofra tabağı değil. Duvara asılsın diye arkasına deri askı dikilir, ön yüzü tek kat sırla kapanır.\n\nOrtadaki çukur, ışığa göre gölge bırakır. Aynı sırdan iki tabak çıkmaz; fırın rafta durduğu yeri hatırlar.",
      price: 1900,
      categoryId: dekorasyon.id,
      isFeatured: true,
      displayOrder: 7,
      cover: "1578500494198-246f612d3b3d",
      images: ["1578749556568-bc2c40e68b61", "1565191999001-551c187427bb"],
    },
    {
      name: "Sipariş Vazosu",
      slug: "siparis-vazosu",
      shortDescription: "Yüksekliği, ağzı ve sırı birlikte kararlaştırılan tek vazo.",
      description:
        "Hazır bir model değil. Önce yüksekliği ve ağzın genişliğini konuşuruz, sonra bir sıra denemesi görürsünüz.\n\nSüre, fırın takvimine bağlıdır; çoğu iş üç ile beş hafta arasında biter. Fiyat, ölçü netleşince yazılır.",
      price: null,
      categoryId: ozel.id,
      isFeatured: false,
      displayOrder: 8,
      cover: "1610701596007-11502861dcfa",
      images: ["1565193566173-7a0ee3dbe261"],
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        currency: "TRY",
        coverImage: photo(product.cover),
        categoryId: product.categoryId,
        isFeatured: product.isFeatured,
        isPublished: true,
        displayOrder: product.displayOrder,
        images: {
          create: product.images.map((id, index) => ({
            url: photo(id, 1400),
            alt: product.name,
            displayOrder: index,
          })),
        },
      },
    });
  }

  await prisma.homepageContent.createMany({
    data: [
      {
        key: "hero",
        title: "El emeğinin izini taşıyan parçalar.",
        description: "Her biri özenle hazırlanan, kendine ait bir hikâyeye sahip el işi ürünleri keşfedin.",
        imageUrl: photo("1610701596007-11502861dcfa", 2000),
        primaryButtonText: "Ürünleri Keşfet",
        primaryButtonUrl: "/products",
        secondaryButtonText: "Hakkımızda",
        secondaryButtonUrl: "/about",
        isVisible: true,
        displayOrder: 0,
      },
      {
        key: "featured",
        title: "Öne Çıkanlar",
        description: "Bu ay tezgâhtan çıkanlar. Hepsi tek, hiçbiri bir sonrakinin kopyası değil.",
        isVisible: true,
        displayOrder: 1,
      },
      {
        key: "categories",
        title: "Atölyeden",
        description: "Seramik, tekstil, ahşap ve küçük takılar. Gruplar değişir, tempo değişmez.",
        isVisible: true,
        displayOrder: 2,
      },
      {
        key: "brand_story",
        title: "Ellerin yavaşladığı yer",
        description:
          "feraaura, İstanbul’da küçük bir atölyede doğdu. Seri üretim yok. Çamur kurusun diye bekleriz, keteni avuçta tartarız, ahşabın damarını kesmeden takip ederiz.\n\nHer parça tek tek hazırlanır. Sırı, dikişi ya da cilası aynı günün ışığını taşır. Amacımız çok üretmek değil; evde uzun yıllar kalacak, kullanıldıkça güzelleşen işler bırakmak.",
        imageUrl: photo("1452860606245-08befc0ff44b", 1600),
        isVisible: true,
        displayOrder: 3,
      },
      {
        key: "gallery",
        title: "Atölyeden kareler",
        description: "Sır denemeleri, keten masası ve henüz yağlanmamış ahşap.",
        isVisible: true,
        displayOrder: 4,
      },
      {
        key: "about",
        title: "Küçük atölye, uzun ömür",
        description:
          "feraaura bir vitrin markası olarak başlamadı. Önce evde kullanılan kaseler vardı. Misafirler aynı kâseyi sorunca, parçaları başkalarının evine de bırakmaya karar verdik.\n\nAtölye Cihangir’de, bir apartmanın giriş katında. Vitrin yok. Ziyaret randevu ile. Siparişlerin çoğunu buradan, tezgâhın başından konuşuyoruz.\n\nÇamur, keten, zeytin ağacı ve bakır. Malzeme az, tekrar çok. Aynı kabı on kez yapmak, onuncu seferde hâlâ elle yapıldığını göstermek istiyoruz.",
        imageUrl: photo("1565191999001-551c187427bb", 1800),
        isVisible: true,
        displayOrder: 5,
      },
      {
        key: "products_page",
        title: "Parçalar",
        description: "Atölyede tek tek hazırlanan seramik, tekstil, ahşap ve takılar. Sepet yok; beğendiğiniz parça için yazmanız yeterli.",
        isVisible: true,
        displayOrder: 6,
      },
      {
        key: "contact",
        title: "İletişim",
        description: "Bir parça, bir ölçü ya da atölye ziyareti için yazın. Mesajlar bize gelir, otomatik cevap yok.",
        isVisible: true,
        displayOrder: 7,
      },
    ],
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        url: photo("1452860606245-08befc0ff44b", 1400),
        alt: "Tezgâhın üstünde çalışan eller",
        caption: "Sabah sır denemesi",
        displayOrder: 1,
      },
      {
        url: photo("1459908676235-d5f02a50184b", 1200),
        alt: "Yün ve iplik",
        caption: "Dokuma için ayrılmış yün",
        displayOrder: 2,
      },
      {
        url: photo("1565191999001-551c187427bb", 1200),
        alt: "Sırlanmış seramikler",
        caption: "Fırından yeni çıkmış kaseler",
        displayOrder: 3,
      },
      {
        url: photo("1615874959474-d609969a20ed", 1400),
        alt: "Keten doku",
        caption: "Yıkanmış keten",
        displayOrder: 4,
      },
      {
        url: photo("1515562141207-7a88fb7ce338", 1200),
        alt: "El yapımı takı",
        caption: "Tezgâhta biten halkalar",
        displayOrder: 5,
      },
      {
        url: photo("1601924994987-69e26d50dc26", 1200),
        alt: "Ahşap mutfak parçaları",
        caption: "Yağlanmayı bekleyen ahşap",
        displayOrder: 6,
      },
    ],
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      brandName: "feraaura",
      instagramUrl: "https://instagram.com/feraaura",
      email: "merhaba@feraaura.com",
      phone: "+90 212 293 14 20",
      address: "Cihangir, Beyoğlu, İstanbul",
      footerDescription:
        "El emeği seramik, tekstil, ahşap ve takı. Küçük bir atölyeden, yavaş üretilmiş parçalar.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
