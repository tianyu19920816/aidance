import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";

interface VideosResponse {
  videos: Array<{
    id: string;
    title: string;
    choreographer: string;
    difficulty: string;
    duration: string;
    category: string;
    description: string;
    coverImage: string;
  }>;
}

export const meta = () => [
  { title: "AI Dance Studio" },
  {
    name: "description",
    content: "选择你喜欢的舞蹈，上传照片，生成你的专属舞蹈视频。",
  },
];

export async function loader({ request }: Route.LoaderArgs): Promise<VideosResponse> {
  const url = new URL("/api/videos", request.url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Response("Failed to load videos", { status: 500 });
  }

  const data = (await response.json()) as VideosResponse;
  return data;
}

export default function Home() {
  const { videos } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 px-8 py-16 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_65%)]" />
        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium tracking-wide backdrop-blur">
            Cloudflare Workers · AI 舞蹈生成
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            选择你喜欢的舞蹈视频，让 AI 为你量身打造同款舞姿
          </h1>
          <p className="text-lg text-white/80">
            浏览我们的舞蹈素材库，挑选风格，然后上传你的照片。我们的生成服务会自动融合你的形象，输出独一无二的舞蹈视频。
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="#library"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-lg shadow-indigo-900/40 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              浏览舞蹈库
            </Link>
            <span className="text-sm text-white/70">
              视频素材托管在 Cloudflare R2，随时调用
            </span>
          </div>
        </div>
      </section>

      <section id="library" className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">舞蹈素材库</h2>
          <p className="text-base text-gray-600 dark:text-gray-300">
            精选不同风格的舞蹈编排，每支视频都可以作为 AI 生成的模板。点击“做同款”进入生成流程。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-gray-900/5 transition hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800/60 dark:bg-gray-900"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.coverImage}
                  alt={video.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                  <span>{video.difficulty}</span>
                  <span>{video.duration}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {video.title}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    编舞 · {video.choreographer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {video.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    {video.category}
                  </span>
                  <Link
                    to={`/generate/${video.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    做同款
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
