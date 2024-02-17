import type { CalendarDate } from "@internationalized/date";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDateFormatter } from "react-aria";
import {
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
	Heading,
	Calendar as RacCalendar,
} from "react-aria-components";
import { useNavigate, useParams } from "react-router-dom";
import TablerArrowBigLeft from "virtual:icons/tabler/arrow-big-left";
import TablerArrowBigRight from "virtual:icons/tabler/arrow-big-right";
import TablerCalendar from "virtual:icons/tabler/calendar";
import TablerPencil from "virtual:icons/tabler/pencil";
import TablerTrash from "virtual:icons/tabler/trash";

import type { EventEntry } from "#/lib/data";

import { EventForm } from "#/components/event-form";
import { Button } from "#/components/ui/button";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "#/components/ui/dialog";
import { addEventDeletionNotification } from "#/components/ui/toast";
import { deleteEvent, restoreEvent, useEventsCountForDate, useEventsForDate } from "#/lib/data";
import { cx } from "#/utils/classnames";
import {
	convertCalendarDateToDate,
	convertIsoStringToZonedDateTime,
	getCurrentCalendarDate,
	parseDateParts,
} from "#/utils/date";

const HeaderRow = () => (
	<CalendarGridHeader className="min-h-8">
		{day => (
			<CalendarHeaderCell className="w-[calc(100%/7)]">
				<span className="m-[3px] flex min-h-8 items-center justify-end p-2 text-xs font-semibold text-orange-12 xs:m-1.5 xs:p-2.5 xs:text-base">
					{day}
				</span>
			</CalendarHeaderCell>
		)}
	</CalendarGridHeader>
);

const DayCell = ({ date }: { date: CalendarDate }) => {
	const eventsForDate = useEventsCountForDate(date) ?? 0;

	return (
		<CalendarCell
			className={cx(
				"m-[3px] flex min-h-16 flex-col rounded-md p-2 outline-none outline-offset-1 transition-colors rac-outside-month:text-sand-10 rac-hover:bg-sand-4 rac-focus-visible:outline-2 rac-focus-visible:outline-blue-8 rac-selected:bg-orange-5 xs:m-1.5 xs:p-2.5 xs:outline-offset-4",
				date.toDate("utc").getDay() % 6 === 0 && "bg-sand-2",
			)}
			date={date}
		>
			{({ formattedDate }) => (
				<>
					<span className="text-right text-sm xs:text-lg">{formattedDate}</span>
					{eventsForDate > 0 && (
						<div className="mt-auto flex items-center">
							{/* TODO: Indicate somehow that ther're more events */}
							{Array.from({ length: Math.min(eventsForDate, 4) }).map((_, index) => (
								<span className="mr-[-3px] size-2 rounded-full bg-orange-9" key={index} />
							))}
						</div>
					)}
				</>
			)}
		</CalendarCell>
	);
};

const Header = () => (
	<header className="flex items-center justify-between">
		<Button slot="previous" variant="muted">
			<TablerArrowBigLeft />
		</Button>
		<Heading className="text-xl font-semibold text-orange-12" />
		<Button slot="next" variant="muted">
			<TablerArrowBigRight />
		</Button>
	</header>
);

const Calendar = ({ date, onDateChange }: { date: CalendarDate; onDateChange: (date: CalendarDate) => void }) => {
	const [focusedDate, setFocusedDate] = useState(date);

	// TODO: Maybe this one could be solved in a better way
	useEffect(() => {
		setFocusedDate(date);
	}, [date]);

	return (
		<RacCalendar
			aria-label="Events"
			className="flex w-full flex-col gap-4"
			defaultFocusedValue={date}
			focusedValue={focusedDate}
			onChange={onDateChange}
			onFocusChange={setFocusedDate}
			value={date}
		>
			<Header />
			<CalendarGrid className="table-fixed" weekdayStyle="short">
				<HeaderRow />
				<CalendarGridBody>{date => <DayCell date={date} />}</CalendarGridBody>
			</CalendarGrid>
		</RacCalendar>
	);
};

const Event = ({ event }: { event: EventEntry }) => {
	const formatter = useDateFormatter({
		dateStyle: "short",
		timeStyle: "short",
	});

	const handleEventDelete = async () => {
		await deleteEvent(event.id);

		addEventDeletionNotification({
			name: event.name,
			onRestore: async () => {
				await restoreEvent(event);
			},
		});
	};

	return (
		<li className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-2xl font-medium">{event.name}</h3>
				<p>
					{formatter.format(convertIsoStringToZonedDateTime(event.startDate).toDate())} -{" "}
					{formatter.format(convertIsoStringToZonedDateTime(event.endDate).toDate())}
				</p>
			</div>
			<p>{event.description}</p>
			<div className="flex items-center justify-end gap-3">
				<Button onPress={handleEventDelete} variant="negative">
					Delete event <TablerTrash />
				</Button>
				<DialogTrigger>
					<Button>
						Edit event <TablerPencil />
					</Button>
					<ModalOverlay>
						<Modal>
							<Dialog>{({ close }) => <EventForm event={event} onCancel={close} onComplete={close} />}</Dialog>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</div>
		</li>
	);
};

const List = ({ date }: { date: CalendarDate }) => {
	const formatter = useDateFormatter();
	const navigate = useNavigate();

	const { eventsForDate, eventsFromFuture } = useEventsForDate(date) ?? { eventsForDate: [], eventsFromFuture: [] };

	const navigateToToday = () => {
		const currentDate = getCurrentCalendarDate();

		navigate(`/${currentDate.year}/${currentDate.month}/${currentDate.day}`);
	};

	return (
		<div className="flex w-full flex-col gap-8">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-2xl font-semibold xs:text-3xl">
					Events for {formatter.format(convertCalendarDateToDate(date))}
				</h2>
				<Button className="whitespace-nowrap" onPress={navigateToToday} variant="muted">
					Go to today
					<TablerCalendar />
				</Button>
			</div>
			{eventsForDate.length > 0 ? (
				<ul className="flex flex-col gap-4">
					{eventsForDate.map(event => (
						<Event event={event} key={event.id} />
					))}
				</ul>
			) : (
				<p className="text-sand-11">No events for selected date</p>
			)}
			{eventsFromFuture.length > 0 && (
				<>
					<h2 className="text-2xl font-semibold xs:text-3xl">Events for near future</h2>
					<ul className="flex flex-col gap-4">
						{eventsFromFuture.map(event => (
							<Event event={event} key={event.id} />
						))}
					</ul>
				</>
			)}
		</div>
	);
};

const useParsedDate = () => {
	const { day, month, year } = useParams();

	const parsedDate = useMemo(() => parseDateParts(year, month, day), [day, month, year]);

	return parsedDate;
};

const useCalendarDate = () => {
	const navigate = useNavigate();
	const parsedDate = useParsedDate();

	const currentDate = getCurrentCalendarDate();

	// Using useLayoutEffect instead of using navigate during rendering because we shouldn't update parent state in render
	useLayoutEffect(() => {
		if (!parsedDate) navigate(`/${currentDate.year}/${currentDate.month}/${currentDate.day}`);
	}, [parsedDate, navigate, currentDate]);

	return parsedDate ?? currentDate;
};

export const EventsCalendar = () => {
	const navigate = useNavigate();
	const date = useCalendarDate();

	const navigateToDate = (date: CalendarDate) => {
		navigate(`/${date.year}/${date.month}/${date.day}`);
	};

	return (
		<div className="flex flex-col gap-8">
			<Calendar date={date} onDateChange={navigateToDate} />
			<List date={date} />
		</div>
	);
};
