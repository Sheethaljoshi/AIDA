import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

# Define the Next.js API endpoint
url = "http://localhost:3000/api/test/"

# Send a GET request to the API
# response = requests.get(url)
requests.post(url, data=json.dumps({"name": "John Doe"}), headers={"Content-Type": "application/json"})

# Check if the request was successful
# if response.status_code == 200:
#     # Parse the JSON response
#     # data = response.json()
#     print("API Response:", response.text)
# else:
#     print(f"Failed to fetch data. Status code: {response.status_code}")
