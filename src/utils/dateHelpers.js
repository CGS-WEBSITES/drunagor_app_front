import { parse, isValid, parseISO } from 'date-fns'

const FALLBACK_TIMEZONE = 'America/Chicago'

/**
 * Detects which format a raw event_date string is in.
 * @param {string} str
 * @returns {'iso' | 'legacy' | 'unknown'}
 */
function detectFormat(str) {
  if (!str || typeof str !== 'string') return 'unknown'
  if (str.includes('T')) return 'iso'
  if (str.includes(';')) return 'legacy'
  return 'unknown'
}

/**
 * Parses a legacy date string "YYYY-MM-DD; hh:mm AM/PM" into a Date object.
 *
 * The returned Date's *local* hour/minute/day values are what we display.
 * Do NOT pass a timeZone to Intl when formatting this Date — see module doc.
 *
 * @param {string} str - e.g. "2026-05-05; 09:00 AM"
 * @returns {Date|null}
 */
function parseLegacyDate(str) {
  try {
    const [datePart, timePart] = str.split('; ')
    if (!datePart || !timePart) return null
    const combined = `${datePart.trim()} ${timePart.trim()}`
    const parsed = parse(combined, 'yyyy-MM-dd hh:mm aa', new Date())
    return isValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Parses an ISO 8601 string with UTC offset into a Date object.
 *
 * The UTC epoch is preserved. Always pass the user's IANA timezone to Intl
 * when formatting — see module doc.
 *
 * @param {string} str - e.g. "2026-05-09T11:00:00-03:00"
 * @returns {Date|null}
 */
function parseIsoDate(str) {
  try {
    const parsed = parseISO(str)
    return isValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Sanity-checks a raw event_date string before attempting to parse it.
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isValidApiDate(str) {
  if (!str || typeof str !== 'string') return false
  const format = detectFormat(str)
  if (format === 'unknown') return false
  return parseApiDate(str) !== null
}

/**
 * Parses a raw event_date string (either format) into a Date object.
 *
 * @param {string} str - Raw value from the API
 * @param {string} [_userTimezone] - Accepted for API compatibility; not used
 *   internally since the backend resolves timezone before serializing.
 * @returns {Date|null}
 */
export function parseApiDate(str, _userTimezone) {
  const format = detectFormat(str)
  if (format === 'iso') return parseIsoDate(str)
  if (format === 'legacy') return parseLegacyDate(str)
  return null
}

/**
 * Formats a raw event_date string for display.
 *
 * For ISO dates: passes userTimezone to Intl so display is correct regardless
 * of the browser's own timezone.
 *
 * For legacy dates: does NOT pass timezone to Intl — the nominal values
 * extracted from the string are already in the user's local time.
 *
 * @param {string} str - Raw value from the API
 * @param {string} [userTimezone] - IANA timezone (e.g. "America/Sao_Paulo").
 *   Falls back to FALLBACK_TIMEZONE for ISO dates if omitted.
 * @param {object} [opts]
 * @param {boolean} [opts.withTime=true]  - Include time in output
 * @param {boolean} [opts.short=false]    - Omit year (e.g. "May 9" vs "May 9, 2026")
 * @param {boolean} [opts.weekday=false]  - Prepend short weekday (e.g. "Sat, May 9")
 * @param {boolean} [opts.dateOnly=false] - Suppress time regardless of withTime
 * @returns {string} Formatted string, or '' if parsing fails
 */
export function formatEventDate(str, userTimezone, opts = {}) {
  const format = detectFormat(str)
  const date = parseApiDate(str)
  if (!date) return ''

  const {
    withTime = true,
    short = false,
    weekday = false,
    dateOnly = false,
  } = opts

  const showTime = withTime && !dateOnly

  /** @type {Intl.DateTimeFormatOptions} */
  const formatOptions = {
    month: short ? 'short' : 'long',
    day: 'numeric',
  }

  if (!short) {
    formatOptions.year = 'numeric'
  }

  if (weekday) {
    formatOptions.weekday = 'short'
  }

  if (showTime) {
    formatOptions.hour = '2-digit'
    formatOptions.minute = '2-digit'
    formatOptions.hour12 = true
  }

  // ISO: apply timezone explicitly so display is browser-tz-independent.
  // Legacy: omit timezone so the Date's local parts are used as-is.
  if (format === 'iso') {
    formatOptions.timeZone = userTimezone || FALLBACK_TIMEZONE
  }

  try {
    return new Intl.DateTimeFormat('en-US', formatOptions).format(date)
  } catch {
    // Unknown timezone string — retry without tz option
    try {
      const fallback = { ...formatOptions }
      delete fallback.timeZone
      return new Intl.DateTimeFormat('en-US', fallback).format(date)
    } catch {
      return ''
    }
  }
}

/**
 * Extracts the zero-padded day-of-month string from a raw event_date.
 * Replaces: String(event.event_date).split("T")[0].split("-")[2]
 *
 * @param {string} str
 * @param {string} [userTimezone]
 * @returns {string} e.g. "09", or '' on failure
 */
export function extractDay(str, userTimezone) {
  const format = detectFormat(str)
  const date = parseApiDate(str)
  if (!date) return ''

  /** @type {Intl.DateTimeFormatOptions} */
  const opts = { day: '2-digit' }
  if (format === 'iso') opts.timeZone = userTimezone || FALLBACK_TIMEZONE

  try {
    return new Intl.DateTimeFormat('en-US', opts).format(date)
  } catch {
    return new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date)
  }
}

/**
 * Extracts the uppercase abbreviated month name from a raw event_date.
 * Replaces: new Date(event.event_date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()
 *
 * @param {string} str
 * @param {string} [userTimezone]
 * @returns {string} e.g. "MAY", or '' on failure
 */
export function extractMonth(str, userTimezone) {
  const format = detectFormat(str)
  const date = parseApiDate(str)
  if (!date) return ''

  /** @type {Intl.DateTimeFormatOptions} */
  const opts = { month: 'short' }
  if (format === 'iso') opts.timeZone = userTimezone || FALLBACK_TIMEZONE

  try {
    return new Intl.DateTimeFormat('en-US', opts).format(date).toUpperCase()
  } catch {
    return new Intl.DateTimeFormat('en-US', { month: 'short' })
      .format(date)
      .toUpperCase()
  }
}

/**
 * Extracts the formatted time string from a raw event_date.
 * Replaces: new Date(event.event_date).toLocaleTimeString("en-US", { hour12: true, ... })
 *
 * @param {string} str
 * @param {string} [userTimezone]
 * @returns {string} e.g. "09:00 AM", or '' on failure
 */
export function extractTime(str, userTimezone) {
  const format = detectFormat(str)
  const date = parseApiDate(str)
  if (!date) return ''

  /** @type {Intl.DateTimeFormatOptions} */
  const opts = { hour: '2-digit', minute: '2-digit', hour12: true }
  if (format === 'iso') opts.timeZone = userTimezone || FALLBACK_TIMEZONE

  try {
    return new Intl.DateTimeFormat('en-US', opts).format(date)
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }
}