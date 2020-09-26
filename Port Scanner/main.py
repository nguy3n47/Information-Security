# This entrypoint file to be used in development. Start by reading README.md
import port_scanner
from unittest import main


ports = port_scanner.get_open_ports(target="www.freecodecamp.org", port_range=[75,85])
print("Open ports:", ports)
ports = port_scanner.get_open_ports(target="104.26.10.78", port_range=[8085,8090])
print("Open ports:", ports)


# Run unit tests automatically
main(module='test_module', exit=False)