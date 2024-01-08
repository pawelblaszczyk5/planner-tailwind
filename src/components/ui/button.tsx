import type { ComponentPropsWithoutRef } from "react";

import { Button as RacButton } from "react-aria-components";

import type { Variants } from "#/utils/css";

import { cva } from "#/utils/classnames";

const button = cva({
	base: "flex h-9 items-center gap-1.5 rounded px-2.5 py-2 font-semibold text-white outline-none outline-offset-2 transition-colors rac-focus-visible:outline-2 rac-focus-visible:outline-blue-8",
	variants: {
		variant: {
			base: "bg-orange-9 hover:bg-orange-10",
			muted: "bg-orange-3 hover:bg-orange-4",
			negative: "bg-red-9 hover:bg-red-10",
		},
	},
});

export const Button = ({
	className,
	variant = "base",
	...props
}: ComponentPropsWithoutRef<typeof RacButton> & Variants<typeof button>) => (
	<RacButton
		className={values => {
			const overrides = typeof className === "function" ? className(values) : className;

			return button({ className: overrides, variant });
		}}
		{...props}
	/>
);
