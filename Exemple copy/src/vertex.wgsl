// vertex.wgsl
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
