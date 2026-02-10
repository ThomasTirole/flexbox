const container = document.getElementById("container");

// Container controls
const direction = document.getElementById("direction");
const justify = document.getElementById("justify");
const alignItems = document.getElementById("alignItems");
const wrap = document.getElementById("wrap");
const alignContent = document.getElementById("alignContent");
const gap = document.getElementById("gap");
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
const wValue = document.getElementById("wValue");
const hValue = document.getElementById("hValue");

const orderValue = document.getElementById("orderValue");
const growValue = document.getElementById("growValue");
const shrinkValue = document.getElementById("shrinkValue");
const minWValue = document.getElementById("minWValue");
const fontValue = document.getElementById("fontValue");
const countValue = document.getElementById("countValue");

const cssOut = document.getElementById("cssOut");
const resetBtn = document.getElementById("reset");

// Per-item state (so switching selection doesn’t lose settings)
let itemStates = [];
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

function colorClass(i) {
    // c1..c12 (boucle)
    const n = (i % 12) + 1;
    return `c${n}`;
}

function buildItems(n) {
    container.innerHTML = "";

    // keep existing states when possible
    itemStates = Array.from({ length: n }, (_, i) => itemStates[i] ?? defaultItemState());

    for (let i = 0; i < n; i++) {
        const div = document.createElement("div");
        div.className = `item ${colorClass(i)}`;
        div.dataset.index = String(i);

        // content
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
    container.style.width = `${containerW.value}%`;
    container.style.height = `${containerH.value}px`;

    gapValue.textContent = gap.value;
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

        if (i === 1) {
            it.innerHTML = multiLine.checked ? `2<br><small>texte</small>` : `2 <small>texte</small>`;
        }
    });

    // show CSS output (container + selected item)
    const s = itemStates[currentIndex];
    cssOut.textContent =
        `/* CONTAINER */
#container {
  display: flex;                 /* default */
  flex-direction: ${direction.value};        /* default: row */
  justify-content: ${justify.value};       /* default: flex-start */
  align-items: ${alignItems.value};           /* default: stretch */
  flex-wrap: ${wrap.value};              /* default: nowrap */
  align-content: ${alignContent.value};      /* default: stretch (utile si wrap + lignes) */
  gap: ${gap.value}px;                    /* default: 0 */
  width: ${containerW.value}%;
  height: ${containerH.value}px;
}

/* ITEM SÉLECTIONNÉ (Item ${currentIndex + 1}) */
#container .item:nth-child(${currentIndex + 1}) {
  order: ${s.order};               /* default: 0 */
  flex-grow: ${s.grow};            /* default: 0 */
  flex-shrink: ${s.shrink};        /* default: 1 */
  flex-basis: ${s.basis};          /* default: auto */
  align-self: ${s.alignSelf};      /* default: auto */
  min-width: ${s.minW}px;
  font-size: ${s.fontSize}px;
}`;
}

function setDefaults() {
    // container defaults (gap visible)
    direction.value = "row";
    justify.value = "flex-start";
    alignItems.value = "stretch";
    wrap.value = "nowrap";
    alignContent.value = "stretch";

    gap.value = 12;
    containerW.value = 100;
    containerH.value = 320;

    // items
    multiLine.checked = false;
    currentIndex = 0;

    const n = Number(count.value) || 5;
    countValue.textContent = String(n);

    itemStates = Array.from({ length: n }, () => defaultItemState());
    buildItems(n);

    apply();
}

// listeners
function hook() {
    [direction, justify, alignItems, wrap, alignContent, gap, containerW, containerH].forEach(el =>
        el.addEventListener("input", apply)
    );

    selectedItem.addEventListener("input", () => {
        currentIndex = Number(selectedItem.value);
        syncItemControlsFromState();
        apply();
    });

    [order, grow, shrink, basis, alignSelf, minW, fontSize].forEach(el =>
        el.addEventListener("input", () => {
            saveItemControlsToState();
            apply();
        })
    );

    count.addEventListener("input", () => {
        const n = Number(count.value);
        countValue.textContent = String(n);
        buildItems(n);
        apply();
    });

    multiLine.addEventListener("input", apply);

    resetBtn.addEventListener("click", setDefaults);
}

// init
hook();
setDefaults();
