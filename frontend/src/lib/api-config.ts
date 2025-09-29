/**
 * @fileoverview Centralized API configuration.
 *
 * This file exports the base URL for the backend API, reading from environment
 * variables. This provides a single source of truth for API endpoints.
 */

/**
 * The base URL for the backend API.
 * It reads from the `NEXT_PUBLIC_API_URL` environment variable.
 * If the variable is not set, it defaults to a specific IP for local development.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.212:8000';
