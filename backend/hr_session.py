# backend/hr_session.py

from backend.hr_interview_chain import generate_hr_question
from backend.controller_chain import get_controller_decision
from backend.feedback_utils import generate_hr_feedback

class HRInterviewSession:
    def __init__(self, role, session_id, rounds=5):
        self.role = role
        self.session_id = session_id
        self.current_round = 0
        self.rounds = rounds
        self.round_type = "HR"

        self.history = [{
            "question": "Welcome to the HR round of your interview. Tell me about yourself.",
            "answer": None
        }]

    def ask_question(self):
        """Return the next HR question."""

        if self.current_round >= self.rounds:
            return None

        # First question already present
        if self.current_round == 0:
            self.current_round += 1
            return self.history[0]["question"]

        # Use previous question + answer for controller logic
        prev_question = self.history[-1]["question"]
        prev_answer = self.history[-1]["answer"]

        decision = get_controller_decision(prev_question, prev_answer)

        # Generate next HR question
        question = generate_hr_question(
            role=self.role,
            prev_question=prev_question,
            last_answer=prev_answer,
            decision=decision
        )

        self.history.append({"question": question, "answer": None})
        self.current_round += 1
        return question

    def provide_answer(self, answer):
        """Store answer."""
        if self.history:
            self.history[-1]["answer"] = answer

    def generate_feedback(self):
        return generate_hr_feedback(self.history)
