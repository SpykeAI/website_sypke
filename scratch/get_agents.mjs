const apiKey = "sk_e50da168af70979b64cd4db4ffd3b6713dd25027dcb0ea0f";

async function run() {
  const res = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
    headers: { "xi-api-key": apiKey }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
