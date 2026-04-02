type SplitTarget =
  | string
  | string[]
  | Element
  | Element[]
  | NodeListOf<Element>;

type SplitOptions = {
  type: string;
  linesClass?: string;
};

type SplitPart = {
  chars: HTMLElement[];
  words: HTMLElement[];
  revert: () => void;
};

const resolveElements = (target: SplitTarget): HTMLElement[] => {
  if (typeof target === "string") {
    return Array.from(document.querySelectorAll(target)) as HTMLElement[];
  }

  if (
    Array.isArray(target) &&
    target.every((item) => typeof item === "string")
  ) {
    return (target as string[]).flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
    ) as HTMLElement[];
  }

  if (Array.isArray(target)) {
    return target as HTMLElement[];
  }

  if (target instanceof Element) {
    return [target as HTMLElement];
  }

  return Array.from(target) as HTMLElement[];
};

const buildChars = (text: string) =>
  Array.from(text).map((char) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.whiteSpace = char === " " ? "pre" : "normal";
    span.textContent = char === " " ? "\u00A0" : char;
    return span;
  });

const buildWords = (text: string) =>
  text.split(" ").filter(Boolean).map((word) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = word;
    return span;
  });

export const splitTextContent = (
  target: SplitTarget,
  options: SplitOptions
): SplitPart => {
  const elements = resolveElements(target);
  const chars: HTMLElement[] = [];
  const words: HTMLElement[] = [];
  const snapshots = elements.map((element) => ({
    element,
    html: element.innerHTML,
  }));

  elements.forEach((element) => {
    const text = element.textContent ?? "";
    const wantsChars = options.type.includes("chars");
    const wantsWords = options.type.includes("words");
    const wrapper = document.createElement("span");

    if (options.type.includes("lines")) {
      wrapper.className = options.linesClass ?? "";
      wrapper.style.display = "block";
    }

    if (wantsChars) {
      const charNodes = buildChars(text);
      chars.push(...charNodes);
      wrapper.append(...charNodes);
    } else if (wantsWords) {
      const wordNodes = buildWords(text);
      words.push(...wordNodes);
      wordNodes.forEach((word, index) => {
        wrapper.append(word);
        if (index < wordNodes.length - 1) {
          wrapper.append(document.createTextNode("\u00A0"));
        }
      });
    } else {
      wrapper.textContent = text;
    }

    if (wantsChars && wantsWords) {
      words.push(...buildWords(text));
    }

    element.innerHTML = "";
    element.append(wrapper);
  });

  return {
    chars,
    words,
    revert: () => {
      snapshots.forEach(({ element, html }) => {
        element.innerHTML = html;
      });
    },
  };
};
