import type {UserConfig} from 'vite';

export default {
	publicDir: 'doc',
	base: './',
	build: {
		target: 'esnext',
		rollupOptions: {
			output	: {
				entryFileNames: 'web.js',
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
		// outDir: 'docs',
		// emptyOutDir: false,
		// copyPublicDir: false,
		chunkSizeWarningLimit: 700,
	},
} satisfies UserConfig;