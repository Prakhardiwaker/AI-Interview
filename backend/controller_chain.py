# backend/controller_chain.py

from langchain_core.prompts import ChatPromptTemplate
from backend.llm_groq_config import llm

controller_prompt = ChatPromptTemplate.from_template("""
You are the decision-making controller in an HR interview system.

You receive:
1. The previous HR question
2. The candidate's answer

Analyze them and decide the next interviewer action.

Choose ONLY ONE of the following labels:
- probe  (ask deeper about same topic)
- clarify  (answer is vague or unclear)
- example  (ask for real example)
- next_topic  (move to new HR competency)
- behavior_check  (ask STAR-style behavioral question)

Previous question:
\"\"\"{question}\"\"\"

Candidate answer:
\"\"\"{answer}\"\"\"

Respond with ONLY the label. No explanation.
""")




tech_controller_prompt = ChatPromptTemplate.from_template("""
You are the decision-making controller for a technical interview system.

You receive:
1. The previous technical question.
2. The candidate's answer.
3. The role being interviewed for.
4. A short excerpt from the candidate's resume (including skills).
5. A list of recently covered technical topic keywords (to avoid repetition).

Your goal:
Decide EXACTLY ONE of the following actions:

- depth_probe          → Ask a deeper sub-question within the same topic.
- concept_clarification → Ask the candidate to clarify unclear/incorrect logic.
- edge_case            → Ask about tricky corner cases or constraints.
- follow_up_question   → Ask the next conceptual step or direct follow-up.
- topic_transition     → Switch to a new technical topic extracted from the resume or relevant to the role.

Important:
- If the previous question's topic appears in recently covered topics, prefer topic_transition.
- If the answer is vague or partially correct, choose concept_clarification.
- If the answer is good but shallow, choose depth_probe.
- If the answer is solid, choose follow_up_question or edge_case.
- Use the resume skills to decide new topic areas.

Output ONLY the chosen label. No explanation.

Previous question:
\"\"\"{prev_question}\"\"\"

Candidate answer:
\"\"\"{candidate_answer}\"\"\"

Role: {role}
Resume skills excerpt:
{resume_excerpt}

Recently covered topic keywords:
{recent_topics}
""")

VALID_LABELS = {
    "depth_probe",
    "concept_clarification",
    "edge_case",
    "coding_test",
    "follow_up_question",
    "topic_transition"
}

def _sanitize_label(text: str) -> str:
    if not text:
        return "follow_up_question"
    t = text.strip().lower().split()[0]
    return t if t in VALID_LABELS else "follow_up_question"

def get_tech_controller_decision(prev_question, candidate_answer, role, resume_excerpt, recent_topics):
    prompt = tech_controller_prompt.format(
        prev_question=prev_question or "",
        candidate_answer=candidate_answer or "",
        role=role or "general",
        resume_excerpt=resume_excerpt[:1000],
        recent_topics=", ".join(recent_topics) if recent_topics else "none"
    )

    resp = llm.invoke(prompt).content
    return _sanitize_label(resp)


def get_controller_decision(question: str, answer: str):
    result = llm.invoke(
        controller_prompt.format(question=question, answer=answer)
    ).content.strip().lower()
    valid = ["probe", "clarify", "example", "next_topic", "behavior_check"]
    return result if result in valid else "probe"
