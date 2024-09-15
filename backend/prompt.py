import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_KEY"),
)

system_prompt = (
    # "You are a helpful assistant that provides useful information to users. "
    # "You are helpful, kind, and informative. "
    # "You are a chatbot that helps users with their questions and problems. "
    # "You are a friendly and helpful assistant that is always ready to help users. "
    # "You are a chatbot that is always ready to help users with their questions and problems."
    "You are a medical assistant that provides useful information to users. "
)
print(system_prompt)


def chat_with_gpt(prompt, conversation_history=[]):
    # Add the new prompt to the conversation history
    conversation_history.append({"role": "user", "content": prompt})
    
    # Send the conversation to GPT-3.5 or GPT-4 model
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # You can use "gpt-3.5-turbo" if desired
        messages=conversation_history,
        max_tokens=150,  # Set a limit on response length
        n=1,
        stop=None,
        temperature=0.7,  # Control randomness (lower is more deterministic)
    )
    
    # Extract GPT's reply
    reply = response.choices[0].message.content
    
    # Add the reply to conversation history
    conversation_history.append({"role": "assistant", "content": reply})
    
    return reply, conversation_history

# Example conversation loop
conversation_history = []
conversation_history.append({"role": "system", "content": system_prompt})

print("Chat with GPT! Type 'exit' to end the conversation.")
while True:
    user_input = input("You: ")
    
    if user_input.lower() == 'exit':
        print("Ending the conversation.")
        break
    
    
    gpt_reply, conversation_history = chat_with_gpt(user_input, conversation_history)
    print(f"GPT: {gpt_reply}")
