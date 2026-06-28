import { useState, useEffect } from 'react';
import { eventApi } from '../../../../../../utils/api';
import { validateEventForm } from '../utils/eventValidation';
import type { EventFormErrors } from '../utils/eventValidation';
import type { Event } from '../types/event';

interface UseCreateEventOptions {
    eventToEdit?: Event | null;
    onSuccess: () => void;
}

export function useCreateEvent({ eventToEdit, onSuccess }: UseCreateEventOptions) {
    const [values, setValues] = useState({
        title: '',
        description: '',
        date_time: '',
        location: '',
        capacity: '' as string | number,
        status: 'active'
    });

    const [errors, setErrors] = useState<EventFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Load event data if editing
    useEffect(() => {
        if (eventToEdit) {
            // format datetime-local input: YYYY-MM-DDTHH:MM
            let formattedDate = '';
            if (eventToEdit.date_time) {
                const d = new Date(eventToEdit.date_time);
                if (!isNaN(d.getTime())) {
                    const tzOffset = d.getTimezoneOffset() * 60000; // in ms
                    const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
                    formattedDate = localISOTime;
                }
            }

            setValues({
                title: eventToEdit.title || '',
                description: eventToEdit.description || '',
                date_time: formattedDate,
                location: eventToEdit.location || '',
                capacity: eventToEdit.capacity || '',
                status: eventToEdit.status || 'active'
            });
        } else {
            setValues({
                title: '',
                description: '',
                date_time: '',
                location: '',
                capacity: '',
                status: 'active'
            });
        }
        setErrors({});
        setSubmitError(null);
    }, [eventToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error on change
        if (errors[name as keyof EventFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        const formErrors = validateEventForm(values);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setSubmitting(true);

        const payload = {
            title: values.title.trim(),
            description: values.description.trim(),
            date_time: values.date_time,
            location: values.location.trim(),
            capacity: values.capacity === '' ? 0 : Number(values.capacity),
            status: values.status
        };

        let res;
        if (eventToEdit) {
            res = await eventApi.updateEvent(eventToEdit.id, payload);
        } else {
            res = await eventApi.createEvent(payload);
        }

        setSubmitting(false);

        if (res.error) {
            setSubmitError(res.error);
        } else {
            onSuccess();
        }
    };

    return {
        values,
        errors,
        submitting,
        submitError,
        handleChange,
        handleSubmit,
        setValues
    };
}
