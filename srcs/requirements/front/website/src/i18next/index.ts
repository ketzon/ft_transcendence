import i18next from 'i18next';
import { toasts } from "../toasts";
import { isUserAuth } from '../auth';
import {updateLanguage} from '../views/settings'


interface Translations {
  [key: string]: string;
}

interface Resources {
  fr: { translation: Translations };
  en: { translation: Translations };
  ja: { translation: Translations };
}

//la valeur du DOM charge dans les view EN (default) est utilisee comme clef pour les autres langues
const resources: Resources = {
  fr: {
    translation: {
      "HOME": "ACCUEIL",
      "PLAY": "JOUER",
      "SETTINGS": "PARAMÈTRES",
      "TOURNAMENTS": "TOURNOIS",
      "LOGOUT": "DÉCONNEXION",
      "FRIENDS": "AMIS",
      "Account Settings": "Paramètres du compte",
      "Change Nickname": "Changer de pseudo",
      "Change Password": "Changer de Mot de passe",
      "Update": "Mise à jour",
      "Available Tournaments": "Tournois disponibles",
      "Select a tournament to view details": "Sélectionnez un tournoi pour en savoir plus",
      "📊 Stats": "📊 Statistiques",
      "📜 Game History": "📜 Historique du jeu",
      "🎮 Total Matches": "🎮 Nombre total de matchs" ,
      "Win Rate": "Taux de victoire",
      "Total Wins" : "Total des victoires",
      "Total Defeats": "Total des défaites",
      "Best Win Streak": "Meilleure série de victoires",
      "📈 Performance Graph": "📈 Graphique de performance",
      "Choose from the list on the left": "Choisissez dans la liste de gauche",
      "friends": "amis",
      "add friend": "ajouter un ami" ,
      "my friends": "mes amis",
    }
  },
  en: {
    translation: {
      "HOME": "HOME",
      "PLAY": "PLAY",
      "SETTINGS": "SETTINGS",
      "TOURNAMENTS": "TOURNAMENTS",
      "LOGOUT": "LOGOUT",
      "FRIENDS": "FRIENDS",
      "Account Settings": "Account Settings",
      "Change Nickname": "Change Nickname",
      "Change Password": "Change Password",
      "Available Tournaments": "Available Tournaments",
      "Select a tournament to view details": "Select a tournament to view details",
      "📊 Stats": "📊 Stats" ,
      "📜 Game History": "📜 Game History",
      "🎮 Total Matches": "🎮 Total Matches" ,
      "Win Rate": "Win Rate",
      "Total Wins" : "Total Wins",
      "Total Defeats": "Total Defeats",
      "Best Win Streak": "Best Win Streak",
      "📈 Performance Graph": "📈 Performance Graph",
      "Choose from the list on the left": "Choose from the list on the left",
      "friends": "friends",
      "add friend": "add friend" ,
      "my friends": "my friends",
    }
  },
  ja: {
    translation: {
      "HOME": "ホーム",
      "PLAY": "プレイ",
      "SETTINGS": "設定",
      "TOURNAMENTS": "トーナメント",
      "LOGOUT": "切断",
      "FRIENDS": "フレンズ",
      "Account Settings": "アカウント設定",
      "Change Nickname": "ニックネーム変更",
      "Change Password": "パスワードを変更する",
      "Update": "更新",
      "Available Tournaments": "参加可能なトーナメント",
      "Select a tournament to view details": "トーナメントを選択して詳細を見る",
      "📊 Stats": "📊 スタッツ",
      "📜 Game History": "📜 戦歴",
      "Total Matches": "「総試合数" ,
      "Win Rate": "勝率",
      "Total Wins" : "「通算勝利数",
      "Total Defeats": "「通算敗戦数",
      "Best Win Streak": "「最高連勝記録",
      "📈 Performance Graph": "📈 パフォーマンス・グラフ",
      "Choose from the list on the left": "左のリストから選択",
      "friends": "フレンズ",
      "add friend": "友達を増やす" ,
      "my friends": "わが友",
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

const userLng = (() => {
    const stored = localStorage.getItem('preferred_language');
    if (!stored || stored === 'undefined' || stored === 'null') {
        return 'en';
    }
    if (resources[stored as keyof Resources]) {
        return stored;
    }
    return 'en';
})();

// const userLng = localStorage.getItem('preferred_language') || 'en';
i18next.init({
    lng: userLng,
    fallbackLng: 'en',
    resources,
    interpolation: { //interpolation pour inserer des variables dynamique dans mes ressources
        escapeValue: true //echape les valeur pour eviter les injections XSS
    }
}as any).then(() => {
    updateI18nTranslations();
    const selector = document.getElementById('language-selector') as HTMLSelectElement;
    if (selector) {
        selector.value = userLng;
    }
})

export function changeLanguage(lang: string): void {
    if (resources[lang as keyof Resources]) {
        const selector = document.getElementById('language-selector') as HTMLSelectElement;
        if (selector) {
            selector.value = lang;
        }
        i18next.changeLanguage(lang).then(() => { //place un ecouteur sur le language que je veux
            updateI18nTranslations();
        });
        isUserAuth().then(isAuth => {
            if(isAuth) {
                updateLanguage(lang); //fetch language et stock dans localstorage
            }
        })
    }
}

export function initI18n(): void {
    const selector = document.getElementById('language-selector') as HTMLSelectElement;
    selector.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        changeLanguage(target.value);
        toasts.success("Language preference updated");
    });
}
