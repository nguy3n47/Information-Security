import unittest
import port_scanner

print("***Tests***")
class UnitTests(unittest.TestCase):
  def test_port_scanner_ip(self):
    ports = port_scanner.get_open_ports("209.216.230.240", [440, 445])
    actual = ports
    expected = [443]
    self.assertEqual(actual, expected, 'Expected scanning ports of IP address to return 443.')

  def test_port_scanner_url(self):
    ports = port_scanner.get_open_ports("www.stackoverflow.com", [79, 82])
    actual = ports
    expected = [80]
    self.assertEqual(actual, expected, 'Expected scanning ports of URL address to return 80.')

if __name__ == "__main__":
    unittest.main()