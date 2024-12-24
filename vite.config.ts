import type {UserConfig} from 'vite';

export default {
	publicDir: 'doc',
	build: {
		target: 'esnext',
		rollupOptions: {
			output	: {
				entryFileNames: 'web.js',
			//	chunkFileNames: 'vendor.js',
			},
		},
	},
} satisfies UserConfig;