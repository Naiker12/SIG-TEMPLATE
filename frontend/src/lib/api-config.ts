/**
 * @fileoverview Centralized API configuration.
 *
 * This file exports the base URL for the backend API, reading from environment
 * variables. This provides a single source of truth for API endpoints.
 */

/**
 * The base URL for the backend API.
 * It reads from the `NEXT_PUBLIC_API_URL` environment variable.
 * If the variable is not set, it defaults to a localhost address for local development.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';