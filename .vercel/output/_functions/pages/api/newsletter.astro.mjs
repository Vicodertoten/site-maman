import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { email } = await request.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const csvPath = join(process.cwd(), "newsletter.csv");
    let csvContent = "";
    let existingEmails = [];
    if (existsSync(csvPath)) {
      csvContent = readFileSync(csvPath, "utf-8");
      existingEmails = csvContent.split("\n").filter((line) => line.trim() !== "");
    } else {
      csvContent = "Email,Date d'inscription\n";
    }
    const emailExists = existingEmails.some((line) => line.startsWith(email + ","));
    if (emailExists) {
      return new Response(JSON.stringify({ error: "Cet email est déjà inscrit à la newsletter" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newLine = `${email},${now}
`;
    csvContent += newLine;
    writeFileSync(csvPath, csvContent, "utf-8");
    return new Response(JSON.stringify({
      success: true,
      message: "Inscription à la newsletter réussie !"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription à la newsletter:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
