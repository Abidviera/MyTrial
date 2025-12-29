/**
 * =============================================================
 *  Angular + Three.js Integration — Personal Dev Notes (.ts)
 * =============================================================
 * This file is used as a NOTEPAD inside the Angular project.
 * No runtime logic — documentation only.
 * Safe to keep inside /src/app/_notes/
 */

// =============================================================
// 1️⃣ Required Dependencies
// =============================================================

/*
# Three.js & Types
npm install three@^0.182.0
npm install @types/three@^0.182.0 --save-dev

# GSAP
npm install gsap@^3.14.2
npm install @types/gsap@^1.20.2 --save-dev

# Debug GUI
npm install dat.gui@^0.7.9
npm install @types/dat.gui@^0.7.13 --save-dev

# Utilities
npm install lenis@^1.3.16
npm install split-type@^0.3.4

npm install locomotive-scroll
npm install --save-dev @types/locomotive-scroll
npm install @studio-freight/lenis gsap

*/



// =============================================================
// 2️⃣ angular.json Configuration
// =============================================================

/*
Add inside architect.build.options

"styles": [
  "src/styles.scss",
  "node_modules/dat.gui/build/dat.gui.css"
],
"scripts": [
  "node_modules/gsap/dist/gsap.min.js",
  "node_modules/gsap/dist/ScrollTrigger.min.js",
  "node_modules/dat.gui/build/dat.gui.min.js"
]
*/

// =============================================================
// 3️⃣ tsconfig.json Setup
// =============================================================

/*
"compilerOptions": {
  "types": ["node"],
  "skipLibCheck": true,
  "esModuleInterop": true,
  "allowSyntheticDefaultImports": true
}
*/

// =============================================================
// 4️⃣ Hero Component Creation
// =============================================================

/*
ng generate component components/hero --standalone=false
*/

/*
Folder Structure:

src/app/components/hero/
 ├── hero.component.ts
 ├── hero.component.html
 └── hero.component.scss
*/

// =============================================================
// 5️⃣ App Module Registration
// =============================================================

/*
@NgModule({
  declarations: [
    AppComponent,
    HeroComponent
  ],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
*/

// =============================================================
// 6️⃣ Hero Template
// =============================================================

/*
<canvas class="webgl"></canvas>
<div id="preloader">Loading...</div>
*/

// =============================================================
// 7️⃣ Three.js Imports (Hero Component)
// =============================================================

/*
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
*/

// =============================================================
// 8️⃣ Global Declarations
// =============================================================

/*
Add inside src/typings.d.ts OR component file

declare const gsap: any;
declare const ScrollTrigger: any;
declare const dat: any;
*/

// =============================================================
// 9️⃣ Run Commands
// =============================================================

/*
# Dev
ng serve

# SSR
npm run serve:ssr:my-threejs-project

# Production
ng build --configuration production
*/

// =============================================================
// 🔟 One‑Shot Install Command
// =============================================================

/*
npm install three@^0.182.0 gsap@^3.14.2 dat.gui@^0.7.9 lenis@^1.3.16 split-type@^0.3.4 && \
npm install --save-dev @types/three@^0.182.0 @types/gsap@^1.20.2 @types/dat.gui@^0.7.13
*/

// =============================================================
// ✅ End of notes — this file is intentionally non-executable
// =============================================================

export {}; // keeps TypeScript compiler happy
