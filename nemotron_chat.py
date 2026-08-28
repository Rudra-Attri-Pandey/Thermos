import urllib.request
import json
import sys
import os

API_KEY = os.environ.get("NVIDIA_API_KEY")
URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "nvidia/nemotron-3-ultra-550b-a55b"

if not API_KEY:
    print("ERROR: NVIDIA_API_KEY environment variable is not set.")
    print("Set it in .env or your shell before running this script.")
    sys.exit(1)

def ask_nemotron(prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are NVIDIA Nemotron 3 Ultra (550B), the advanced reasoning AI powering Thermos AI for the FortyGuard Hackathon '26. You provide brilliant, precise, and helpful insights."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1024
    }
    req = urllib.request.Request(URL, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error connecting to Nemotron: {e}"

if __name__ == "__main__":
    print("=" * 60)
    print("🟢 NVIDIA Nemotron 3 Ultra (550B) Interactive Terminal")
    print("Type your message/prompt below (or 'exit' to quit)")
    print("=" * 60)
    
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        print(f"\nYou: {query}")
        print(f"\nNemotron: {ask_nemotron(query)}")
    else:
        while True:
            try:
                user_input = input("\nYou: ")
                if user_input.strip().lower() in ['exit', 'quit', 'q']:
                    print("Exiting Nemotron chat. Bye!")
                    break
                if not user_input.strip():
                    continue
                print("\nNemotron (550B Thinking...):")
                reply = ask_nemotron(user_input)
                print(f"{reply}\n")
            except (KeyboardInterrupt, EOFError):
                break
