export class RandomMonster {
  id;
  name;
  translation_key;
  variants;
  image;
  constructor(id, name, translation_key, variants, image) {
    this.id = id;
    this.name = name;
    this.translation_key = translation_key;
    this.variants = variants;
    this.image = image;
  }
  getRandomVariant() {
    return this.variants[Math.floor(Math.random() * this.variants.length)];
  }
}
