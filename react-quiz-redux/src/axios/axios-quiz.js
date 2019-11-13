import axios from 'axios'

export default axios.create({
  baseURL: 'https://react-quiz-b56fc.firebaseio.com/'
})