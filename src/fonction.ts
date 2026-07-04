let fileAttente: string[] = [];
let annonceActive = false;
let intervalAnnonce: number | null = null;

export const ajouterAnnonce = (nom: string) => {
  // éviter doublon
  if (!fileAttente.includes(nom)) {
    fileAttente.push(nom);
  }

  if (!annonceActive) {
    demarrerAnnonce();
  }
};

const demarrerAnnonce = () => {
  annonceActive = true;

  intervalAnnonce = window.setInterval(() => {
    if (fileAttente.length === 0) return;

    const nom = fileAttente.shift()!;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `La connexion de ${nom} est terminée`
    );

    speech.lang = "fr-FR";

    window.speechSynthesis.speak(speech);

    // remettre à la fin → boucle infinie
    fileAttente.push(nom);

  }, 4000);
};
// Arete tous
export const arreterAnnonce = () => {
  if (intervalAnnonce) {
    clearInterval(intervalAnnonce);
    intervalAnnonce = null;
  }

  window.speechSynthesis.cancel();
  fileAttente = [];
  annonceActive = false;
};
// Pour un client 
export const retirerAnnonce = (nom: string) => {
  fileAttente = fileAttente.filter(n => n !== nom);
};

export const formatTime = (time: number) => {
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const pad = (n: number) => n.toString().padStart(2, '0');