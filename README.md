# Mineuri · nueva web

Propuesta de nueva web estática y sección **Escuela Mineuri**, diseñada desde cero.

## Estructura

- `index.html`: presentación de la tienda de recursos y colecciones en preparación.
- `escuela/index.html`: itinerarios de formación para personas y pacientes, psicólogos y neuropsicólogos.
- `assets/mineuri-nueva.css`: sistema visual editorial y responsive.
- `assets/mineuri-nueva.js`: filtros de cursos por público.
- `assets/mineuri-icon.svg`: nuevo favicon.

## Estado

Este proyecto está en **fase de diseño**. No hay catálogo activo, pasarela de pago ni matrícula. Los seis temarios de cursos se muestran como propuestas, no como cursos disponibles.

## Antes de lanzar a producción

1. Validar los contenidos y los materiales reales, licencias y precios.
2. Integrar pagos y entrega digital segura.
3. Integrar inscripción a cursos o lista de interés con consentimiento RGPD.
4. Elaborar aviso legal, condiciones de contratación, privacidad y cookies adecuados a la nueva actividad.
5. Revisar accesibilidad, SEO y redirecciones de URLs antiguas.
6. Confirmar el entorno de despliegue y dominio de Mineuri antes de fusionar.

La nueva marca no comparte plataforma ni producto con Entre Sesiones ni con MineuriStudio.

## Nuevo ecosistema Mineuri · 20/10/2026
Se añadieron las páginas `directorio/` (piloto con una ficha inicial real), `centros/` (líneas institucionales en diseño) y `observatorio/` (propuestas de estudios aún no realizados), además de navegación conectada y estilos que conservan la paleta v2.

**Despliegue pendiente:** `mineuri.com` está asociado a la aplicación Vercel `mineuri-app-oz9q` con rutas clínicas /profesional y /entre-sesiones. No reasignar el dominio sin verificar la continuidad del servicio, sesiones y redirecciones. Este repositorio es el nuevo sitio público independiente.

**Antes de abrir el directorio a terceros:** sistema de consentimiento, administración de fichas, verificación de colegiación y habilitaciones, revisión de privacidad/RGPD, contacto, rectificación y retirada, y revisión editorial.

## Incorporación de profesionales
La ruta `/directorio/alta/` contiene un asistente de redacción de correo. **No hay envío web, registro online, almacenamiento en servidor, cola administrativa ni autorización para publicar perfiles**. El profesional debe revisar el borrador y pulsar Enviar en su cliente de correo. La dirección de destino, tomada del aviso legal vigente, es `hola@mineuri.com`, cuya recepción debe verificarse antes de habilitar el flujo en producción.

Para una ficha pública de terceros se requiere: solicitud voluntaria, verificación de número y estado de colegiación, habilitación según servicios anunciados, consentimiento específico para contenido público, comprobación de enlaces, criterios editoriales y canal para rectificación o retirada. No se deben subir por este flujo documentos de identidad ni datos de pacientes.
