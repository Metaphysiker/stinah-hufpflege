export class Translator {
  dictionary: { [key: string]: string } = {
    userNotFound: "User wurde nicht gefunden.",
    wrongPassword: "Falsches Passwort.",
    hoof: "Huf",
    tooth: "Zahn",
    hoofcare: "Hufpflege",
    toothcare: "Zahnpflege",
    general: "Allgemein",
    IHorse: "Pferd",
    ITreatment: "Behandlung",
    numberOfWeeksUntilNextTreatmentHoofcare: "Hufpflege-Rhythmus in Wochen",
    numberOfWeeksUntilNextTreatmentToothcare: "Zahnpflege-Rhythmus in Wochen",
  };

  translate(key: string | undefined): string {
    if (!key) return "";
    return this.dictionary[key];
  }
}
