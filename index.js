const container = document.getElementById("container");

const direction = document.getElementById("direction");
const justify = document.getElementById("justify");
const align = document.getElementById("align");
const wrap = document.getElementById("wrap");
const gap = document.getElementById("gap");
const gapValue = document.getElementById("gapValue");
const wideItems = document.getElementById("wideItems");
const resetBtn = document.getElementById("reset");
const cssOut = document.getElementById("cssOut");

function apply() {
    container.style.flexDirection = direction.value;
    container.style.justifyContent = justify.value;
    container.style.alignItems = align.value;
    container.style.flexWrap = wrap.value;
    container.style.gap = `${gap.value}px`;

    gapValue.textContent = gap.value;

    const items = container.querySelectorAll(".item");
    items.forEach((it) => {
        it.style.minWidth = wideItems.checked ? "160px" : "70px";
    });

    cssOut.textContent =
        `#container {
  display: flex;                 /* default */
  flex-direction: ${direction.value};        /* default: row */
  justify-content: ${justify.value};       /* default: flex-start */
  align-items: ${align.value};           /* default: stretch */
  flex-wrap: ${wrap.value};              /* default: nowrap */
  gap: ${gap.value}px;                    /* default: 0px */
}`;
}

resetBtn.addEventListener("click", () => {
    direction.value = "row";
    justify.value = "flex-start";
    align.value = "stretch";
    wrap.value = "nowrap";
    gap.value = 12;          // volontairement pas 0, pour que ça se voie
    wideItems.checked = false;
    apply();
});

[direction, justify, align, wrap, gap, wideItems].forEach((el) =>
    el.addEventListener("input", apply)
);

apply();
