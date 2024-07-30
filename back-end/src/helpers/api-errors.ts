export default function handleError(field?: string, error?: any) {


    if (error?.message.includes('Unique constraint failed on the fields')) {
        return `${field} already exists`;
    }

    if (error?.message.includes('Foreign key constraint failed on the field')) {
        return 'Appointment does not exist';
    }

    if (error?.message.includes('Argument `id` is missing')) {
        return 'id is required';
    }

    if (error?.message.includes('An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist')) {
        return `${field} does not exist`;
    }

    if (error?.message.includes('is missing')) {
        return 'all fields are required';
    }

    if (error?.message.includes('Unknown argument')) {
        return 'incorrect argument';
    }

    if (error?.message.includes('Invalid value provided. Expected String, provided Int')) {
        return 'invalid value provided. Expected String, provided Int';
    }

    if (error?.message.includes('Invalid value provided. Expected Int, provided String.')) {
        return 'Invalid value provided. Expected Int, provided String.';
    }

    if (error?.message.includes('Record to update not found.')) {
        return 'record to update not found.';
    }


    return error?.message;
}

