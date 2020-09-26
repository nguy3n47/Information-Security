import unittest
import password_cracker

class UnitTests(unittest.TestCase):
  def test_hash_1(self):
    actual = password_cracker.crack_sha1_hash("18c28604dd31094a8d69dae60f1bcd347f1afc5a")
    expected = "superman"
    self.assertEqual(actual, expected, 'Expected function to return "superman" from hash "18c28604dd31094a8d69dae60f1bcd347f1afc5a".')

  def test_hash_2(self):
    actual = password_cracker.crack_sha1_hash("5d70c3d101efd9cc0a69f4df2ddf33b21e641f6a")
    expected = "q1w2e3r4t5"
    self.assertEqual(actual, expected, 'Expected function to return "q1w2e3r4t5" from hash "5d70c3d101efd9cc0a69f4df2ddf33b21e641f6a".')

  def test_hash_3(self):
    actual = password_cracker.crack_sha1_hash("b80abc2feeb1e37c66477b0824ac046f9e2e84a0")
    expected = "bubbles1"
    self.assertEqual(actual, expected, 'Expected function to return "bubbles1" from hash "b80abc2feeb1e37c66477b0824ac046f9e2e84a0".')

  def test_hash_4(self):
    actual = password_cracker.crack_sha1_hash("80540a46a2c1a0eae58d9868f01c32bdcec9a010")
    expected = "01071988"
    self.assertEqual(actual, expected, 'Expected function to return "01071988" from hash "80540a46a2c1a0eae58d9868f01c32bdcec9a010".')

  def test_not_in_database(self):
    actual = password_cracker.crack_sha1_hash("03810a46a2c1a0eae58d9332f01c32bdcec9a01a")
    expected = "PASSWORD NOT IN DATABASE"
    self.assertEqual(actual, expected, 'Expected function to return "PASSWORD NOT IN DATABASE" from hash "03810a46a2c1a0eae58d9332f01c32bdcec9a01a".')

if __name__ == "__main__":
    unittest.main()