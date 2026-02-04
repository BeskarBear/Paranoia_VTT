export class ParanoiaItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["paranoia-vtt", "sheet", "item"],
      width: 520,
      height: 420
    });
  }

  get template() {
    return `systems/paranoia-vtt/templates/item/${this.item.type}-sheet.hbs`;
  }
}
