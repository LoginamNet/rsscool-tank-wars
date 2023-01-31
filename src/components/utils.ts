/* functions ------------------------------------------------- */

// get element by selector

export function checkedQuerySelector(parent: Element | Document, selector: string): HTMLElement {
    const el = parent.querySelector(selector);
    if (!el) {
        throw new Error(`Selector ${selector} didn't match any elements.`);
    }
    return el as HTMLElement;
}

// create new HTML element and add selectors

export function createEl(classList: string, element = 'div'): HTMLElement {
    const el = document.createElement(element);
    el.classList.add(...classList.split(' '));
    return el;
}

// append one HTML element to another

export function appendEl(parent: HTMLElement, element: HTMLElement): void {
    parent.append(element);
}

// draw circle wirh canvas arc method

export function drawCanvasArc(ctx: CanvasRenderingContext2D, xPosition: number, yPosition: number, radius: number) {
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}
