const STATUS_MESSAGES = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: "You don't have permission to perform this action.",
  404: 'The requested resource was not found.',
  408: 'The request timed out. Please try again.',
  409: 'A conflict occurred. This item may already exist.',
  422: 'The provided data is invalid. Please review your input.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again later.',
  502: 'Service is temporarily unavailable. Please try again later.',
  503: 'Service is temporarily unavailable. Please try again later.',
}

const RAW_PATTERNS = [
  [/unauthorized/i,          'Your session has expired. Please log in again.'],
  [/forbidden/i,             "You don't have permission to perform this action."],
  [/not found/i,             'The requested resource was not found.'],
  [/already exists/i,        'This item already exists. Please use a different value.'],
  [/duplicate key/i,         'This item already exists. Please use a different value.'],
  [/validation (failed|error)/i, 'Please check your input and try again.'],
  [/failed to fetch/i,       'Unable to connect to the server. Please check your connection.'],
  [/network error/i,         'Unable to connect to the server. Please check your connection.'],
  [/load failed/i,           'Unable to connect to the server. Please check your connection.'],
  [/internal server error/i, 'Something went wrong on our end. Please try again later.'],
]

export function getErrorMessage(err) {
  if (err?.status && STATUS_MESSAGES[err.status]) {
    return STATUS_MESSAGES[err.status]
  }

  const raw = err?.message ?? ''

  for (const [pattern, friendly] of RAW_PATTERNS) {
    if (pattern.test(raw)) return friendly
  }

  return raw || 'An unexpected error occurred. Please try again.'
}
