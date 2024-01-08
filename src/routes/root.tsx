import { I18nProvider, RouterProvider } from "react-aria-components";
import { Link, Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import TablerCalendarPlus from "virtual:icons/tabler/calendar-plus";

import { EventForm } from "#/components/event-form";
import { Button } from "#/components/ui/button";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "#/components/ui/dialog";
import { ToastRegion } from "#/components/ui/toast";
import { Logo } from "#/routes/logo";

export const Component = () => {
	const navigate = useNavigate();

	return (
		<div className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col gap-8 p-2 py-3 xs:p-4">
			<RouterProvider navigate={navigate}>
				<I18nProvider locale="en-US">
					<ToastRegion />
					<header className="flex items-center justify-between">
						<Logo />
						<DialogTrigger>
							<Button>
								Add new event
								<TablerCalendarPlus />
							</Button>
							<ModalOverlay>
								<Modal>
									<Dialog>{({ close }) => <EventForm event={undefined} onCancel={close} onComplete={close} />}</Dialog>
								</Modal>
							</ModalOverlay>
						</DialogTrigger>
					</header>
					<main>
						<Outlet />
					</main>
					<ScrollRestoration />
					<footer className="mt-auto text-center text-sm text-sand-11">
						<Link
							className="rounded-sm underline outline-2 outline-offset-2 outline-blue-8 focus-visible:outline"
							to="/"
						>
							Home
						</Link>{" "}
						|{" "}
						<Link
							className="rounded-sm underline outline-2 outline-offset-2 outline-blue-8 focus-visible:outline"
							to="/info"
						>
							Info
						</Link>{" "}
						|{" "}
						<a
							className="rounded-sm underline outline-2 outline-offset-2 outline-blue-8 focus-visible:outline"
							href="https://example.com"
							rel="noreferrer"
						>
							Tokenami&nbsp;version
						</a>
					</footer>
				</I18nProvider>
			</RouterProvider>
		</div>
	);
};

Component.displayName = "RootView";
