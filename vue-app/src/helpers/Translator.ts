export class Translator {
  dictionary: { [key: string]: string } = {
    userNotFound: "User wurde nicht gefunden.",
    wrongPassword: "Falsches Passwort.",
    hoof: "Huf",
    tooth: "Zahn",
    Hoofcare: "Hufpflege",
    Toothcare: "Zahnpflege",
    Healthcare: "Gesundheit",
    Movementcare: "Bewegung",
    general: "Allgemein",
    IHorse: "Pferd",
    ITreatment: "Behandlung",
    IFile: "Datei",
    numberOfWeeksUntilNextTreatmentHoofcare: "Hufpflege-Rhythmus in Wochen",
    numberOfWeeksUntilNextTreatmentToothcare: "Zahnpflege-Rhythmus in Wochen",
    numberOfWeeksUntilNextTreatmentHealthcare: "Gesundheits-Rhythmus in Wochen",
    workOnHoof: "Arbeit am Huf",
  };

  translate(key: string | undefined): string {
    if (!key) return "";
    if (!this.dictionary[key]) return key;
    return this.dictionary[key];
  }

  translateBack(value: string): string {
    for (const key in this.dictionary) {
      if (this.dictionary[key] === value) {
        return key;
      }
    }
    return value;
  }
}
