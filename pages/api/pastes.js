import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: "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" });
const owner = "Jrizz817";
const repo = "pastex";
const path = "pastes.json";

const rateLimitMap = {};
const MAX_REQUESTS = 5;
const WINDOW_MS = 2 * 60 * 1000; // 2 minutos

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimitMap[ip]) rateLimitMap[ip] = [];
  rateLimitMap[ip] = rateLimitMap[ip].filter(ts => now - ts < WINDOW_MS);
  if (rateLimitMap[ip].length >= MAX_REQUESTS) return false;
  rateLimitMap[ip].push(now);
  return true;
}

async function getPastes() {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    const content = Buffer.from(data.content, "base64").toString();
    return { pastes: JSON.parse(content), sha: data.sha };
  } catch (e) {
    if (e.status === 404) return { pastes: {}, sha: null };
    throw e;
  }
}

async function savePastes(pastes, sha) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: "Atualizar pastes",
    content: Buffer.from(JSON.stringify(pastes, null, 2)).toString("base64"),
    sha: sha || undefined,
  });
}

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!checkRateLimit(ip)) return res.status(429).json({ error: `Rate limit excedido. Máx ${MAX_REQUESTS} por 2 minutos.` });

  try {
    if (req.method === "POST") {
      const { text, user } = req.body;
      if (!text || !user) return res.status(400).json({ error: "Texto e usuário obrigatórios" });

      const { pastes, sha } = await getPastes();
      const id = Math.random().toString(36).substring(2, 8);
      pastes[id] = { text, user, created_at: new Date().toISOString() };
      await savePastes(pastes, sha);

      return res.status(200).json({ id });
    }

    if (req.method === "GET") {
      const { id } = req.query;
      const { pastes } = await getPastes();
      if (!id) return res.status(200).json(pastes);
      if (!pastes[id]) return res.status(404).json({ error: "Paste não encontrado" });
      return res.status(200).json(pastes[id]);
    }

    res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
        }
