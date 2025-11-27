from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load controller model
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print("Loading controller model…")
tokenizer = AutoTokenizer.from_pretrained("./controller-phi2")
model = AutoModelForCausalLM.from_pretrained("./controller-phi2").to(DEVICE)

# Function to get controller decision
def get_controller_decision(user_answer: str):
    prompt = f"User answer: {user_answer}\nAction:"
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)

    outputs = model.generate(
        **inputs,
        max_new_tokens=1,
        do_sample=False,
        temperature=0.0,
        num_beams=1,
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=tokenizer.eos_token_id
    )

    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True).lower()

    # Extract decision keyword
    for d in ["probe", "clarify", "next_topic", "example", "behavior_check"]:
        if d in decoded:
            return d

    return "probe"


# Interactive testing loop
def test_controller():
    print("\nController Model Interactive Test")
    print("---------------------------------")
    print("Type user answers below. Type 'exit' to quit.\n")

    while True:
        user_input = input("User answer: ")
        if user_input.lower() == "exit":
            break

        decision = get_controller_decision(user_input)
        print(f"Controller decision → {decision}\n")

# Run test
if __name__ == "__main__":
    test_controller()
