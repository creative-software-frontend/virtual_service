export interface EventFormErrors {
    title?: string;
    description?: string;
    date_time?: string;
    location?: string;
    capacity?: string;

    host_name?: string;
    entry_fee?: string;
    application_deadline?: string;
}

export function validateEventForm(values: {
    title: string;
    description: string;
    date_time: string;
    location: string;
    capacity: number | string;

    host_name: string;
    entry_fee: number | string;
    application_deadline: string;
}): EventFormErrors {

    const errors: EventFormErrors = {};

    if (!values.title || !values.title.trim()) {
        errors.title = 'Title is required';
    } else if (values.title.length > 100) {
        errors.title = 'Title must be 100 characters or less';
    }

    if (values.description && values.description.length > 1000) {
        errors.description = 'Description must be 1000 characters or less';
    }

    if (!values.date_time) {
        errors.date_time = 'Date and time are required';
    } else {
        const selectedDate = new Date(values.date_time);
        if (isNaN(selectedDate.getTime())) {
            errors.date_time = 'Invalid date and time';
        } else if (selectedDate.getTime() < Date.now()) {
            errors.date_time = 'Event date and time must be in the future';
        }
    }

    if (!values.location || !values.location.trim()) {
        errors.location = 'Location is required';
    } else if (values.location.length > 255) {
        errors.location = 'Location must be 255 characters or less';
    }

    const capacityNum = Number(values.capacity);
    if (values.capacity !== '' && (isNaN(capacityNum) || capacityNum < 0 || !Number.isInteger(capacityNum))) {
        errors.capacity = 'Capacity must be a non-negative integer';
    }

    if (!values.host_name || !values.host_name.trim()) {
        errors.host_name = 'Host name is required';
    } else if (values.host_name.length > 150) {
        errors.host_name = 'Host name must be 150 characters or less';
    }

    const feeNum = Number(values.entry_fee);
    if (values.entry_fee === '' || isNaN(feeNum)) {
        errors.entry_fee = 'Entry fee is required';
    } else if (feeNum < 0) {
        errors.entry_fee = 'Entry fee cannot be negative';
    }

    if (!values.application_deadline) {
        errors.application_deadline = 'Application deadline is required';
    } else {
        const deadlineDate = new Date(values.application_deadline);
        const eventDate = new Date(values.date_time);

        if (isNaN(deadlineDate.getTime())) {
            errors.application_deadline = 'Invalid application deadline';
        } else if (isNaN(eventDate.getTime())) {
            // date_time validation will show its own error
        } else if (deadlineDate.getTime() >= eventDate.getTime()) {
            errors.application_deadline = 'Application deadline must be before the event start time';
        }
    }

    return errors;
}

