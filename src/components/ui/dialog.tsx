import type { ComponentPropsWithoutRef } from "react";

import { Dialog as RacDialog, Modal as RacModal, ModalOverlay as RacModalOverlay } from "react-aria-components";

import { cx } from "#/utils/classnames";

export const Modal = ({ className, ...props }: ComponentPropsWithoutRef<typeof RacModal>) => (
	<RacModal
		className={values => {
			const overrides = typeof className === "function" ? className(values) : className;

			return cx("absolute left-1/2 top-16 grid w-full -translate-x-1/2 place-items-center px-4 xs:px-8", overrides);
		}}
		{...props}
	/>
);

export const ModalOverlay = ({
	className,
	isDismissable = true,
	...props
}: ComponentPropsWithoutRef<typeof RacModalOverlay>) => (
	<RacModalOverlay
		className={values => {
			const overrides = typeof className === "function" ? className(values) : className;

			return cx("absolute inset-0 z-10 bg-black/80", overrides);
		}}
		isDismissable={isDismissable}
		{...props}
	/>
);

export const Dialog = ({ className, ...props }: ComponentPropsWithoutRef<typeof RacDialog>) => (
	<RacDialog className={cx("w-full max-w-[600px] rounded-md bg-sand-2 p-6 outline-none", className)} {...props} />
);

export { DialogTrigger } from "react-aria-components";
