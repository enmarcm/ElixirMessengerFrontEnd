# 💬 Elixir Messenger

> App móvil de mensajería en tiempo real: mensajes, notas de voz y estados que duran 24 horas. Proyecto universitario.

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=flat-square&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat-square&logo=capacitor&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)

**Backend:** [enmarcm/ElixirBackend](https://github.com/enmarcm/ElixirBackend) · **Portfolio:** [enmarcm.site](https://enmarcm.site)

<!-- TODO: capturas del móvil -->
| Chats | Conversación | Estados |
|---|---|---|
| ![](docs/screenshots/chats.png) | ![](docs/screenshots/chat.png) | ![](docs/screenshots/status.png) |

## ✨ Funcionalidades

- Mensajería instantánea por WebSockets (Socket.IO).
- Notas de voz y envío de imágenes desde la cámara o la galería (Capacitor Camera y Filesystem).
- Estados que duran 24 horas.
- Gestión de contactos e indicadores de presencia.
- Autenticación con JWT.
- App Android nativa con Capacitor.

## 🛠️ Stack

| Capa | Tecnologías |
|---|---|
| App | Ionic + Angular, TypeScript, Tailwind, Swiper |
| Nativo | Capacitor (Android): cámara, filesystem, haptics, teclado |
| Tiempo real | socket.io-client |
| Servicios | Firebase (`@angular/fire`) |
| Backend | [ElixirBackend](https://github.com/enmarcm/ElixirBackend): Express, PostgreSQL, WebSockets, Multer |

## 🚀 Puesta en marcha

```bash
npm install
# configura src/environments/environment.ts (URL del backend y Firebase)
npx ionic serve                 # web
npx ionic cap sync android && npx ionic cap open android   # Android
```

---

🇬🇧 *Real-time mobile messenger (university project): instant messages, voice notes and 24-hour statuses. Built with Ionic + Angular + Capacitor, Socket.IO and Firebase. Backend in ElixirBackend.*
