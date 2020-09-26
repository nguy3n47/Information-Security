# This file is only for development. Do NOT look in this file... unless you want the solution. :)






































import socket

def get_open_ports(target, port_range):
  open_ports = []

  if target[-1:].isalpha():
    target = socket.gethostbyname(target)

  print("Checking for open ports on:", target)

  for port in range(port_range[0], port_range[1]):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((target, port))
    if result == 0:
        open_ports.append(port)
    sock.close()

  return(open_ports)