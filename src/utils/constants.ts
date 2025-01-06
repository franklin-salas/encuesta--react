export const QUESTION_TYPE_OPTIONS = [
    { name: "Despegable", value: "SELECT" },
    { name: "Casillas", value: "CHECKBOX" },
    { name: "Varias Opciones", value: "RADIO" }
];

export const MAX_QUESTIONS_PER_POLL = 30;
export const MIN_QUESTIONS_PER_POLL = 1;
export const MAX_ANSWERS_PER_QUESTION = 10;
export const MIN_ANSWERS_PER_QUESTION = 1;

export const USER_POLLS_PER_PAGE = 2;

export const BASE_URL = window.location.origin.toString();