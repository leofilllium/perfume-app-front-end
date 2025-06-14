import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.scss";
import { useEffect, useState } from "react";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://server-production-45af.up.railway.app/api/preferences/quiz"
        );
        setQuestions(response.data);
      } catch (err) {
        setError("Failed to fetch quiz questions. Please try again later.");
        console.error("Error fetching quiz questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value, type) => {
    if (type === "single") {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: value,
      }));
    } else if (type === "multiple") {
      setAnswers((prevAnswers) => {
        const currentAnswers = prevAnswers[questionId] || [];
        if (currentAnswers.includes(value)) {
          return {
            ...prevAnswers,
            [questionId]: currentAnswers.filter((item) => item !== value),
          };
        } else {
          return {
            ...prevAnswers,
            [questionId]: [...currentAnswers, value],
          };
        }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);
    setSubmissionMessage("");

    try {
      const currentQuestion = questions[currentQuestionIndex];
      if (
        !answers[currentQuestion.id] ||
        (Array.isArray(answers[currentQuestion.id]) &&
          answers[currentQuestion.id].length === 0)
      ) {
        setError("Please answer the current question before submitting.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to submit your preferences.");
        setLoading(false);
        return;
      }

      await axios.post(
        "https://server-production-45af.up.railway.app/api/preferences/quiz",
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissionMessage("Your perfume preferences have been saved!");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save preferences. Please ensure all questions are answered."
      );
      console.error("Error submitting quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className={styles.quizPage}>
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (error && !submissionMessage) {
    return (
      <div className={styles.quizPage}>
        <div className={styles.quizContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className={styles.quizPage}>
      <div className={styles.quizContainer}>
        {submissionMessage ? (
          <div className={styles.successMessage}>
            <h2>{submissionMessage}</h2>
            <p>Redirecting you now...</p>
          </div>
        ) : (
          <>
            <h2 className={styles.quizTitle}>Perfume Preference Quiz</h2>
            <p className={styles.questionCounter}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className={styles.questionCard}>
              <h3 className={styles.questionText}>
                {currentQuestion?.question}
              </h3>
              <div className={styles.optionsContainer}>
                {currentQuestion?.options?.map((option) => (
                  <label
                    key={option.value}
                    className={`${styles.optionLabel} ${
                      (currentQuestion.type === "single" &&
                        answers[currentQuestion.id] === option.value) ||
                      (currentQuestion.type === "multiple" &&
                        answers[currentQuestion.id]?.includes(option.value))
                        ? styles.selected
                        : ""
                    }`}
                  >
                    <input
                      type={
                        currentQuestion.type === "single" ? "radio" : "checkbox"
                      }
                      name={`question-${currentQuestion.id}`}
                      value={option.value}
                      checked={
                        (currentQuestion.type === "single" &&
                          answers[currentQuestion.id] === option.value) ||
                        (currentQuestion.type === "multiple" &&
                          answers[currentQuestion.id]?.includes(option.value))
                      }
                      onChange={() =>
                        handleAnswerChange(
                          currentQuestion.id,
                          option.value,
                          currentQuestion.type
                        )
                      }
                      className={styles.optionInput}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.navigationButtons}>
              {!isFirstQuestion && (
                <button
                  onClick={handlePreviousQuestion}
                  className={styles.prevButton}
                >
                  Previous
                </button>
              )}
              {!isLastQuestion ? (
                <button
                  onClick={handleNextQuestion}
                  className={styles.nextButton}
                  disabled={
                    !answers[currentQuestion?.id] ||
                    (Array.isArray(answers[currentQuestion?.id]) &&
                      answers[currentQuestion?.id].length === 0)
                  }
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className={styles.submitButton}
                  disabled={
                    loading ||
                    !answers[currentQuestion?.id] ||
                    (Array.isArray(answers[currentQuestion?.id]) &&
                      answers[currentQuestion?.id].length === 0)
                  }
                >
                  {loading ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
