// Optimizes icons/raw/*.svg into icons/ with SVGO
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { optimize } from 'svgo';

const srcDir = new URL('../icons/raw/', import.meta.url);
const outDir = new URL('../icons/', import.meta.url);

// Figma wraps exports in a <clipPath> that covers the whole frame and clips nothing
const removeFrameClip = {
  name: 'removeFrameClip',
  fn: () => {
    const frameClipIds = new Set();
    let viewBox;

    const walk = (node, visit) => {
      for (const child of [...(node.children ?? [])]) {
        if (child.type === 'element') {
          visit(child, node);
          walk(child, visit);
        }
      }
    };

    return {
      root: {
        exit: (root) => {
          walk(root, (el, parent) => {
            if (el.name === 'svg') viewBox = el.attributes.viewBox;
            const [rect] = el.children;
            const isFrameClip =
              el.name === 'clipPath' &&
              el.children.length === 1 &&
              rect.name === 'rect' &&
              !rect.attributes.x &&
              !rect.attributes.y &&
              `0 0 ${rect.attributes.width} ${rect.attributes.height}` === viewBox;
            if (isFrameClip) {
              frameClipIds.add(el.attributes.id);
              parent.children = parent.children.filter((c) => c !== el);
            }
          });
          walk(root, (el) => {
            const ref = el.attributes['clip-path']?.match(/^url\(#(.+)\)$/)?.[1];
            if (frameClipIds.has(ref)) delete el.attributes['clip-path'];
          });
        },
      },
    };
  },
};

// viewBox is kept by preset-default in SVGO 4; colors are left alone because
// fill="none" and stroke define the shape the mask uses
const svgoConfig = {
  multipass: true,
  plugins: [removeFrameClip, 'preset-default', 'removeDimensions'],
};

const files = readdirSync(srcDir).filter((file) => file.endsWith('.svg'));

// Remove previous output so icons deleted from raw/ disappear too; raw/ itself is kept
for (const file of readdirSync(outDir)) {
  if (file.endsWith('.svg')) rmSync(new URL(file, outDir));
}

let srcBytes = 0;
let outBytes = 0;

for (const file of files) {
  const src = readFileSync(new URL(file, srcDir), 'utf8');
  const { data } = optimize(src, { ...svgoConfig, path: file });
  writeFileSync(new URL(file, outDir), data);
  srcBytes += Buffer.byteLength(src);
  outBytes += Buffer.byteLength(data);
}

console.log(`Optimized ${files.length} icons: ${srcBytes} B -> ${outBytes} B`);
