import {
  FETCH_QUIZES_START,
  FETCH_QUIZES_SUCCESS,
  FETCH_QUIZES_FAILURE,
  FETCH_QUIZ_SUCCESS,
  QUIZ_SET_STATE,
  FINISH_QUIZ,
  QUIZ_NEXT_QUESTION,
  RETRY_QUIZ
} from './actionTypes';
import axios from "../../axios/axios-quiz";

export const fetchQuizes = () => async dispatch => {
  dispatch(fetchQuizesStart());

  try {
    const response = await axios.get('/quizes.json');
    const quizes = [];

    Object.keys(response.data).forEach((key, index) => {
      quizes.push({
        id: key,
        name: `Тест №${index + 1}`
      })
    });

    dispatch(fetchQuizesSuccess(quizes))
  } catch (error) {
    dispatch(fetchQuizesFailure(error))
  }
};

export const fetchQuizById = quizId => async dispatch => {
  dispatch(fetchQuizesStart());
  try {
    const response = await axios.get(`/quizes/${quizId}.json`);
    const quiz = response.data;

    dispatch(fetchQuizSuccess(quiz))
  } catch (error) {
    dispatch(fetchQuizesFailure(error))
  }
};

export const fetchQuizesStart = () => ({
    type: FETCH_QUIZES_START
});

export const fetchQuizesSuccess = quizes => ({
  type: FETCH_QUIZES_SUCCESS,
  quizes
});

export const fetchQuizesFailure = (error) => ({
  type: FETCH_QUIZES_FAILURE,
  payload: error,
  error: true
});

export const fetchQuizSuccess = quiz => ({
  type: FETCH_QUIZ_SUCCESS,
  quiz
});

export const quizSetState = (answerState, results) => ({
  type: QUIZ_SET_STATE,
  answerState, results
});

export const finishQuiz = () => ({type: FINISH_QUIZ});

export const quizNextQuestion = activeQuestion => ({type: QUIZ_NEXT_QUESTION, activeQuestion});

export const retryQuiz = () => ({type: RETRY_QUIZ});

export const quizAnswerClick = answerId => (dispatch, getState) => {
  const state = getState().quiz;
  if (state.answerState) {
    const key = Object.keys(state.answerState)[0];
    if (state.answerState[key] === 'success') {
      return
    }
  }

  const question = state.quiz[state.activeQuestion];
  const results = state.results;

  if (question.rightAnswerId === answerId) {
    if (!results[question.id]) {
      results[question.id] = 'success'
    }

    dispatch(quizSetState({[answerId]: 'success'}, results));

    const timeout = window.setTimeout(() => {
      if (isQuizFinished(state)) {
        dispatch(finishQuiz())
      } else {
        dispatch(quizNextQuestion(state.activeQuestion))
      }
      window.clearTimeout(timeout)
    }, 1000)
  } else {
    results[question.id] = 'error';
    dispatch(quizSetState({[answerId]: 'error'}, results))
  }
};

const isQuizFinished = state => {
  return state.activeQuestion + 1 === state.quiz.length
};
