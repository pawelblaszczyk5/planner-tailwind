import type { ZonedDateTime } from "@internationalized/date";
import type { ReactNode } from "react";

import { useMemo, useRef } from "react";
import {
	DateField,
	DateInput,
	DateSegment,
	Form,
	Heading,
	Input,
	FieldError as RacFieldError,
	Label as RacLabel,
	TextArea,
	TextField,
} from "react-aria-components";
import { useNavigate } from "react-router-dom";

import type { EventEntry } from "#/lib/data";

import { Button } from "#/components/ui/button";
import { addEvent, editEvent } from "#/lib/data";
import { cx, tw } from "#/utils/classnames";
import { convertDateFromForm, convertIsoStringToZonedDateTime, getCurrentZonedDateTime } from "#/utils/date";
import { invariant } from "#/utils/invariant";

const fieldClassNames = tw`flex flex-col gap-1.5`;

const inputClassNames = tw`rounded border border-orange-7 bg-sand-1 px-2.5 py-2 text-sm outline-2 outline-offset-2 focus:outline focus:outline-2 focus:outline-blue-8 rac-invalid:border-red-7`;

const Label = ({ children }: { children: ReactNode }) => (
	<RacLabel className="text-sm font-medium">{children}</RacLabel>
);

const FieldError = () => <RacFieldError className="text-sm text-red-11" />;

export const EventForm = ({
	event,
	onCancel,
	onComplete,
}: {
	event: EventEntry | undefined;
	onCancel: () => void;
	onComplete: () => void;
}) => {
	const form = useRef<HTMLFormElement>(null);
	const navigate = useNavigate();

	const defaultDates = useMemo(() => {
		if (!event) return { endDate: null, startDate: null };

		return {
			endDate: convertIsoStringToZonedDateTime(event.endDate),
			startDate: convertIsoStringToZonedDateTime(event.startDate),
		};
	}, [event]);

	const handleSubmission = async (formData: FormData) => {
		const name = formData.get("name");
		const description = formData.get("description");
		const startDate = formData.get("startDate");
		const endDate = formData.get("endDate");

		invariant(
			typeof name === "string" &&
				typeof description === "string" &&
				typeof startDate === "string" &&
				typeof endDate === "string",
			"Form should have valid values after submission",
		);

		const convertedStartDate = convertDateFromForm(startDate);
		const convertedEndDate = convertDateFromForm(endDate);

		const data = {
			description,
			endDate: convertedEndDate,
			name,
			startDate: convertedStartDate,
		};

		await (event
			? editEvent({
					id: event.id,
					...data,
				})
			: addEvent(data));

		const dateToNavigate = convertIsoStringToZonedDateTime(convertedStartDate);

		navigate(`/${dateToNavigate.year}/${dateToNavigate.month}/${dateToNavigate.day}`);

		onComplete();
	};

	return (
		<Form action={handleSubmission} autoComplete="off" className="flex w-full flex-col gap-8" ref={form}>
			<Heading className="text-2xl font-semibold" slot="title">
				{event ? "Edit event" : "Add new event"}
			</Heading>
			<div className="flex flex-col gap-6">
				<TextField
					validate={value => {
						if (value.length === 0) return "This value is required";
						if (value.length < 3) return "This value should have at least 3 characters";
						if (value.length > 50) return "This value should have at most 50 characters";

						return null;
					}}
					className={fieldClassNames}
					defaultValue={event?.name ?? ""}
					maxLength={50}
					minLength={3}
					name="name"
					isRequired
				>
					<Label>Name</Label>
					<Input className={inputClassNames} />
					<FieldError />
				</TextField>
				<TextField
					validate={value => {
						if (value.length < 3) return "This value should have at least 3 characters";
						if (value.length > 255) return "This value should have at most 255 characters";

						return null;
					}}
					className={fieldClassNames}
					defaultValue={event?.description ?? ""}
					maxLength={255}
					minLength={3}
					name="description"
				>
					<Label>Description</Label>
					<TextArea className={inputClassNames} rows={3} />
					<FieldError />
				</TextField>
				<DateField<ZonedDateTime>
					validate={(value: ZonedDateTime | null) => {
						if (!value) return "This value should be a valid date";

						const formElement = form.current;

						// This case handles default values and validation before rendered
						if (!formElement) return null;

						const endDateElement = formElement.elements.namedItem("endDate");

						invariant(endDateElement instanceof HTMLInputElement);

						if (endDateElement.value && endDateElement.value <= value.toString())
							return 'This value should be before the "End date" field value';

						return null;
					}}
					className={fieldClassNames}
					defaultValue={defaultDates.startDate}
					name="startDate"
					placeholderValue={getCurrentZonedDateTime()}
					hideTimeZone
					isRequired
				>
					<Label>Start date</Label>
					<DateInput className={cx(inputClassNames, "flex")}>
						{segment => (
							<DateSegment
								className="rounded outline-none rac-placeholder-shown:text-sand-11 rac-focus:bg-blue-8"
								segment={segment}
							/>
						)}
					</DateInput>
					<FieldError />
				</DateField>
				<DateField<ZonedDateTime>
					validate={(value: ZonedDateTime | null) => {
						if (!value) return "This value should be a valid date";

						const formElement = form.current;

						// This case handles default values and validation before rendered
						if (!formElement) return null;

						const startDateElement = formElement.elements.namedItem("startDate");

						invariant(startDateElement instanceof HTMLInputElement);

						if (startDateElement.value && startDateElement.value >= value.toString())
							return 'This value should be after the "Start date" field value';

						return null;
					}}
					className={fieldClassNames}
					defaultValue={defaultDates.endDate}
					name="endDate"
					placeholderValue={getCurrentZonedDateTime()}
					hideTimeZone
					isRequired
				>
					<Label>End date</Label>
					<DateInput className={cx(inputClassNames, "flex")}>
						{segment => (
							<DateSegment
								className="rounded outline-none rac-placeholder-shown:text-sand-11 rac-focus:bg-blue-8"
								segment={segment}
							/>
						)}
					</DateInput>
					<FieldError />
				</DateField>
			</div>
			<div className="flex items-center justify-end gap-6">
				<Button onPress={onCancel} variant="muted">
					Cancel
				</Button>
				<Button type="submit">Save</Button>
			</div>
		</Form>
	);
};
