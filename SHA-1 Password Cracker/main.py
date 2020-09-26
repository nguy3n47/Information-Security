# This entrypoint file to be used in development. Start by reading README.md
import password_cracker
from unittest import main


cracked_password = password_cracker.crack_sha1_hash("fbbe7e952d1050bfb09dfdb71d4c2ff2b3d845d2")
print(cracked_password)


# Run unit tests automatically
main(module='test_module', exit=False)