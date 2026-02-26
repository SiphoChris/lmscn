// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"fill-black.mdx": () => import("../content/docs/fill-black.mdx?collection=docs"), "flashcards.mdx": () => import("../content/docs/flashcards.mdx?collection=docs"), "guide.mdx": () => import("../content/docs/guide.mdx?collection=docs"), "hotspot.mdx": () => import("../content/docs/hotspot.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "match.mdx": () => import("../content/docs/match.mdx?collection=docs"), "order.mdx": () => import("../content/docs/order.mdx?collection=docs"), "progress-tracker.mdx": () => import("../content/docs/progress-tracker.mdx?collection=docs"), "quiz.mdx": () => import("../content/docs/quiz.mdx?collection=docs"), "reading-passage.mdx": () => import("../content/docs/reading-passage.mdx?collection=docs"), "scramble.mdx": () => import("../content/docs/scramble.mdx?collection=docs"), "spaced-repetition.mdx": () => import("../content/docs/spaced-repetition.mdx?collection=docs"), }),
};
export default browserCollections;