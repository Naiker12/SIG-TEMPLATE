/**
 * @fileoverview Centralized API configuration.
 *
 * This file exports the base URL for the backend API, reading from environment
 * variables. This provides a single source of truth for API endpoints.
 */

/**
 * The base URL for the backend API.
 * It reads from the `NEXT_PUBLIC_API_URL` environment variable.
 * If the variable is not set, it defaults to `http://localhost:8000`.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
