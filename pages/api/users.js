import { Octokit } from "@octokit/rest";
import crypto from "crypto";

const octokit = new Octokit({ auth: "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" });
const owner = "Jrizz817";
const repo = "pastex";
const path = "users.json";

async function getUsers() {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    const content = Buffer.from(data.content, "base64").toString();
    return { users: JSON.parse(content), sha: data.sha };
  } catch (e) {
    if (e.status === 404) return { users: {}, sha: null };
    throw e;
  }
}

async function saveUsers(users, sha) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: "Atualizar users",
    content: Buffer.from(JSON.stringify(users, null, 2)).toString("base64"),
    sha: sha || undefined,
  });
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export default async function handler(req, res) {
  try {
    const { users, sha } = await getUsers();

    if (req.method === "POST") {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: "Usuário e senha obrigatórios" });
      if (users[username]) return res.status(400).json({ error: "Usuário já existe" });

      users[username] = { password: hashPassword(password), created_at: new Date().toISOString() };
      await saveUsers(users, sha);
      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      const { username, password } = req.query;
      if (!username || !password) return res.status(400).json({ error: "Usuário e senha obrigatórios" });

      const user = users[username];
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      if (user.password !== hashPassword(password)) return res.status(401).json({ error: "Senha incorreta" });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
