import { tournamentResults, resetTournamentResults } from '../core/gamestate';

export async function sendTournamentToBackend(): Promise<void> {
  const players = JSON.parse(localStorage.getItem("tournamentPlayers") || "[]");
  const tournamentName = localStorage.getItem("tournamentName") || "Unnamed Tournament";
  const creatorId = localStorage.getItem("creatorId");
  try {
    const res = await fetch("https://back:3000/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        players,
        results: tournamentResults,
        date: new Date().toISOString(),
        tournamentName,
        creatorId,
      }),
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi du tournoi");
    const data = await res.json();
    console.log("✅ Tournoi enregistré dans la BDD :", data);

    // Nettoyer
    resetTournamentResults();
    localStorage.removeItem("tournamentPlayers");

  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du tournoi :", err);
  }
}
