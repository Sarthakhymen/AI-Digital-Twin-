import requests
import sys

BASE_URL = "http://localhost:8000" # Update this to your production URL if needed

def verify_payment(transaction_id):
    url = f"{BASE_URL}/api/payments/verify-payment"
    try:
        response = requests.post(url, json={"transaction_id": transaction_id})
        if response.status_code == 200:
            print(f"SUCCESS: {response.json().get('message')}")
        else:
            print(f"ERROR: {response.json().get('detail')}")
    except Exception as e:
        print(f"FAILED to connect: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_payment.py <transaction_id>")
    else:
        verify_payment(sys.argv[1])
