import { Hono } from "hono";
import { createRequestHandler } from "react-router";

import { DANCE_VIDEOS } from "../shared/dance-library";

const app = new Hono();

app.get("/api/videos", (c) => {
  return c.json({ videos: DANCE_VIDEOS });
});

app.get("/api/videos/:id", (c) => {
  const id = c.req.param("id");
  const video = DANCE_VIDEOS.find((item) => item.id === id);

  if (!video) {
    return c.json({ error: "Video not found" }, 404);
  }

  return c.json({ video });
});

app.post("/api/generations", async (c) => {
  const payload = await c.req.json<{
    videoId?: string;
    prompt?: string | null;
    contact?: string | null;
    referenceImageName?: string | null;
  }>();

  if (!payload.videoId) {
    return c.json({ error: "videoId is required" }, 400);
  }

  const video = DANCE_VIDEOS.find((item) => item.id === payload.videoId);

  if (!video) {
    return c.json({ error: "Video not found" }, 404);
  }

  const generationId = crypto.randomUUID();

  return c.json(
    {
      generation: {
        id: generationId,
        status: "queued" as const,
        video,
        prompt: payload.prompt ?? null,
        contact: payload.contact ?? null,
        referenceImageName: payload.referenceImageName ?? null,
        message:
          "Your AI dance remix has been queued. We will notify you once rendering is ready.",
      },
    },
    202,
  );
});

app.get("*", (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE,
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
