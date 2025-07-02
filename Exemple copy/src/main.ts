const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter!.requestDevice();
const context = canvas.getContext("webgpu");

const format = navigator.gpu.getPreferredCanvasFormat();
context!.configure({
  device,
  format,
  alphaMode: "opaque",
});

// --- Shaders WGSL ---
const vertexShaderCode = `
struct VertexOut {
  @builtin(position) Position : vec4<f32>,
  @location(0) color : vec4<f32>,
};

@vertex
fn main(
  @location(0) position: vec2<f32>,
  @location(1) color: vec4<f32>
) -> VertexOut {
  var output: VertexOut;
  output.Position = vec4<f32>(position, 0.0, 1.0);
  output.color = color;
  return output;
}
`;

const fragmentShaderCode = `
@fragment
fn main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
  return color;
}
`;

// --- Cube Rouge + Noir ---
const red = [1, 0, 0, 1];
const black = [0, 0, 0, 1];

// Deux carrés : positions entre -1 et 1 (espace clip WebGPU)
const vertices = new Float32Array([
  // Carré Rouge à gauche
  -0.8,  0.4,  ...red,
  -0.4,  0.4,  ...red,
  -0.8,  0.0,  ...red,
  -0.8,  0.0,  ...red,
  -0.4,  0.4,  ...red,
  -0.4,  0.0,  ...red,

  // Carré Noir à droite
   0.4,  0.4,  ...black,
   0.8,  0.4,  ...black,
   0.4,  0.0,  ...black,
   0.4,  0.0,  ...black,
   0.8,  0.4,  ...black,
   0.8,  0.0,  ...black,
]);

const vertexBuffer = device.createBuffer({
  size: vertices.byteLength,
  usage: GPUBufferUsage.VERTEX,
  mappedAtCreation: true,
});
new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
vertexBuffer.unmap();

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: {
    module: device.createShaderModule({ code: vertexShaderCode }),
    entryPoint: "main",
    buffers: [{
      arrayStride: 6 * 4, // 2 position + 4 couleur (chaque float = 4 bytes)
      attributes: [
        { shaderLocation: 0, offset: 0, format: "float32x2" }, // position
        { shaderLocation: 1, offset: 2 * 4, format: "float32x4" }, // couleur
      ],
    }],
  },
  fragment: {
    module: device.createShaderModule({ code: fragmentShaderCode }),
    entryPoint: "main",
    targets: [{ format }],
  },
  primitive: {
    topology: "triangle-list",
  },
});

function frame() {
  const commandEncoder = device.createCommandEncoder();
  const textureView = context!.getCurrentTexture().createView();
  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [{
      view: textureView,
      loadOp: "clear",
      clearValue: { r: 1, g: 1, b: 1, a: 1 }, // fond blanc
      storeOp: "store",
    }],
  });

  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(12); // 6 sommets × 2 carrés
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
