const seen = {}

// Lazy version of uniqWith because I didn't want to set up webpack
const uniqWith = (arr, f) => {
    return arr.filter((item) => {
        const key = f(item)
        if (seen[key]) return false

        console.log(key)
        seen[key] = true
        return true
    })
}

const colorKey = (x: { r: number; g: number; b: number }) =>
    // Figma seems to need the numbers rounded down to match the spec.. unsure why
    `${Math.round(x.r * 255)};${Math.round(x.g * 255)};${Math.round(x.b * 255)}`

const backgroundColors = uniqWith(
    []
        .concat(
            ...figma.currentPage
                .findAll()
                .map((n: RectangleNode) =>
                    [].concat(
                        // n.backgrounds || [],
                        n.fills || [],
                        n.strokes || []
                    )
                )
                .filter((x) => !!x && x.length > 0)
        )
        .map((c) => c.color)
        .filter((c) => !!c),
    colorKey
)

const nodes: SceneNode[] = []

backgroundColors.map((color, i) => {
    const rect = figma.createRectangle()
    rect.x = (i * 150) % (150 * 10)
    rect.y = Math.floor((i * 150) / 1500) * 150
    rect.fills = [{ type: "SOLID", color }]
    figma.currentPage.appendChild(rect)
    nodes.push(rect)
})

figma.currentPage.selection = nodes
figma.viewport.scrollAndZoomIntoView(nodes)

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin()
