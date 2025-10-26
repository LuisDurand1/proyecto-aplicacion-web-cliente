# TechNova — Frontend estático

Repositorio del cliente estático de la tienda TechNova. Contiene páginas HTML, estilos (CSS) y lógica en JavaScript (vanilla) que implementan catálogo, búsqueda, carrito y panel de administración. Los datos se consumen desde Airtable (API) y el carrito se persiste en LocalStorage.

Este README documenta cómo usar Docker para obtener la imagen base de nginx desde Docker Hub, construir la imagen personalizada y ejecutar el contenedor; incluye comandos de build/run y comprobaciones básicas.


## Tecnologías
- HTML5, CSS3, JavaScript (vanilla)  
- Fetch API, Airtable (API), LocalStorage  
- SVG (iconos)  
- Docker + nginx (imagen base: `nginx:1.25-alpine`)  
- Git

## Requisitos
- Docker instalado y disponible en la línea de comandos:
  - Windows: Docker Desktop (o Docker Engine en WSL2).  
  - macOS: Docker Desktop.  
  - Linux: Docker Engine (systemd).
- Terminal: PowerShell / CMD (Windows) o Terminal (macOS/Linux).
- Ejecutar los comandos desde la carpeta raíz del proyecto (donde está el `Dockerfile` y `index.html`), o pasar la ruta al contexto al build.

## Construir la imagen (desde la raíz del proyecto)
```bash
docker build -t technova-static:latest .
```

## Ejecutar el contenedor
En foreground:
```bash
docker run --rm -p 8080:80 technova-static:latest
```

En background (detached) y ligado a localhost:
```bash
docker run -d --name technova -p 127.0.0.1:8080:80 technova-static:latest
```

## Ver logs y estado
```bash
docker ps
docker logs -f technova
docker stop technova
```

## Verificar servicio
- macOS / Linux / Git Bash:
```bash
curl -I http://localhost:8080
```
- PowerShell:
```bash
Invoke-WebRequest http://localhost:8080 -UseBasicParsing
```

Respuesta `HTTP/1.1 200 OK` indica que nginx está sirviendo `index.html`.

## Opcional
- Descargar la imagen base explícitamente:
```bash
docker pull nginx:1.25-alpine
```