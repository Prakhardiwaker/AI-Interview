# interviewsession.py

import json
from backend.vector_memory import VectorMemory
from backend.controller_chain import get_tech_controller_decision
from backend.memory_interview_chain import generate_technical_question

class InterviewSession:
    def __init__(self, resume_path=None, resume_obj=None, role='', rounds=3, session_id='default_user'):
        # Load resume
        if resume_path:
            with open(resume_path, 'r', encoding='utf-8') as f:
                self.resume = json.load(f)
        elif resume_obj:
            self.resume = resume_obj
        else:
            raise ValueError("Either resume_path or resume_obj must be provided.")

        self.role = role
        self.resume_str = json.dumps(self.resume)
        self.rounds = rounds
        self.current_round = 0
        self.session_id = session_id
        self.vector_memory = VectorMemory()

        self.history = [{
            'question': "Can you briefly describe one technical project from your resume and the technologies you used?",
            'answer': None
        }]

    def _extract_recent_topics(self, limit=5):
        """
        Extract topic keywords from last 'limit' questions using VectorMemory._extract_keywords.
        """
        recent = []
        for entry in self.history[-limit:]:
            q = entry.get("question", "")
            if q:
                keywords = list(self.vector_memory._extract_keywords(q))
                if keywords:
                    recent.extend(keywords[:3])  # take top 3 keywords per question
        return list(set(recent))  # dedupe

    def ask_question(self):
        if self.current_round >= self.rounds:
            return None

        # First question already given
        if self.current_round == 0:
            self.current_round += 1
            return self.history[0]['question']

        # Previous Q/A
        prev_question = self.history[-1]['question']
        prev_answer = self.history[-1]['answer'] or ""

        # Extract resume excerpt
        resume_excerpt = self.resume_str[:1500]

        # Topic repetition avoidance
        recent_topics = self._extract_recent_topics()

        # Stage 1: Controller decides action
        decision = get_tech_controller_decision(
            prev_question=prev_question,
            candidate_answer=prev_answer,
            role=self.role,
            resume_excerpt=resume_excerpt,
            recent_topics=recent_topics
        )

        # Stage 2: Generator produces the actual next question
        next_q = generate_technical_question(
            role=self.role,
            decision=decision,
            prev_question=prev_question,
            candidate_answer=prev_answer,
            resume_excerpt=resume_excerpt,
            recent_topics=recent_topics
        )

        self.history.append({'question': next_q, 'answer': None})
        self.current_round += 1
        return next_q

    def provide_answer(self, answer):
        if self.history:
            q = self.history[-1]['question']
            self.history[-1]['answer'] = answer
            self.vector_memory.add_qa(q, answer)

    def is_complete(self):
        return self.current_round >= self.rounds

    def summary(self):
        return self.history
