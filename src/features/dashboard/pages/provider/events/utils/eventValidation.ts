export interface EventFormErrors {
    title?: string;
    description?: string;
    date_time?: string;
    location?: string;
    capacity?: string;
}

export function validateEventForm(values: {
    title: string;
    description: string;
    date_time: string;
    location: string;
    capacity: number | string;
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

    return errors;
}
