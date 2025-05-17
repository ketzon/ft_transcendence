import i18next from 'i18next';

//la valeur du DOM charge dans les view EN (default) est utilisee comme clef pour les autres langues
const resources = {
  fr: {
    translation: {
      "HOME": "ACCUEIL",
      "PLAY": "JOUER",
      "SETTINGS": "PARAMÈTRES",
      "TOURNAMENTS": "TOURNOIS",
      "LOGOUT": "DÉCONNEXION",
      "Account Settings": "Paramètres du compte",
      "Change Nickname": "Changer de pseudo",
      "Update": "Mise à jour",
      "Change Password": "Changer de mot de passe",
    }
  },
  en: {
    translation: {
      "HOME": "HOME",
      "PLAY": "PLAY",
      "SETTINGS": "SETTINGS",
      "TOURNAMENTS": "TOURNAMENTS",
      "LOGOUT": "LOGOUT",
      "Account Settings": "Account Settings",
      "Change Nickname": "Change Nickname",
      "Change Password": "Change Password",
      "Update": "Update",

    }
  },
  ja: {
    translation: {
      "HOME": "ホーム",
      "PLAY": "プレイ",
      "SETTINGS": "設定",
      "TOURNAMENTS": "トーナメント",
      "LOGOUT": "切断",
      "Account Settings": "アカウント設定",
      "Change Nickname": "ニックネーム変更",
      "Update": "更新",
      "Change Password": "パスワードを変更する",

    }
  }
};

//fonction de conversion marque le texte original avec un attribut pour le traduire
export function updateI18nTranslations(): void {
  const i18n = document.querySelectorAll('.i18n');
  i18n.forEach(id => {
    const originalText = id.getAttribute('data-original-text') || id.textContent?.trim();
    // console.log(id.textContent.trim())
    if (originalText) {
      if (!id.getAttribute('data-original-text')) {
        id.setAttribute('data-original-text', originalText);
      }
      const translatedText = i18next.t(originalText); //conversion avec lecouteur et nos ressource
      id.textContent = translatedText;
    }
  });
}

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  interpolation: { //interpolation pour inserer des variables dynamique dans mes ressources
    escapeValue: true //echape les valeur pour eviter les injections XSS
  }
}).then(() => {
  updateI18nTranslations();
});

export function changeLanguage(lang: string): void {
  if (resources[lang]) {
    i18next.changeLanguage(lang).then(() => { //place un ecouteur sur le language que je veux
      updateI18nTranslations();
    });
  }
}

export function initI18n(): void {
  const selector = document.getElementById('language-selector') as HTMLSelectElement;
    selector.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      changeLanguage(target.value);
    });
}
