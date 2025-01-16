export class Translator {
  dictionary: { [key: string]: string } = {
    userNotFound: "User wurde nicht gefunden.",
    wrongPassword: "Falsches Passwort.",
    hoof: "Huf",
    tooth: "Zahn",
    hoofcare: "Hufpflege",
    toothcare: "Zahnpflege",
    IHorse: "Pferd",
    ITreatment: "Behandlung",
  };

  translate(key: string): string {
    return this.dictionary[key];
  }
}
