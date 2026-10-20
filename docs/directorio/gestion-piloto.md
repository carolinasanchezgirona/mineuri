# Directorio Mineuri · revisión y publicación manual (piloto)
**Estado:** flujo de trabajo local, sin administración online ni altas automáticas.

## 1. Recepción
La persona interesada utiliza `/directorio/alta/`, que **solo redacta un correo** a `hola@mineuri.com` en su propio dispositivo. Debe revisarlo y pulsar Enviar. No existe base de datos pública de solicitudes. Antes de promocionar el flujo, hay que comprobar que el buzón reciba mensajes.

## 2. Validación
Se verifica que el solicitante consiente a que se comprueben sus datos profesionales, el estado de colegiación, su habilitación sanitaria cuando proceda y la pertinencia de la especialidad declarada. Distinguir:
- Titulación académica.
- Habilitación para actividad sanitaria, cuando corresponda.
- Especialidad oficial.
- Área de experiencia o formación no habilitante.

No solicitar ni aceptar documentos de pacientes, DNI por correo general o historiales clínicos. Custodiar separadamente cualquier evidencia documental de revisión. Una solicitud **no** es autorización de publicación.

## 3. Autorización específica
Enviar al profesional los campos exactos de su ficha para revisión y solicitar autorización inequívoca para publicar nombre, colegiación, zona, servicios y web. Informar de cómo modificar o retirar la ficha y de las condiciones editoriales.

## 4. Preparación editorial
Abrir `herramientas/editor-directorio.html` en un navegador. El editor es un **archivo independiente y local**; no autentica, no transmite, no publica ni guarda en servidores. Permite importar, modificar, archivar, eliminar y exportar JSON. Requiere estado «aprobado», casilla «verificado», casilla «autorizado» y una URL https para preparar una ficha publicable.

## 5. Publicación
Revisar los campos exportados, comprobar que corresponden a un consentimiento vigente y actualizar manualmente la web por el repositorio de GitHub. Comprobar enlaces, accesibilidad y que la ficha no afirma ventajas o eficacia clínica no verificadas. No subir borradores, expedientes de revisión ni justificantes a un repositorio público.

## 6. Cambios y retirada
Canal de contacto: `hola@mineuri.com`. Documentar recepción, verificación de legitimidad de la solicitud, modificación, retirada de la web, revisión de caché y cumplimiento de plazos RGPD. Mantener política de conservación para los datos recibidos por email.

## 7. Próxima arquitectura
Una vez existan proyecto independiente, base de datos y administración segura: solicitudes en tabla privada con RLS, panel protegido con roles de revisor, publicaciones auditables, registro de autorizaciones y eliminación. **No reutilizar las bases de datos clínicas de Entre Sesiones o Portal de Pacientes.**
