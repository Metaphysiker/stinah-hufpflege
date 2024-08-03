export class Translator {
  dictionary: { [key: string]: string } = {
    userNotFound: "User wurde nicht gefunden.",
    wrongPassword: "Falsches Passwort.",
  };

  translate(key: string): string {
    return this.dictionary[key];
  }
}
