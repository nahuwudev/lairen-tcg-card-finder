# Lairen Card Finder - OCR en Tiempo Real

Una aplicación móvil React Native con Expo que usa la cámara para reconocimiento óptico de caracteres (OCR) en tiempo real.

## 🚀 Características

- ✨ Reconocimiento de texto en tiempo real usando ML Kit
- 📸 Vista previa de cámara con área de escaneo
- 🔄 Procesamiento automático cada 2 segundos
- 📱 Interfaz intuitiva con panel de resultados
- 🎨 Diseño moderno y limpio

## 📦 Tecnologías

- **React Native** con **Expo**
- **TypeScript** para seguridad de tipos
- **expo-camera** para acceso a la cámara
- **@react-native-ml-kit/text-recognition** para OCR

## 🛠️ Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

## 🏃‍♂️ Cómo Ejecutar

### Desarrollo con Expo Go

1. **Inicia el servidor de desarrollo:**

   ```bash
   npm start
   ```

2. **Escanea el código QR:**
   - **Android**: Usa la app Expo Go desde Google Play
   - **iOS**: Usa la cámara nativa o la app Expo Go desde App Store

### Ejecutar en Android/iOS

```bash
# Android
npm run android

# iOS (requiere macOS)
npm run ios

# Web
npm run web
```

## ⚙️ Configuración

### Permisos Configurados

La app ya tiene configurados los permisos necesarios en `app.json`:

**iOS:**

- Acceso a la cámara (`NSCameraUsageDescription`)
- Acceso a la galería (`NSPhotoLibraryUsageDescription`)

**Android:**

- `CAMERA`
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

## 📱 Uso de la Aplicación

1. **Conceder permisos**: Al abrir la app, concede permiso para usar la cámara
2. **Apuntar al texto**: Enfoca la cámara hacia cualquier texto que quieras escanear
3. **Procesamiento automático**: La app capturará y procesará el texto cada 2 segundos
4. **Ver resultados**: El texto reconocido aparecerá en el panel inferior
5. **Limpiar**: Usa el botón "Limpiar" para borrar los resultados

## 🔧 Estructura del Proyecto

```
lairen-card-finder/
├── App.tsx              # Componente principal con lógica de cámara y OCR
├── app.json             # Configuración de Expo y permisos
├── package.json         # Dependencias del proyecto
└── assets/             # Recursos (iconos, images, etc.)
```

## 📝 Notas Importantes

### Limitaciones de Expo Go

- **ML Kit**: La librería `@react-native-ml-kit/text-recognition` requiere **compilación nativa**
- Para probar la funcionalidad completa de OCR, necesitas usar:
  - **Expo Dev Build** (recomendado)
  - **Compilación local** con `npx expo run:android` o `npx expo run:ios`

### Crear un Development Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Iniciar sesión en Expo
eas login

# Configurar el proyecto
eas build:configure

# Crear build de desarrollo
eas build --profile development --platform android
# o para iOS
eas build --profile development --platform ios
```

## 🐛 Solución de Problemas

### La cámara no se muestra

- Verifica que hayas concedido permisos de cámara
- Reinicia la aplicación

### OCR no funciona

- Asegúrate de estar usando un Development Build (no Expo Go)
- Verifica que la imagen tenga buen contraste y esté enfocada

### Error de módulo nativo

- ML Kit requiere módulos nativos, usa `npx expo run:android` en lugar de Expo Go

## 🚀 Roadmap del Proyecto (Lógica Lairen)

El objetivo NO es solo leer texto, sino identificar cartas del juego Lairen TCG.

- [ ] **Lógica de Regex**: Implementar función que filtre el texto crudo buscando el patrón numérico `X/Y` (Ej: "55/120") y el nombre de la expansión anterior.
- [ ] **Base de Datos**: Importar el archivo `lairen_data.json` (convertido desde el CSV oficial) con la data de las cartas.
- [ ] **Motor de Búsqueda**: Crear la lógica que cruce el resultado del OCR con el JSON local para encontrar la carta exacta.
- [ ] **UI de Carta**: Reemplazar el texto plano por un componente visual que muestre la imagen y nombre de la carta detectada.

## 📄 Licencia

MIT
