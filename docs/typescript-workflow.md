# TypeScript Workflow Guide

A beginner-friendly guide to understanding how TypeScript works in this project.

## What is TypeScript?

TypeScript is JavaScript with **type annotations**. It helps catch errors before your code runs by checking that you're using variables and functions correctly.

```typescript
// JavaScript - no type checking
let name = "Alice";
name = 42; // No error, but could cause bugs later

// TypeScript - catches errors early
let name: string = "Alice";
name = 42; // Error: Type 'number' is not assignable to type 'string'
```

## How Code Flows: From TypeScript to Browser

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   src/main.ts   │ ──► │   Vite + TSC    │ ──► │   JavaScript    │
│  (You write)    │     │  (Compiles)     │     │  (Browser runs) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **You write** TypeScript code in `src/main.ts`
2. **Vite compiles** TypeScript to JavaScript automatically
3. **Browser runs** the resulting JavaScript

You never need to run the TypeScript compiler manually - Vite handles everything.

## Project Files Explained

### index.html - The Entry Point

```html
<script type="module" src="/src/main.ts"></script>
```

The browser loads `index.html`, which references `main.ts`. Vite intercepts this request and serves compiled JavaScript.

### tsconfig.json - TypeScript Settings

This file configures how TypeScript behaves:

```json
{
  "compilerOptions": {
    "target": "ES2022",        // Output modern JavaScript
    "strict": true,            // Enable strict type checking
    "noUnusedLocals": true,    // Error on unused variables
    "noUnusedParameters": true // Error on unused function parameters
  },
  "include": ["src"]           // Only check files in src/
}
```

**Key settings explained:**

| Setting | What it does |
|---------|--------------|
| `target: "ES2022"` | Use modern JavaScript features |
| `strict: true` | Catch more potential bugs |
| `noEmit: true` | Don't output files (Vite handles this) |
| `moduleResolution: "bundler"` | Let Vite resolve imports |

### package.json - Scripts

```json
{
  "scripts": {
    "dev": "vite",           // Start dev server
    "build": "tsc && vite build",  // Type-check, then build
    "preview": "vite preview" // Preview production build
  }
}
```

## Understanding the Code

### Imports

```typescript
// Import CSS files (Vite handles these)
import './style.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Import JavaScript/TypeScript modules
import maplibregl from 'maplibre-gl';
import { Geoman } from '@geoman-io/maplibre-geoman-free';
```

### Type Annotations

TypeScript adds types to make code safer:

```typescript
// Variable with type
const BASE_MAP_STYLE: string = 'https://...';

// Function parameter with type
onFeatureCreate: (feature: any) => console.log('Created:', feature)

// Object with specific type
const geojson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [...]
};
```

### The `any` Type

When you see `any`, it means "skip type checking for this":

```typescript
onFeatureCreate: (feature: any) => console.log(feature)
```

Use `any` sparingly - it defeats the purpose of TypeScript. It's used here because the library doesn't provide proper types.

## Development Workflow

### 1. Start the Dev Server

```bash
npm run dev
```

This starts Vite at `http://localhost:5173` with:
- **Hot Module Replacement (HMR)**: Changes appear instantly without refresh
- **TypeScript compilation**: Errors show in terminal and browser

### 2. Write Code

Edit `src/main.ts`. When you save:
1. Vite recompiles the TypeScript
2. Browser updates automatically
3. Errors appear in terminal if any

### 3. Check for Errors

TypeScript errors appear in:
- **Terminal**: Where you ran `npm run dev`
- **Browser console**: DevTools → Console
- **IDE**: Red underlines in VS Code

Example error:
```
src/main.ts:15:3 - error TS2322: Type 'number' is not assignable to type 'string'.
```

### 4. Build for Production

```bash
npm run build
```

This runs:
1. `tsc` - Type-checks all files (fails if errors exist)
2. `vite build` - Bundles and minifies for production

Output goes to `dist/` folder.

## Common TypeScript Patterns in This Project

### Creating a Map

```typescript
const map = new maplibregl.Map({
  container: 'map',      // HTML element ID
  style: BASE_MAP_STYLE, // Map style URL
  center: [0, 0],        // [longitude, latitude]
  zoom: 2,               // Zoom level
});
```

### Event Handlers

```typescript
map.on('load', () => {
  // Code runs when map finishes loading
  console.log('Map loaded!');
});
```

### Adding Layers

```typescript
map.addLayer({
  id: 'my-layer',           // Unique identifier
  type: 'fill',             // Layer type: fill, line, circle, etc.
  source: 'my-source',      // Data source name
  paint: {
    'fill-color': '#088',   // Style properties
    'fill-opacity': 0.5
  }
});
```

## Tips for Beginners

### 1. Let TypeScript Guide You

When you type `map.`, your IDE shows available methods. This is IntelliSense powered by TypeScript.

### 2. Hover for Types

Hover over any variable in VS Code to see its type:
```
const map: maplibregl.Map
```

### 3. Read Error Messages

TypeScript errors are helpful:
```
Property 'addLaye' does not exist on type 'Map'. Did you mean 'addLayer'?
```

### 4. Use `console.log` for Debugging

```typescript
map.on('load', () => {
  console.log('Style:', map.getStyle());
  console.log('Layers:', map.getStyle()?.layers);
});
```

### 5. Start Simple

Modify existing code before writing new code. Change a color, move the map center, or adjust zoom level to see how things work.

## Quick Reference

| Command | What it does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

| File | Purpose |
|------|---------|
| `src/main.ts` | Main application code |
| `src/style.css` | Global styles |
| `index.html` | HTML entry point |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build configuration |

## Next Steps

1. **Modify `src/main.ts`** - Change map center, zoom, or colors
2. **Add a new layer** - Copy an existing `addLayer` block and modify it
3. **Read MapLibre docs** - https://maplibre.org/maplibre-gl-js/docs/
4. **Learn more TypeScript** - https://www.typescriptlang.org/docs/handbook/
