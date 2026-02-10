const container = document.getElementById("container");

// Container controls
const direction = document.getElementById("direction");
const justify = document.getElementById("justify");
const alignItems = document.getElementById("alignItems");
const wrap = document.getElementById("wrap");
const alignContent = document.getElementById("alignContent");
const gap = document.getElementById("gap");
const rowGap = document.getElementById("rowGap");
const colGap = document.getElementById("colGap");
const containerW = document.getElementById("containerW");
const containerH = document.getElementById("containerH");

// Item controls
const selectedItem = document.getElementById("selectedItem");
const order = document.getElementById("order");
const grow = document.getElementById("grow");
const shrink = document.getElementById("shrink");
const basis = document.getElementById("basis");
const alignSelf = document.getElementById("alignSelf");
const minW = document.getElementById("minW");
const fontSize = document.getElementById("fontSize");
const count = document.getElementById("count");
const multiLine = document.getElementById("multiLine");

// Labels
const gapValue = document.getElementById("gapValue");
const rowGapValue = document.getElementById("rowGapValue");
const colGapValue = document.getElementById("colGapValue");
const wValue = document.getElementById("wValue");
const hValue = document.getElementById("hValue");

const orderValue = document.getElementById("orderValue");
const growValue = document.getElementById("growValue");
const shrinkValue = document.getElementById("shrinkValue");
const minWValue = document.getElementById("minWValue");
const fontValue = document.getElementById("fontValue");
const countValue = document.getElementById("countValue");

const cssOut = document.getElementById("cssOut");

// Buttons
const resetBtn = document.getElementById("reset");
const presetCenter = document.getElementById("presetCenter");
const presetWrap = document.getElementById("presetWrap");
const preset2col = document.getElementById("preset2col");

// Per-item state (so switching selection doesn’t lose settings)
let itemStates = []; // array of {order,grow,shrink,basis,alignSelf,minW,fontSize}
let currentIndex = 0;

function defaultItemState() {
    return {
        order: 0,
        grow: 0,
        shrink: 1,
        basis: "auto",
        alignSelf: "auto",
        minW: 70,
        fontSize: 16,
    };
}

function buildItems(n) {
    container.innerHTML = "";
    itemStates = Array.from({ length: n }, (_, i) => itemStates[i] ?? defaultItemState());

    for (let i = 0; i < n; i++) {
        const div = document.createElement("div");
        div.className = "item";
        div.dataset.index = String(i);

        // contenu
        if (i === 1) {
            div.innerHTML = multiLine.checked ? `2<br><small>texte</small>` : `2 <small>texte</small>`;
        } else {
            div.textContent = String(i + 1);
        }

        div.addEventListener("click", () => {
            currentIndex = i;
            selectedItem.value = String(i);
            syncItemControlsFromState();
            apply();
        });

        container.appendChild(div);
    }

    // rebuild select list
    selectedItem.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = `Item ${i + 1}`;
        selectedItem.appendChild(opt);
    }

    if (currentIndex >= n) currentIndex = 0;
    selectedItem.value = String(currentIndex);
    syncItemControlsFromState();
}

function syncItemControlsFromState() {
    const s = itemStates[currentIndex];

    order.value = String(s.order);
    grow.value = String(s.grow);
    shrink.value = String(s.shrink);
    basis.value = s.basis;
    alignSelf.value = s.alignSelf;
    minW.value = String(s.minW);
    fontSize.value = String(s.fontSize);

    orderValue.textContent = String(s.order);
    growValue.textContent = String(s.grow);
    shrinkValue.textContent = String(s.shrink);
    minWValue.textContent = String(s.minW);
    fontValue.textContent = String(s.fontSize);
}

function saveItemControlsToState() {
    const s = itemStates[currentIndex];

    s.order = Number(order.value);
    s.grow = Number(grow.value);
    s.shrink = Number(shrink.value);
    s.basis = basis.value;
    s.alignSelf = alignSelf.value;
    s.minW = Number(minW.value);
    s.fontSize = Number(fontSize.value);

    orderValue.textContent = String(s.order);
    growValue.textContent = String(s.grow);
    shrinkValue.textContent = String(s.shrink);
    minWValue.textContent = String(s.minW);
    fontValue.textContent = String(s.fontSize);
}

function apply() {
    // container styles
    container.style.flexDirection = direction.value;
    container.style.justifyContent = justify.value;
    container.style.alignItems = alignItems.value;
    container.style.flexWrap = wrap.value;
    container.style.alignContent = alignContent.value;

    container.style.gap = `${gap.value}px`;
    container.style.rowGap = `${rowGap.value}px`;
    container.style.columnGap = `${colGap.value}px`;

    container.style.width = `${containerW.value}%`;
    container.style.height = `${containerH.value}px`;

    gapValue.textContent = gap.value;
    rowGapValue.textContent = rowGap.value;
    colGapValue.textContent = colGap.value;
    wValue.textContent = containerW.value;
    hValue.textContent = containerH.value;

    // apply item states to DOM
    const items = container.querySelectorAll(".item");
    items.forEach((it, i) => {
        const s = itemStates[i];

        it.style.order = String(s.order);
        it.style.flexGrow = String(s.grow);
        it.style.flexShrink = String(s.shrink);
        it.style.flexBasis = s.basis;
        it.style.alignSelf = s.alignSelf;
        it.style.minWidth = `${s.minW}px`;
        it.style.fontSize = `${s.fontSize}px`;

        it.classList.toggle("isSelected", i === currentIndex);

        // update item 2 content baseline demo
        if (i === 1) {
            it.innerHTML = multiLine.checked ? `2<br><small>texte</small>` : `2 <small>texte</small>`;
        }
    });

    // show CSS output (container + selected item)
    const s = itemStates[currentIndex];
    cssOut.textContent =
        `/* CONTAINER */
#container {
  display: flex;                       /* default */
  flex-direction: ${direction.value};              /* default: row */
  justify-content: ${justify.value};             /* default: flex-start */
  align-items: ${alignItems.value};               /* default: stretch */
  flex-wrap: ${wrap.value};                    /* default: nowrap */
  align-content: ${alignContent.value};            /* default: stretch (utile si wrap + plusieurs lignes) */
  gap: ${gap.value}px;                         /* default: 0 */
  row-gap: ${rowGap.value}px;                    /* default: normal (souvent 0) */
  column-gap: ${colGap.value}px;                 /* default: normal (souvent 0) */
  width: ${containerW.value}%;
  height: ${containerH.value}px;
}

/* ITEM SÉLECTIONNÉ (Item ${currentIndex + 1}) */
#container .item:nth-child(${currentIndex + 1}) {
  order: ${s.order};                         /* default: 0 */
  flex-grow: ${s.grow};                      /* default: 0 */
  flex-shrink: ${s.shrink};                  /* default: 1 */
  flex-basis: ${s.basis};                    /* default: auto */
  align-self: ${s.alignSelf};                /* default: auto */
  min-width: ${s.minW}px;
  font-size: ${s.fontSize}px;
}`;
}

function setDefaults() {
    // container defaults (we start with visible gaps)
    direction.value = "row";
    justify.value = "flex-start";
    alignItems.value = "stretch";
    wrap.value = "nowrap";
    alignContent.value = "stretch";

    gap.value = 12;
    rowGap.value = 12;
    colGap.value = 12;

    containerW.value = 100;
    containerH.value = 320;

    multiLine.checked = false;

    // items
    currentIndex = 0;
    const n = Number(count.value) || 5;
    buildItems(n);
    itemStates = itemStates.map(() => defaultItemState());
    syncItemControlsFromState();

    // labels count
    countValue.textContent = String(n);

    apply();
}

function applyPresetCenter() {
    direction.value = "row";
    wrap.value = "nowrap";
    justify.value = "center";
    alignItems.value = "center";
    alignContent.value = "stretch";
    gap.value = 12;
    rowGap.value = 12;
    colGap.value = 12;
    containerW.value = 100;
    containerH.value = 320;
    apply();
}

function applyPresetWrap() {
    direction.value = "row";
    wrap.value = "wrap";
    justify.value = "flex-start";
    alignItems.value = "flex-start";
    alignContent.value = "space-between";
    gap.value = 12;
    rowGap.value = 12;
    colGap.value = 12;

    // make items wider to force wrap
    itemStates.forEach(s => { s.minW = 160; });
    syncItemControlsFromState();

    apply();
}

function applyPreset2col() {
    // “2 colonnes” = wrap + basis 50% + border-box se gère via padding, ici on montre l’idée avec basis
    direction.value = "row";
    wrap.value = "wrap";
    justify.value = "flex-start";
    alignItems.value = "stretch";
    alignContent.value = "stretch";
    gap.value = 12;
    rowGap.value = 12;
    colGap.value = 12;

    itemStates.forEach(s => {
        s.basis = "50%";
        s.grow = 0;
        s.shrink = 1;
        s.minW = 120;
    });
    syncItemControlsFromState();
    apply();
}

// listeners
function hook() {
    // Container controls
    [direction, justify, alignItems, wrap, alignContent, gap, rowGap, colGap, containerW, containerH].forEach(el =>
        el.addEventListener("input", () => apply())
    );

    // Selected item switch
    selectedItem.addEventListener("input", () => {
        currentIndex = Number(selectedItem.value);
        syncItemControlsFromState();
        apply();
    });

    // Item controls (save -> apply)
    [order, grow, shrink, basis, alignSelf, minW, fontSize].forEach(el =>
        el.addEventListener("input", () => {
            saveItemControlsToState();
            apply();
        })
    );

    // Items count rebuild
    count.addEventListener("input", () => {
        const n = Number(count.value);
        countValue.textContent = String(n);
        buildItems(n);
        apply();
    });

    // Baseline demo toggle
    multiLine.addEventListener("input", () => apply());

    // Buttons
    resetBtn.addEventListener("click", setDefaults);
    presetCenter.addEventListener("click", applyPresetCenter);
    presetWrap.addEventListener("click", applyPresetWrap);
    preset2col.addEventListener("click", applyPreset2col);
}

// init
hook();
setDefaults();
