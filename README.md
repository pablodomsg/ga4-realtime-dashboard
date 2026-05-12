# GA4 Realtime Dashboard

Dashboard online para Google Analytics 4 construido con Next.js App Router,
TypeScript, Tailwind CSS, Recharts y Google Analytics Data API.

No usa Looker Studio, no requiere editar graficas manualmente y obtiene datos
directamente desde GA4. Los datos realtime se leen con `runRealtimeReport`; los
datos historicos se leen con `runReport`. Ten en cuenta que GA4 realtime cubre
actividad reciente, no el historico completo.

## Funcionalidad

- Home en `/` con acceso al dashboard.
- Dashboard en `/dashboard`.
- Usuarios activos ahora con refresco cada 60 segundos.
- Usuarios, sesiones y eventos por rango.
- Vistas por dia.
- Usuarios por canal / source medium.
- Paginas mas vistas.
- Eventos principales.
- Usuarios por pais.
- Usuarios por dispositivo.
- Selector de rango: 7, 30 y 90 dias.
- Estados de loading, error y empty state.
- Mensaje claro si faltan variables de entorno.

## Variables de entorno

Crea un archivo `.env.local` basado en `.env.example`:

```bash
GA_PROPERTY_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

No uses variables `NEXT_PUBLIC_` para credenciales privadas. Todas las llamadas a
Google Analytics se hacen desde rutas server en `/api/analytics/*`.

Si la clave privada llega con saltos escapados, puedes guardarla con `\n`; la app
los convierte correctamente antes de crear el cliente de Google.

## Crear una service account en Google Cloud

1. Entra en Google Cloud Console.
2. Crea o selecciona un proyecto.
3. Ve a IAM & Admin > Service Accounts.
4. Crea una service account.
5. Abre la service account y crea una key JSON.
6. Copia `client_email` a `GOOGLE_CLIENT_EMAIL`.
7. Copia `private_key` a `GOOGLE_PRIVATE_KEY`.

## Activar Google Analytics Data API

1. En Google Cloud Console, abre APIs & Services.
2. Busca `Google Analytics Data API`.
3. Activa la API en el proyecto que contiene la service account.

## Dar acceso a la service account en GA4

1. En Google Analytics, abre Admin.
2. Selecciona la propiedad GA4.
3. Ve a Property access management.
4. Anade el email de la service account.
5. Dale rol Viewer o Analyst.

## Encontrar el GA_PROPERTY_ID

1. En Google Analytics, abre Admin.
2. Selecciona la propiedad GA4.
3. Abre Property details.
4. Copia el Property ID numerico.
5. Guardalo en `.env.local` como `GA_PROPERTY_ID`, sin el prefijo `properties/`.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000/dashboard`.

## Crear repo en GitHub

Con GitHub CLI autenticado:

```bash
gh repo create ga4-realtime-dashboard --private --source=. --remote=origin --push
```

Si no has iniciado sesion:

```bash
gh auth login
gh repo create ga4-realtime-dashboard --private --source=. --remote=origin --push
```

## Desplegar en Vercel

Preview:

```bash
vercel
```

Produccion:

```bash
vercel --prod
```

## Configurar variables de entorno en Vercel

Desde el dashboard de Vercel:

1. Project Settings.
2. Environment Variables.
3. Anade `GA_PROPERTY_ID`, `GOOGLE_CLIENT_EMAIL` y `GOOGLE_PRIVATE_KEY`.
4. Redeploy.

Con Vercel CLI:

```bash
vercel env add GA_PROPERTY_ID
vercel env add GOOGLE_CLIENT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY
```

Despues despliega de nuevo:

```bash
vercel --prod
```

## Endpoints

- `/api/analytics/realtime`
- `/api/analytics/overview?range=7d|30d|90d`
- `/api/analytics/timeseries?range=7d|30d|90d`
- `/api/analytics/pages?range=7d|30d|90d`
- `/api/analytics/events?range=7d|30d|90d`
- `/api/analytics/channels?range=7d|30d|90d`
- `/api/analytics/countries?range=7d|30d|90d`
- `/api/analytics/devices?range=7d|30d|90d`

Realtime usa `Cache-Control: no-store`. Los endpoints historicos usan cache de
600 segundos con `stale-while-revalidate`.

## Troubleshooting

### Error de credenciales

Revisa que `GOOGLE_CLIENT_EMAIL` y `GOOGLE_PRIVATE_KEY` vienen del mismo JSON de
service account. Si la clave esta en una sola linea, conserva los `\n`.

### Property ID incorrecto

`GA_PROPERTY_ID` debe ser solo el numero de la propiedad, por ejemplo
`123456789`, no `properties/123456789`.

### Service account sin acceso a GA4

La service account debe estar anadida en Property access management de la
propiedad GA4 con permisos de lectura.

### API no habilitada

Activa Google Analytics Data API en el mismo proyecto de Google Cloud donde vive
la service account.

### No hay datos realtime

GA4 realtime solo muestra actividad reciente. Si no hay usuarios activos en ese
momento, `activeUsers` puede ser 0 aunque el historico tenga datos.

### Incompatibilidad de dimensiones GA4

El endpoint de canales intenta usar `sessionDefaultChannelGroup` junto con
`sessionSourceMedium`. Si una propiedad no permite esa combinacion, la ruta
reintenta automaticamente solo con `sessionDefaultChannelGroup` para mantener el
dashboard operativo.
