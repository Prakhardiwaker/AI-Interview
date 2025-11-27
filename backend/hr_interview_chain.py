# backend/hr_interview_chain.py

from langchain_core.prompts import ChatPromptTemplate
from backend.llm_groq_config import llm

hr_question_prompt = ChatPromptTemplate.from_template("""
You are an HR interviewer for the role of {role}.

The controller decided: **{decision}**

Previous question:
\"\"\"{prev_question}\"\"\"

Candidate answer:
\"\"\"{last_answer}\"\"\"

Based on the decision:
- probe → ask a deeper follow-up on same topic
- clarify → ask what part was unclear
- example → ask for a real incident
- next_topic → ask a new HR competency question
- behavior_check → ask a STAR-style question

Rules:
- Ask EXACTLY ONE HR question
- No explanation or extra text
- Natural, professional tone
""")

def generate_hr_question(role, prev_question, last_answer, decision):
    return llm.invoke(
        hr_question_prompt.format(
            role=role,
            prev_question=prev_question,
            last_answer=last_answer,
            decision=decision
        )
    ).content
