import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/bin/scaffold.ts', 'src/generators/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    target: 'node18',
    splitting: true,
    treeshake: true,
    outDir: 'dist',
    skipNodeModulesBundle: true,
    noExternal: [],
});
