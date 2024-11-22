import type {UserConfig} from 'vite';

export default {
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