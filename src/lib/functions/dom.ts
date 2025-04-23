export function $<HET extends HTMLElement>(query: string): HET | null {
    return document.querySelector<HET>(query);
}
