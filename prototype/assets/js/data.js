/*
 * Configuración del salón.
 * Todo lo que el dueño querría cambiar vive aquí: precios, paquetes,
 * capacidad y fechas ocupadas. Los valores actuales son DE EJEMPLO
 * y deben confirmarse con Salón Rominos antes de publicar.
 */
window.ROMINOS = {
  nombre: 'Salón Rominos',
  telefono: '2221208336',          // se muestra en la página
  whatsapp: '522221208336',        // formato internacional para wa.me
  ciudad: 'San Martín Texmelucan, Puebla',
  referencia: 'Cerca de la Terminal de Autobuses AU',
  mapsQuery: 'Salón Rominos, San Martín Texmelucan, Puebla',
  redes: {
    facebook: 'https://www.facebook.com/',   // TODO: link real de la página
    instagram: 'https://www.instagram.com/', // TODO: link real del perfil
  },

  capacidadMax: 200,      // TODO: confirmar capacidad real
  personasPorMesa: 10,
  horasIncluidas: 6,
  anticipo: 0.3,          // 30 % para apartar la fecha

  // Renta del salón según el día (incluye jardín, cocina y área de juegos)
  renta: {
    entreSemana: 3500,    // lunes a jueves
    viernesDomingo: 4500,
    sabado: 5500,
  },

  precios: {
    mesa: 70,        // mesa redonda con mantel
    silla: 15,
    horaExtra: 600,
  },

  decoracion: [
    { id: 'ninguna',  nombre: 'Sin decoración', precio: 0,    detalle: 'Tú decoras o traes a tu decorador.' },
    { id: 'basica',   nombre: 'Básica',         precio: 1500, detalle: 'Arco de globos en la mesa principal.' },
    { id: 'tematica', nombre: 'Temática',       precio: 2800, detalle: 'Arco, fondo y centros de mesa con el tema y colores que elijas.' },
    { id: 'completa', nombre: 'Completa',       precio: 4800, detalle: 'Salón y jardín decorados, centros de mesa, luces y mesa de dulces.' },
  ],

  inflables: [
    { id: 'castillo',     nombre: 'Inflable castillo',          precio: 900 },
    { id: 'resbaladilla', nombre: 'Inflable con resbaladilla',  precio: 1200 },
  ],

  // Presets que se aplican al elegir un tipo de evento
  eventos: [
    { id: 'infantil',   nombre: 'Fiesta infantil',       invitados: 60,  deco: 'tematica', inflables: { castillo: 1 },
      texto: 'El área de juegos va incluida. Puedes sumar inflables y decoración con el personaje favorito.' },
    { id: 'boda',       nombre: 'Boda',                  invitados: 150, deco: 'completa',
      texto: 'Ceremonia en el jardín y recepción en el salón techado, con mesas vestidas y luces.' },
    { id: 'xv',         nombre: 'XV años',               invitados: 120, deco: 'completa',
      texto: 'Espacio para el vals, la mesa de honor y las fotos en el jardín.' },
    { id: 'graduacion', nombre: 'Graduación',            invitados: 100, deco: 'basica',
      texto: 'Arma la cotización y comparte el resumen con tu generación por WhatsApp.' },
    { id: 'comunion',   nombre: 'Primera comunión',      invitados: 80,  deco: 'basica',
      texto: 'Una comida familiar tranquila después de misa, con jardín para los niños.' },
    { id: 'confirmacion', nombre: 'Confirmación',        invitados: 80,  deco: 'basica',
      texto: 'Mesas listas, cocina disponible y jardín para la convivencia.' },
    { id: 'bautizo',    nombre: 'Bautizo',               invitados: 70,  deco: 'basica',
      texto: 'Celebra con la familia y los padrinos sin preocuparte por el mobiliario.' },
    { id: 'despedida',  nombre: 'Despedida de solter@',  invitados: 40,  deco: 'tematica',
      texto: 'Un espacio solo para tu grupo, con la decoración y el ambiente que quieras.' },
    { id: 'familiar',   nombre: 'Reunión familiar',      invitados: 50,  deco: 'ninguna',
      texto: 'Cumpleaños, aniversarios o la comida de fin de año con toda la familia.' },
  ],

  // Fechas bloqueadas a mano (AAAA-MM-DD). En la versión real las
  // administraría el salón desde un panel o un Google Calendar.
  ocupadasFijas: ['2026-12-24', '2026-12-31'],
};
