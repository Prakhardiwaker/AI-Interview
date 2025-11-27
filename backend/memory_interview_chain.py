# memory_interview_chain.py

import json

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
# backend/technical_question_chain.py

from langchain_core.prompts import ChatPromptTemplate
from backend.llm_groq_config import llm

_question_prompt = ChatPromptTemplate.from_template("""
You are an interviewer generating the next technical question for the candidate.

Inputs:
- Role: {role}
- Controller decision: {decision}
- Previous question: "{prev_question}"
- Candidate answer: "{candidate_answer}"
- Resume excerpt (skills + experience): {resume_excerpt}
- Recently covered topics (keyword-based): {recent_topics}

Your task:
Generate EXACTLY ONE technical interview question, obeying the controller decision.

Rules per decision:

1. depth_probe  
   → Ask a deeper sub-question within the SAME topic as the previous question.

2. concept_clarification  
   → Ask the candidate to specifically clarify part of their answer that seems vague, incorrect, or incomplete.

3. edge_case  
   → Ask about edge cases, tricky constraints, or performance boundaries related to the previous question.

4. follow_up_question  
   → Ask the next logical follow-up question in the SAME topic.


5. topic_transition  
   → Select a NEW technical topic inferred from the candidate's resume skills or role.
     Avoid topics listed in recently covered topics.
     Ask a question directly related to the chosen new topic.

Output ONLY the question. No explanations, no multiple questions.
""")

def generate_technical_question(role,
                                decision,
                                prev_question,
                                candidate_answer,
                                resume_excerpt,
                                recent_topics):
    prompt = _question_prompt.format(
        role=role or "general",
        decision=decision,
        prev_question=prev_question or "",
        candidate_answer=candidate_answer or "",
        resume_excerpt=resume_excerpt[:1200],
        recent_topics=", ".join(recent_topics) if recent_topics else "none"
    )

    resp = llm.invoke(prompt).content.strip()
    
    # return only the first question-like sentence if model misbehaves
    return resp



# Memory session store
session_store = {}

def get_session_history(session_id):
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

