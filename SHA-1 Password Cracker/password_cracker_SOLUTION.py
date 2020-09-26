# This file is only for development. Do NOT look in this file... unless you want the solution. :)






































import hashlib

f = open('top-10000-passwords.txt','r')
COMMON_PASSWORDS = f.read()
f.close()

def crack_sha1_hash(hash):
  for guess in COMMON_PASSWORDS.split('\n'):
      hashed_guess = hashlib.sha1(bytes(guess, 'utf-8')).hexdigest()
      if hashed_guess == hash:
          return(str(guess))
  return("PASSWORD NOT IN DATABASE")
