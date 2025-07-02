# 🎨 Pixelwar

> *C'est des couleurs... qui se battent.* 😄

## 🧠 Concept

**Pixelwar** est une simulation visuelle où des **clusters de couleurs** apparaissent, grandissent, et s’affrontent. Chaque pixel en **bordure de cluster** a une **chance de se reproduire**, ce qui permet au cluster de **s'étendre progressivement**.

👉 Si un cluster survit **assez longtemps**, il peut même développer... des **missiles** 💥 !

---

## 🚀 Lancer le projet

### 🧱 Installation

```bash
npm create vite@latest pixelwar -- --template vanilla-ts
```

```bash
npm create vite@latest from-scatch -- --template vanilla-ts # sélectionner le vanilla
```
coller ça dans tsconfig.json 
```bash
"types":["vite/client", "@webgpu/types"]
```
```bash
npm install dat.gui
npm install -D @types/dat.gui @webgpu/types
```
pour run cd dans ton folder et  
```bash
npm run dev 
```