export class Translator {
  dictionary: { [key: string]: string } = {
    userNotFound: "User wurde nicht gefunden.",
    wrongPassword: "Falsches Passwort.",
    hoof: "Huf",
    tooth: "Zahn",
    Hoofcare: "Hufpflege",
    Toothcare: "Zahnpflege",
    Healthcare: "Gesundheit",
    general: "Allgemein",
    IHorse: "Pferd",
    ITreatment: "Behandlung",
    IFile: "Datei",
    numberOfWeeksUntilNextTreatmentHoofcare: "Hufpflege-Rhythmus in Wochen",
    numberOfWeeksUntilNextTreatmentToothcare: "Zahnpflege-Rhythmus in Wochen",
  };

  translate(key: string | undefined): string {
    if (!key) return "";
    if (!this.dictionary[key]) return key;
    return this.dictionary[key];
  }
}
