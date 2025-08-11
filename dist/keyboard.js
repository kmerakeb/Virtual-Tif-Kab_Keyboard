class VirtualTifinaghKeyboard {
  constructor(input) {
    this.input = input;
    this.container = document.createElement("div");
    this.container.className = "tifinagh-virtual-keys";

    input.insertAdjacentElement("afterend", this.container);

    this.currentLayout = "tifinagh";
    this.capsOn = false;

    this.layouts = {
      row0: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-"],
      tifinagh: [
        ["ⴰ", "ⴱ", "ⴲ", "ⴳ", "ⴴ", "ⴵ", "ⴶ", "ⴷ", "ⴸ", "ⴹ", "ⴺ", "ⴻ", "ⴼ", "ⴽ", "ⴾ", "ⴿ"],
        ["ⵀ", "ⵁ", "ⵂ", "ⵃ", "ⵄ", "ⵅ", "ⵆ", "ⵇ", "ⵈ", "ⵉ", "ⵊ", "ⵋ", "ⵌ", "ⵍ", "ⵎ", "ⵏ"],
        ["ⵐ", "ⵑ", "ⵒ", "ⵓ", "ⵔ", "ⵕ", "ⵖ", "ⵗ", "ⵘ", "ⵙ", "ⵚ", "ⵛ", "ⵜ", "ⵝ", "ⵞ", "ⵟ"],
        ["ⵠ", "ⵡ", "ⵢ", "ⵣ", "ⵤ", "ⵥ"]
      ]
    };

    this.renderKeyboard();
  }

  insertAtCursor(value) {
    const field = this.input;
    const [start, end] = [field.selectionStart, field.selectionEnd];
    const before = field.value.substring(0, start);
    const after = field.value.substring(end);
    field.value = before + value + after;
    field.selectionStart = field.selectionEnd = start + value.length;
    field.focus();
  }

  createButton(label, onClick, extraClass = "") {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.type = "button";
    btn.className = "key " + extraClass;
    btn.addEventListener("click", onClick);
    return btn;
  }

  getKabyleLayout() {
    const base = [
      ["č", "ɛ", "ɣ", "ḥ", "ṭ", "ṣ", "ẓ", "ṛ", "ṇ", "ḍ"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
      ["k", "l", "m", "n", "o", "p", "q", "r", "s", "t"],
      ["u", "v", "w", "x", "y", "z", "ž"]
    ];

    return this.capsOn
      ? base.map(row => row.map(ch => ch.toUpperCase()))
      : base;
  }

  renderKeyboard() {
    this.container.innerHTML = "";

    // Row 0 (numbers)
    const row0 = document.createElement("div");
    row0.className = "keyboard-row";
    this.layouts.row0.forEach(key => {
      row0.appendChild(this.createButton(key, () => this.insertAtCursor(key)));
    });
    this.container.appendChild(row0);

    // Main layout rows
    const layout =
      this.currentLayout === "kabyle"
        ? this.getKabyleLayout()
        : this.layouts[this.currentLayout];

    layout.forEach((row, idx) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "keyboard-row";

      // Add ⇧ key to first row of Kabyle layout
      if (this.currentLayout === "kabyle" && idx === 0) {
        const capsBtn = this.createButton("⇧", () => {
          this.capsOn = !this.capsOn;
          this.renderKeyboard();
        }, "key-caps");
        rowDiv.appendChild(capsBtn);
      }

      row.forEach(key => {
        rowDiv.appendChild(
          this.createButton(key, () => this.insertAtCursor(key))
        );
      });

      // Add delete key to last row
      if (idx === layout.length - 1) {
        const delBtn = this.createButton("⌫", () => {
          const field = this.input;
          const [start, end] = [field.selectionStart, field.selectionEnd];
          if (start > 0) {
            const before = field.value.substring(0, start - 1);
            const after = field.value.substring(end);
            field.value = before + after;
            field.selectionStart = field.selectionEnd = start - 1;
            field.focus();
          }
        }, "key-delete");
        rowDiv.appendChild(delBtn);
      }

      this.container.appendChild(rowDiv);
    });

    // Spacebar + Layout Switch
    const controlRow = document.createElement("div");
    controlRow.className = "keyboard-row";

    const spaceBtn = this.createButton("Space", () =>
      this.insertAtCursor(" "), "key-space");

    const switchBtn = this.createButton(
      this.currentLayout === "tifinagh" ? "kab ⌨️" : "ⵜⵉⴼⵉⵏⴰⵖ ⌨️",
      () => {
        this.currentLayout =
          this.currentLayout === "tifinagh" ? "kabyle" : "tifinagh";
        this.capsOn = false;
        this.renderKeyboard();
      },
      "key-switch"
    );

    controlRow.appendChild(spaceBtn);
    controlRow.appendChild(switchBtn);
    this.container.appendChild(controlRow);
  }

  static initAll() {
    document
      .querySelectorAll("input.tifinagh-keyboard")
      .forEach(input => new VirtualTifinaghKeyboard(input));
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  VirtualTifinaghKeyboard.initAll();
});
