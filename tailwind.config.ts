import defaultTheme from "tailwindcss/defaultTheme";
import racPlugin from "tailwindcss-react-aria-components";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	experimental: {
		optimizeUniversalDefaults: true,
	},
	future: {
		hoverOnlyWhenSupported: true,
	},
	// @ts-expect-error -- something off with rac tailwindcss plugin
	plugins: [racPlugin({ prefix: "rac" })],
	theme: {
		colors: {
			black: "#000",
			blue: {
				"1": "#0d1520",
				"2": "#111927",
				"3": "#0d2847",
				"4": "#003362",
				"5": "#004074",
				"6": "#104d87",
				"7": "#205d9e",
				"8": "#2870bd",
				"9": "#0090ff",
				"10": "#3b9eff",
				"11": "#70b8ff",
				"12": "#c2e6ff",
			},
			current: "currentColor",
			jade: {
				"1": "#0d1512",
				"2": "#121c18",
				"3": "#0f2e22",
				"4": "#0b3b2c",
				"5": "#114837",
				"6": "#1b5745",
				"7": "#246854",
				"8": "#2a7e68",
				"9": "#29a383",
				"10": "#27b08b",
				"11": "#1fd8a4",
				"12": "#adf0d4",
			},
			orange: {
				"1": "#17120e",
				"2": "#1e160f",
				"3": "#331e0b",
				"4": "#462100",
				"5": "#562800",
				"6": "#66350c",
				"7": "#7e451d",
				"8": "#a35829",
				"9": "#f76b15",
				"10": "#ff801f",
				"11": "#ffa057",
				"12": "#ffe0c2",
			},
			red: {
				"1": "#191111",
				"2": "#201314",
				"3": "#3b1219",
				"4": "#500f1c",
				"5": "#611623",
				"6": "#72232d",
				"7": "#8c333a",
				"8": "#b54548",
				"9": "#e5484d",
				"10": "#ec5d5e",
				"11": "#ff9592",
				"12": "#ffd1d9",
			},

			sand: {
				"1": "#111110",
				"2": "#191918",
				"3": "#222221",
				"4": "#2a2a28",
				"5": "#31312e",
				"6": "#3b3a37",
				"7": "#494844",
				"8": "#62605b",
				"9": "#6f6d66",
				"10": "#7c7b74",
				"11": "#b5b3ad",
				"12": "#eeeeec",
			},
			transparent: "transparent",
			white: "#fff",
			yellow: {
				"1": "#14120b",
				"2": "#1b180f",
				"3": "#2d2305",
				"4": "#362b00",
				"5": "#433500",
				"6": "#524202",
				"7": "#665417",
				"8": "#836a21",
				"9": "#ffe629",
				"10": "#ffff57",
				"11": "#f5e147",
				"12": "#f6eeb4",
			},
		},
		extend: {
			fontFamily: {
				sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
			},
		},
		screens: {
			xs: "480px",
			...defaultTheme.screens,
		},
	},
};
