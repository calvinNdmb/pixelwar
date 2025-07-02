//import du gpu
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const adapter = await navigator.gpu?.requestAdapter({
  featureLevel: 'compatibility',
});
const device = await adapter?.requestDevice();
function quitIfWebGPUNotAvailable(
  adapter: GPUAdapter | null | undefined,
  device: GPUDevice | null | undefined
) {
  if (!adapter || !device) {
    const message = "WebGPU is not supported on this browser!";
    document.body.innerHTML = `<div style="text-align: center; color: white; background-color: #f00; padding: 20px; font-family: sans-serif;">${message}</div>`;
    throw new Error(message);
  }
}
quitIfWebGPUNotAvailable(adapter, device);

const context = canvas.getContext('webgpu') as GPUCanvasContext;
const devicePixelRatio = window.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
  device: device!,
  format: presentationFormat,
});



//Nous devons créer des zones de mémoire sur le GPU pour stocker nos données. Ces zones sont appelées GPUBuffer.

//taille de la grille

// Stocke les coordonnées des 4 sommets qui forment un carré
// Le shader de rendu l'utilisera comme modèle pour dessiner chaque cellule.

//buffer0 et buffer1 : Ce sont les buffers les plus importants. Ils contiennent l'état (0 ou 1) de chaque cellule de la grille. 
// On en utilise deux pour une technique appelée ping-pong : 
// à chaque étape, on lit l'état actuel depuis un buffer (ex: buffer0) et on écrit le nouvel état dans l'autre (ex: buffer1). 
// À l'étape suivante, on inverse les rôles. Cela évite les conflits de lecture/écriture.

