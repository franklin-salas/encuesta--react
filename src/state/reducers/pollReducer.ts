import { Poll, Question, QuestionType } from "../../types";
import { v4 as uuid } from 'uuid';
import produce from "immer";
import { PollActions } from "../actions/pollActions";
import { MAX_ANSWERS_PER_QUESTION, MAX_QUESTIONS_PER_POLL, MIN_ANSWERS_PER_QUESTION, MIN_QUESTIONS_PER_POLL } from "../../utils/constants";

const defaultQuestion: Question = {
    id: uuid(),
    content: "",
    questionOrder: 1,
    type: "RADIO",
    answers: [
        {
            id: uuid(),
            content: ""
        }
    ]
}

const defaultPoll: Poll = {
    id: uuid(),
    content: "",
    errors: {},
    opened: true,
    questions: [defaultQuestion]
}

export const pollInitialState: Poll = {
    ...defaultPoll
}

const orderQuestions = (state: Poll) => {
    for (let i = 0; i < state.questions.length; i++) {
        state.questions[i].questionOrder = (i + 1);
    }
}

export const PollReducer = produce((state: Poll, action: PollActions) : Poll => {
    switch (action.type) {
        case "pollcontent": {
            state.content = action.content;
            return state;
        }
        case "questioncontent": {
            state.questions[action.payload.index].content = action.payload.content;
            return state;
        }
        case "changequestiontype": {
            let questionType: QuestionType = action.payload.value as QuestionType;
            state.questions[action.payload.index].type = questionType;
            return state;
        }
        case "answercontent": {
            const { index, answerIndex, content } = action.payload;
            state.questions[index].answers[answerIndex].content = content;
            return state;
        }
        case "newquestion": {
            if (state.questions.length >= MAX_QUESTIONS_PER_POLL) return state;
            const questionOrder = state.questions[state.questions.length - 1].questionOrder + 1;
            state.questions.splice(action.index + 1, 0, { ...defaultQuestion, id: uuid(), questionOrder })
            orderQuestions(state);
            return state;
        }
        case "newanswer": {
            if (state.questions[action.index].answers.length >= MAX_ANSWERS_PER_QUESTION) return state;
            state.questions[action.index].answers.push({ id: uuid(), content: "" })
            return state;
        }
        case "removeanswer": {
            const { index, answerId } = action.payload;
            if (state.questions[index].answers.length > MIN_ANSWERS_PER_QUESTION) {
                state.questions[index].answers = state.questions[index].answers.filter(a => a.id !== answerId);
            }
            state.errors = {};
            return state;
        }
        case "removequestion": {
            if (state.questions.length > MIN_QUESTIONS_PER_POLL) {
                state.questions = state.questions.filter(q => q.id !== action.questionId);
            }
            state.errors = {};
            return state;
        }
        case "orderquestions": {
            const { source, destination } = action.payload;
            const [question] = state.questions.splice(source, 1);
            state.questions.splice(destination, 0, question);
            orderQuestions(state);
            state.errors = {};
            return state;
        }
        case "seterrors": {
            state.errors = action.errors;
            return state;
        }
        case "resetformpoll": {
            state = { ...defaultPoll };
            return state;
        }
        default:
            return state;
    }
});