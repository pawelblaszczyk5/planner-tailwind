import racPlugin from "tailwindcss-react-aria-components";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			xs: "480px",
			...defaultTheme.screens,
		},
		extend: {
			fontFamily: {
				sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	// @ts-expect-error -- something off with rac tailwindcss plugin
	plugins: [racPlugin({ prefix: "rac" })],
	future: {
		hoverOnlyWhenSupported: true,
	},
	experimental: {
		optimizeUniversalDefaults: true,
	},
};
