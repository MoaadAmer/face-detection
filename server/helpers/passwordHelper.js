import bcrypt from "bcrypt";

async function hash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function compare(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result === true;
}

export { hash, compare };
