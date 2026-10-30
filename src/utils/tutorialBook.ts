// The Wing 1 Tutorial book as a printable PDF; its QR code opens /interaction/barricade.
export const TUTORIAL_BOOK_PDF = "https://assets.drunagor.app/book/tutorial-s1/Drunagor-Tutorial-Into-the-Underkeep.pdf";

// Whether a scenario or wing name is the Wing 1 Tutorial.
export function isTutorialScenario(name?: string | null): boolean {
  return (name || "").toLowerCase().includes("tutorial");
}
