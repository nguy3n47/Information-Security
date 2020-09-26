import socket
# references https://www.pythonforbeginners.com/code-snippets-source-code/port-scanner-in-python/
def get_open_ports(target, port_range):
  open_ports = []
  remoteServerIP  = socket.gethostbyname(target)
  print ("Target  = {}".format(remoteServerIP))
  for port in range(port_range[0],port_range[1]):  
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((remoteServerIP, port))
    if result == 0:
      print ("Port {}: Open".format(port))
      open_ports.append(port)
    sock.close()

  return(open_ports)
