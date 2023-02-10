import { CANVAS_GROUND, CANVAS_WIDTH } from '../common/constants';
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

// toggle class of an element by selectors

export function toggleElClass(elClass: string, toggleClass: string): void {
    const el = checkedQuerySelector(document, `.${elClass}`);
    el.classList.toggle(toggleClass);
}

// check if elenent contains selector

export function checkElClass(elClass: string, checkedClass: string): boolean {
    const el = checkedQuerySelector(document, `.${elClass}`);
    return el.classList.contains(checkedClass);
}

// draw circle wirh canvas arc method

export function drawCanvasArc(ctx: CanvasRenderingContext2D, xPosition: number, yPosition: number, radius: number) {
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}

// function of convertation from degrees to radian

export const degToRad = (n: number) => (n / 180) * Math.PI;

// function cheks pixel is ground
// compare pixel RGB-channels and constant CANVAS_GROUND RGB-channels

export function isGround(pixel: ImageData) {
    if (
        pixel.data[0] === parseInt(CANVAS_GROUND[1] + CANVAS_GROUND[2], 16) &&
        pixel.data[1] === parseInt(CANVAS_GROUND[3] + CANVAS_GROUND[4], 16) &&
        pixel.data[2] === parseInt(CANVAS_GROUND[5] + CANVAS_GROUND[6], 16)
    ) {
        return true;
    }
}

export function isOutsidePlayZone(x: number) {
    return x < 0 || x > CANVAS_WIDTH;
}

const arrFirstNames = [
    'Adam',
    'Alex',
    'Aaron',
    'Ben',
    'Carl',
    'Dan',
    'David',
    'Edward',
    'Fred',
    'Frank',
    'George',
    'Hal',
    'Hank',
    'Ike',
    'John',
    'Jack',
    'Joe',
    'Larry',
    'Monte',
    'Matthew',
    'Mark',
    'Nathan',
    'Otto',
    'Paul',
    'Peter',
    'Roger',
    'Roger',
    'Steve',
    'Thomas',
    'Tim',
    'Ty',
    'Victor',
    'Walter',
];

export const getRandomName = (): string => {
    const name = arrFirstNames[Math.floor(Math.random() * arrFirstNames.length)];
    return `${name}`;
};
