# vite-maplibre-ts

A template repository for building interactive web maps using [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), and [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/). This template includes geometry editing tools and layer control, with automatic deployment to GitHub Pages.

## Live Demo

[View the live demo](https://opengeos.github.io/vite-maplibre-ts/)

## Features

- **MapLibre GL JS** - Open-source map rendering library for vector and raster tiles
- **TypeScript** - Type-safe development with full IntelliSense support
- **Vite** - Lightning-fast development server with hot module replacement (HMR)
- **Geoman** - Draw, edit, and delete geometries on the map
- **Geo Editor** - Advanced geometry editing tools including cut, split, union, and difference operations
- **Layer Control** - Toggle visibility and adjust opacity of map layers
- **GitHub Pages** - Automatic deployment on push to main branch
- **Pre-commit Hooks** - Code quality checks with pre-commit

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [Git](https://git-scm.com/)

## Use This Template

### Option 1: GitHub Template (Recommended)

1. Click the **"Use this template"** button at the top of this repository
2. Choose **"Create a new repository"**
3. Fill in your repository name and settings
4. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```
5. Update `vite.config.ts` to use your repository name:
   ```typescript
   base: process.env.GITHUB_ACTIONS ? "/YOUR_REPO_NAME/" : "/",
   ```
6. Install dependencies and start developing:
   ```bash
   npm install
   npm run dev
   ```

### Option 2: Manual Clone

```bash
git clone https://github.com/opengeos/vite-maplibre-ts.git my-map-project
cd my-map-project
rm -rf .git
git init
npm install
npm run dev
```

## Local Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:5173` with hot module replacement.

### Build for Production

```bash
npm run build
```

This compiles TypeScript and builds the production-ready files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## Deployment to GitHub Pages

This template includes a GitHub Actions workflow that automatically deploys to GitHub Pages.

### Setup

1. **Enable GitHub Pages in your repository:**
   - Go to **Settings** > **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch:**
   - Any push to the `main` branch triggers the deployment workflow
   - The workflow installs dependencies, builds the project, and deploys to GitHub Pages

3. **Access your deployed site:**
   - Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Manual Deployment

You can also trigger a deployment manually:
1. Go to **Actions** > **Deploy to GitHub Pages**
2. Click **Run workflow**

### Custom Domain (Optional)

To use a custom domain:

1. Update `vite.config.ts`:
   ```typescript
   base: "/",
   ```

2. Create a `public/CNAME` file with your domain:
   ```
   your-domain.com
   ```

3. Configure DNS settings with your domain provider

## Project Structure

```
vite-maplibre-ts/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
├── public/
│   └── vite.svg            # Static assets (copied as-is to dist)
├── src/
│   ├── main.ts             # Application entry point
│   ├── style.css           # Global styles
│   └── typescript.svg      # TypeScript logo (bundled asset)
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## Key Files

| File | Description |
|------|-------------|
| `src/main.ts` | Main TypeScript file with MapLibre map initialization, controls, and layers |
| `vite.config.ts` | Vite configuration including base path for GitHub Pages |
| `.github/workflows/deploy.yml` | GitHub Actions workflow for automated deployment |

## Customization

### Change the Map Style

Edit `src/main.ts` to use a different map style:

```typescript
const map = new maplibregl.Map({
  container: "map",
  style: "https://your-style-url.json", // Your custom style
  center: [longitude, latitude],
  zoom: 10,
});
```

### Add New Layers

Add GeoJSON or other data sources in `src/main.ts`:

```typescript
map.on("load", () => {
  map.addSource("my-source", {
    type: "geojson",
    data: "https://example.com/data.geojson",
  });

  map.addLayer({
    id: "my-layer",
    type: "fill",
    source: "my-source",
    paint: {
      "fill-color": "#088",
      "fill-opacity": 0.5,
    },
  });
});
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Dependencies

### Runtime Dependencies

- [maplibre-gl](https://www.npmjs.com/package/maplibre-gl) - Map rendering library
- [@geoman-io/maplibre-geoman-free](https://www.npmjs.com/package/@geoman-io/maplibre-geoman-free) - Geometry drawing/editing
- [maplibre-gl-geo-editor](https://www.npmjs.com/package/maplibre-gl-geo-editor) - Advanced geometry tools
- [maplibre-gl-layer-control](https://www.npmjs.com/package/maplibre-gl-layer-control) - Layer visibility control

### Development Dependencies

- [vite](https://www.npmjs.com/package/vite) - Build tool and dev server
- [typescript](https://www.npmjs.com/package/typescript) - TypeScript compiler

## Resources

- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
