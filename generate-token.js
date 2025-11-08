const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'meu-super-secret-jwt-2024';
const argv = process.argv.slice(2);
const id = argv[0] || '123456';
const role = argv[1] || 'admin';
const email = argv[2] || 'teste@teste.com';
const expiresIn = argv[3] || '7d';

const payload = { id, role, email };

try {
  const token = jwt.sign(payload, secret, { expiresIn });

  console.log('\n🔑 TOKEN JWT GERADO:\n');
  console.log(token);
  console.log('\n📋 Use este token no header Authorization:\n');
  console.log(`Authorization: Bearer ${token}\n`);
  console.log('Exemplo curl:');
  console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3002/api/events\n`);
} catch (err) {
  console.error('Erro ao gerar token:', err.message);
  process.exit(1);
}