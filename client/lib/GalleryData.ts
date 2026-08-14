/* ===================================================
   script.js â€” Muebles Mesias
   Galeria expandible + Lightbox + Nav + WhatsApp
   =================================================== */

/* --------------------------------------------------
   DATOS DE GALERIAS â€” carpetas reales del proyecto
   -------------------------------------------------- */
export const GALLERIES: Record<string, { title: string; poster?: string; precioDesde?: number | string; images: { src: string; alt: string; type?: string; }[] }> = {
  sala: {
    title: "Sala & Sofas",
    poster: "img/salaysofas/20.webp", // <-- CAMBIA ESTO por tu imagen favorita
    images: [
      { src: "img/salaysofas/111.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/113.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/114.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/169.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/192.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/20.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/32.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/33.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/34.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/87.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/9.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-07-at-9-34-43-pm.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-07-at-9-34-43-pm3.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-07-at-9-34-44-pm4.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-07-at-9-34-44-pm5.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-07-at-9-34-45-pm6.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-07-at-9-34-46-pm10.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-09-45-pm18.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-09-45-pm19.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-09-45-pm20.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-09-46-pm.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-10-36-pm-22.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-10-40-pm26.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-11-15-pm32.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-26-26-pm.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-26-27-pm.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-26-53-pm8.webp", alt: "Sala & Sofas" },
      { src: "img/salaysofas/whatsapp-image-2026-06-08-at-7-26-53-pm9.webp", alt: "Sala & Sofas" }
    ]
  },
  dormitorio: {
    title: "Dormitorio",
    images: [
      { src: "img/dormitorio/1.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/6.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/7whatsapp-image-2026-06-08-at-7-26-30-p.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/15.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/31.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/37.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/39.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/41.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/61.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/62.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/96.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/109.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/112.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/123.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/124.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/125.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/126.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/127.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/128.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/129.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/130.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/131.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/132.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/133.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/134.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/135.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/136.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/137.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/138.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/139.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/140.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/141.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/142.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/143.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/144.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/145.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/146.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/147.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/148.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/149.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/150.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/151.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/152.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/160.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/161.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/162.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/163.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/170.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/171.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/172.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/173.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/177.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/178.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/179.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/180.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/187.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/188.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/189.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/190.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/191.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/193.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/197.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/198.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/199.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/200.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/201.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/204.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/205.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/206.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/207.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/219.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/240.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/241.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-07-at-9-34-45-pm7.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-28-pm12.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-29-pm13.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-29-pm14.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-31-pm15.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-31-pm16.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-32-pm17.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-09-59-20.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-10-38-pm.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-12-pm26.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-12-pm27.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-14-pm28.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-14-pm29.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-15-pm.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-15-pm30.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-11-16-pm34.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-26-27-pm1.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-26-29-pm6.webp", alt: "Dormitorio" },
      { src: "img/dormitorio/whatsapp-image-2026-06-08-at-7-26-30-pm.webp", alt: "Dormitorio" }
    ]
  },
  comedor: {
    title: "Comedor",
    images: [
      { src: "img/comedor/11.webp", alt: "Comedor" },
      { src: "img/comedor/12.webp", alt: "Comedor" },
      { src: "img/comedor/18.webp", alt: "Comedor" },
      { src: "img/comedor/19.webp", alt: "Comedor" },
      { src: "img/comedor/44.webp", alt: "Comedor" },
      { src: "img/comedor/45.webp", alt: "Comedor" },
      { src: "img/comedor/48.webp", alt: "Comedor" },
      { src: "img/comedor/53.webp", alt: "Comedor" },
      { src: "img/comedor/55.webp", alt: "Comedor" },
      { src: "img/comedor/58.webp", alt: "Comedor" },
      { src: "img/comedor/59.webp", alt: "Comedor" },
      { src: "img/comedor/115.webp", alt: "Comedor" },
      { src: "img/comedor/116.webp", alt: "Comedor" },
      { src: "img/comedor/117.webp", alt: "Comedor" },
      { src: "img/comedor/118.webp", alt: "Comedor" },
      { src: "img/comedor/119.webp", alt: "Comedor" },
      { src: "img/comedor/120.webp", alt: "Comedor" },
      { src: "img/comedor/121.webp", alt: "Comedor" },
      { src: "img/comedor/122.webp", alt: "Comedor" },
      { src: "img/comedor/195.webp", alt: "Comedor" },
      { src: "img/comedor/196.webp", alt: "Comedor" },
      { src: "img/comedor/209.webp", alt: "Comedor" },
      { src: "img/comedor/211.webp", alt: "Comedor" },
      { src: "img/comedor/221.webp", alt: "Comedor" },
      { src: "img/comedor/222.webp", alt: "Comedor" },
      { src: "img/comedor/230.webp", alt: "Comedor" },
      { src: "img/comedor/231.webp", alt: "Comedor" },
      { src: "img/comedor/238.webp", alt: "Comedor" },
      { src: "img/comedor/239.webp", alt: "Comedor" },
      { src: "img/comedor/whatsapp-image-2026-06-08-at-7-10-37-pm23.webp", alt: "Comedor" }
    ]
  },
  closet: {
    title: "Closet",
    images: [
      { src: "img/closet/49.webp", alt: "Closet" },
      { src: "img/closet/50.webp", alt: "Closet" },
      { src: "img/closet/51.webp", alt: "Closet" },
      { src: "img/closet/52.webp", alt: "Closet" },
      { src: "img/closet/56.webp", alt: "Closet" },
      { src: "img/closet/57.webp", alt: "Closet" },
      { src: "img/closet/166.webp", alt: "Closet" },
      { src: "img/closet/167.webp", alt: "Closet" },
      { src: "img/closet/181.webp", alt: "Closet" },
      { src: "img/closet/182.webp", alt: "Closet" },
      { src: "img/closet/whatsapp-image-2026-06-08-at-7-26.webp", alt: "Closet" },
      { src: "img/closet/whatsapp-image-2026-06-08-at-7-26-30-pm7.webp", alt: "Closet" }
    ]
  },
  espejos: {
    title: "Espejos",
    images: [
      { src: "img/espejos/208.webp", alt: "Espejos" },
      { src: "img/espejos/228.webp", alt: "Espejos" },
      { src: "img/espejos/229.webp", alt: "Espejos" },
      { src: "img/espejos/234.webp", alt: "Espejos" },
      { src: "img/espejos/235.webp", alt: "Espejos" },
      { src: "img/espejos/whatsapp-image-2026-06-07-at-9-34-45-pm8.webp", alt: "Espejos" },
      { src: "img/espejos/whatsapp-image-2026-06-08-at-7-10.webp", alt: "Espejos" },
      { src: "img/espejos/whatsapp-image-2026-06-08-at-7-10-39-pm.webp", alt: "Espejos" },
      { src: "img/espejos/whatsapp-image-2026-06-08-at-7-10-39-pm25.webp", alt: "Espejos" },
      { src: "img/espejos/whatsapp-image-2026-06-08-at-7-26-29-pm4.webp", alt: "Espejos" },
      { src: "img/espejos/whatsapp-image-2026-06-08-at-7-26-29-pm5.webp", alt: "Espejos" }
    ]
  },
  puertas: {
    title: "Puertas",
    images: [
      { src: "img/puertas/54.webp", alt: "Puertas" },
      { src: "img/puertas/164.webp", alt: "Puertas" },
      { src: "img/puertas/165.webp", alt: "Puertas" }
    ]
  },
  bano: {
    title: "BaÃ±o",
    images: [
      { src: "img/bano/64.webp", alt: "Bano" },
      { src: "img/bano/65.webp", alt: "Bano" },
      { src: "img/bano/218.webp", alt: "Bano" }
    ]
  },
  cocinas: {
    title: "Cocinas",
    images: [
      { src: "img/cocinas/10.webp", alt: "Cocinas" },
      { src: "img/cocinas/94.webp", alt: "Cocinas" },
      { src: "img/cocinas/97.webp", alt: "Cocinas" },
      { src: "img/cocinas/98.webp", alt: "Cocinas" },
      { src: "img/cocinas/183.webp", alt: "Cocinas" },
      { src: "img/cocinas/184.webp", alt: "Cocinas" },
      { src: "img/cocinas/185.webp", alt: "Cocinas" },
      { src: "img/cocinas/186.webp", alt: "Cocinas" },
      { src: "img/cocinas/210.webp", alt: "Cocinas" },
      { src: "img/cocinas/whatsapp-image-2026-06-07-at-9-34-45-pm9.webp", alt: "Cocinas" }
    ]
  },
  oficina: {
    title: "Oficina",
    images: [
      { src: "img/oficina/25.webp", alt: "Oficina" },
      { src: "img/oficina/38.webp", alt: "Oficina" },
      { src: "img/oficina/40.webp", alt: "Oficina" },
      { src: "img/oficina/43.webp", alt: "Oficina" },
      { src: "img/oficina/99.webp", alt: "Oficina" },
      { src: "img/oficina/100.webp", alt: "Oficina" },
      { src: "img/oficina/101.webp", alt: "Oficina" },
      { src: "img/oficina/102.webp", alt: "Oficina" },
      { src: "img/oficina/103.webp", alt: "Oficina" },
      { src: "img/oficina/156.webp", alt: "Oficina" }
    ]
  },
  ventanas: {
    title: "Ventanas",
    images: [
      { src: "img/ventanas/26.webp", alt: "Ventanas" },
      { src: "img/ventanas/27.webp", alt: "Ventanas" },
      { src: "img/ventanas/28.webp", alt: "Ventanas" },
      { src: "img/ventanas/29.webp", alt: "Ventanas" },
      { src: "img/ventanas/107.webp", alt: "Ventanas" },
      { src: "img/ventanas/108.webp", alt: "Ventanas" }
    ]
  },
  otras: {
    title: "Otras Opciones",
    images: [
      { src: "img/otrasopciones/16.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/17.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/23.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/24.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/35.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/36.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/46.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/60.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/70.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/95.webp",  alt: "Otras Opciones" },
      { src: "img/otrasopciones/159.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/168.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/194.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/212.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/214.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/215.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/216.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/217.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/226.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/232.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/236.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/whatsapp-image-2026-06-07-at-9-34-43-pm.webp", alt: "Otras Opciones" },
      { src: "img/otrasopciones/whatsapp-image-2026-06-08-at-7-09-59-pm.webp",  alt: "Otras Opciones" }
    ]
  },
  proceso: {
    title: "Proceso de Fabricacion",
    images: [
      { src: "img/proceso/157.webp", alt: "Proceso de fabricacion" },
      { src: "img/proceso/158.webp", alt: "Proceso de fabricacion" },
      { src: "img/proceso/223.webp", alt: "Proceso de fabricacion" },
      { src: "img/proceso/224.webp", alt: "Proceso de fabricacion" },
      { src: "img/proceso/225.webp", alt: "Proceso de fabricacion" }
    ]
  },
  videos: {
    title: "Videos de Exhibicion",
    images: [
      { src: "img/VideosExibicion/42.mp4",  alt: "Video de exhibicion", type: "video" },
      { src: "img/VideosExibicion/104.mp4", alt: "Video de exhibicion", type: "video" },
      { src: "img/VideosExibicion/153.mp4", alt: "Video de exhibicion", type: "video" }
    ]
  }
};
