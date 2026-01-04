/**
 * Application Constants
 * Centralized configuration values and magic numbers
 */

// Security & Authentication
export const BCRYPT_SALT_ROUNDS = 12;
export const JWT_TOKEN_TYPE = 'Bearer';

// Study Session Configuration
export const MIN_SESSION_DURATION = 0.5; // hours
export const MAX_SESSION_DURATION = 12; // hours
export const TARGET_SESSION_DURATION = 1.5; // hours
export const SESSION_BUFFER = 0.5; // hours between sessions
export const DEFAULT_DAILY_AVAILABILITY = 3; // hours per day

// Subject Configuration
export const MIN_STUDY_HOURS = 0.5;
export const MAX_STUDY_HOURS = 1000;
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;

// Validation Limits
export const MAX_NAME_LENGTH = 50;
export const MAX_SUBJECT_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_NOTES_LENGTH = 500;
export const MAX_TITLE_LENGTH = 150;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 100;

// Difficulty Multipliers for session distribution
export const DIFFICULTY_MULTIPLIERS = {
    1: 1.0,  // Easy
    2: 1.2,  // Medium-Easy
    3: 1.5,  // Medium
    4: 1.8,  // Hard
    5: 2.2,  // Very Hard
};

export default {
    BCRYPT_SALT_ROUNDS,
    JWT_TOKEN_TYPE,
    MIN_SESSION_DURATION,
    MAX_SESSION_DURATION,
    TARGET_SESSION_DURATION,
    SESSION_BUFFER,
    DEFAULT_DAILY_AVAILABILITY,
    MIN_STUDY_HOURS,
    MAX_STUDY_HOURS,
    MIN_DIFFICULTY,
    MAX_DIFFICULTY,
    MAX_NAME_LENGTH,
    MAX_SUBJECT_NAME_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_NOTES_LENGTH,
    MAX_TITLE_LENGTH,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    DIFFICULTY_MULTIPLIERS,
};
