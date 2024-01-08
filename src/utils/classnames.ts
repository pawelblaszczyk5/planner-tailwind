import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { cva, cx } = defineConfig({
	hooks: {
		"cx:done": className => twMerge(className),
	},
});

export type { VariantProps } from "cva";

// This method is only for intellisense and formatting purposes
export const tw = String.raw;
