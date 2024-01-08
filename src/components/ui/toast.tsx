import type { AriaToastProps } from "@react-aria/toast";
import type { ToastState } from "@react-stately/toast";

import { useToast, useToastRegion } from "@react-aria/toast";
import { ToastQueue, useToastQueue } from "@react-stately/toast";
import { useRef } from "react";
import { createPortal } from "react-dom";
import TablerInfoCircleFilled from "virtual:icons/tabler/info-circle-filled";

import { Button } from "#/components/ui/button";

type ToastOptions = {
	name: string;
	onRestore: () => void;
};

const toastQueue = new ToastQueue<ToastOptions>({
	maxVisibleToasts: 5,
});

const Toast = ({ state, ...props }: AriaToastProps<ToastOptions> & { state: ToastState<ToastOptions> }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { closeButtonProps, titleProps, toastProps } = useToast(props, state, ref);

	const handleUndoPress = () => {
		state.close(props.toast.key);
		props.toast.content.onRestore();
	};

	return (
		<div
			className="flex w-full items-start gap-3 rounded-md border-2 border-orange-7 bg-sand-1 p-4 shadow-md shadow-white/5"
			ref={ref}
			{...toastProps}
		>
			<TablerInfoCircleFilled className="text-2xl text-orange-12" />
			<div className="flex w-full flex-col gap-4">
				<h3 className="text-lg font-medium" {...titleProps}>
					Successfully deleted event &quot;{props.toast.content.name}&quot;
				</h3>
				<div className="flex items-center justify-end gap-4">
					<Button onPress={handleUndoPress}>Undo</Button>
					<Button variant="muted" {...closeButtonProps}>
						Discard
					</Button>
				</div>
			</div>
		</div>
	);
};

export const ToastRegion = () => {
	const ref = useRef<HTMLElement>(null);
	const state = useToastQueue(toastQueue);
	const { regionProps } = useToastRegion({}, state, ref);

	return state.visibleToasts.length > 0
		? createPortal(
				<div
					className="absolute bottom-4 right-4 z-20 flex w-full max-w-[min(calc(100vw-32px),24rem)] flex-col gap-4 outline-offset-2 outline-blue-8 rac-focus-visible:outline-2"
					{...regionProps}
				>
					{state.visibleToasts.map(toast => (
						<Toast key={toast.key} state={state} toast={toast} />
					))}
				</div>,
				document.body,
			)
		: null;
};

const TOAST_TIMEOUT = 5_000;

// eslint-disable-next-line react-refresh/only-export-components
export const addEventDeletionNotification = (options: ToastOptions) =>
	toastQueue.add(
		{ ...options },
		{
			priority: 1_000,
			timeout: TOAST_TIMEOUT,
		},
	);
