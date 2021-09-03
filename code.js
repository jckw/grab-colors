const seen = {};
const uniqWith = (arr, f) => {
    return arr.filter((item) => {
        const key = f(item);
        if (seen[key])
            return false;
        console.log(key);
        seen[key] = true;
        return true;
    });
};
const backgroundColors = uniqWith([]
    .concat(...figma.currentPage
    .findAll()
    .map((n) => [].concat(
// n.backgrounds || [],
n.fills || [], n.strokes || []))
    .filter((x) => !!x && x.length > 0))
    .map((c) => c.color)
    .filter((c) => !!c), (x) => `${Math.round(x.r * 255)};${Math.round(x.g * 255)};${Math.round(x.b * 255)}`);
const nodes = [];
backgroundColors.map((color, i) => {
    const rect = figma.createRectangle();
    rect.x = (i * 150) % (150 * 10);
    rect.y = Math.floor((i * 150) / 1500) * 150;
    rect.fills = [{ type: "SOLID", color }];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
});
figma.currentPage.selection = nodes;
figma.viewport.scrollAndZoomIntoView(nodes);
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
