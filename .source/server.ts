// @ts-nocheck
import * as __fd_glob_12 from "../content/docs/spaced-repetition.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/scramble.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/reading-passage.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/quiz.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/progress-tracker.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/order.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/match.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/hotspot.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/flashcards.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/fill-black.mdx?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"fill-black.mdx": __fd_glob_1, "flashcards.mdx": __fd_glob_2, "hotspot.mdx": __fd_glob_3, "index.mdx": __fd_glob_4, "installation.mdx": __fd_glob_5, "match.mdx": __fd_glob_6, "order.mdx": __fd_glob_7, "progress-tracker.mdx": __fd_glob_8, "quiz.mdx": __fd_glob_9, "reading-passage.mdx": __fd_glob_10, "scramble.mdx": __fd_glob_11, "spaced-repetition.mdx": __fd_glob_12, });