import socket

def check_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

if __name__ == "__main__":
    if check_port(8000):
        print("Port 8000 is OPEN")
    else:
        print("Port 8000 is CLOSED")
