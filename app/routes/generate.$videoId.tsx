import type { Route } from "./+types/generate.$videoId";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";

interface VideoResponse {
  video: {
    id: string;
    title: string;
    choreographer: string;
    difficulty: string;
    duration: string;
    description: string;
    previewUrl: string;
  };
}

interface GenerationResponse {
  generation?: {
    id: string;
    status: string;
    message: string;
  };
  error?: string;
}

export async function loader({
  params,
  request,
}: Route.LoaderArgs): Promise<VideoResponse> {
  const { videoId } = params;

  if (!videoId) {
    throw new Response("Video not found", { status: 404 });
  }

  const url = new URL(`/api/videos/${videoId}`, request.url);
  const response = await fetch(url);

  if (response.status === 404) {
    throw new Response("Video not found", { status: 404 });
  }

  if (!response.ok) {
    throw new Response("Failed to load video", { status: 500 });
  }

  const data = (await response.json()) as VideoResponse;
  return data;
}

export async function action({ request }: Route.ActionArgs): Promise<GenerationResponse> {
  const formData = await request.formData();
  const videoId = formData.get("videoId");
  const prompt = formData.get("prompt");
  const contact = formData.get("contact");
  const referenceImage = formData.get("referenceImage");

  const payload = {
    videoId: typeof videoId === "string" ? videoId : undefined,
    prompt: typeof prompt === "string" ? prompt : undefined,
    contact: typeof contact === "string" ? contact : undefined,
    referenceImageName:
      referenceImage instanceof File ? referenceImage.name : undefined,
  };

  const url = new URL("/api/generations", request.url);
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as GenerationResponse;
  if (!response.ok) {
    return { error: data.error ?? "生成任务提交失败" } satisfies GenerationResponse;
  }

  return data;
}

export default function GenerateVideo() {
  const { video } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
        >
          ← 返回舞蹈库
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {video.title}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300">
          编舞 {video.choreographer} · 难度 {video.difficulty} · 时长 {video.duration}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-black shadow-xl shadow-gray-900/20 dark:border-gray-800/80">
            <video
              controls
              playsInline
              poster=""
              src={video.previewUrl}
              className="h-full w-full"
            >
              您的浏览器暂不支持播放视频。
            </video>
          </div>
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-900/10 dark:border-gray-800/80 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              模板简介
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {video.description}
            </p>
            <ul className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
              <li className="rounded-2xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                Cloudflare R2 素材就绪
              </li>
              <li className="rounded-2xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                支持单张照片驱动换脸
              </li>
              <li className="rounded-2xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                生成完成后可一键分享
              </li>
              <li className="rounded-2xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                Worker 内置排队调度
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-900/10 dark:border-gray-800/80 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              上传照片，提交生成任务
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              上传正面高清照片，填写备注，我们会将任务加入生成队列，并在完成后通过邮件或站内通知你。
            </p>

            <Form method="post" encType="multipart/form-data" className="mt-6 space-y-5">
              <input type="hidden" name="videoId" value={video.id} />

              <div className="space-y-2">
                <label
                  htmlFor="referenceImage"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  参考照片
                </label>
                <input
                  id="referenceImage"
                  name="referenceImage"
                  type="file"
                  accept="image/*"
                  required
                  className="block w-full cursor-pointer rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  支持 jpg、png，建议尺寸 1024x1024。
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  个性化描述（可选）
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={4}
                  placeholder="例如：希望穿着银色流苏舞服，增加灯光闪烁效果"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  联系方式（选填）
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "提交中..." : "提交生成任务"}
              </button>
            </Form>
          </div>

          {actionData?.generation && (
            <div className="rounded-3xl border border-emerald-300/70 bg-emerald-50 p-6 text-emerald-700 shadow-lg shadow-emerald-900/10 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
              <h3 className="text-lg font-semibold">任务已排队</h3>
              <p className="mt-2 text-sm">
                {actionData.generation.message}
              </p>
              <p className="mt-4 text-xs font-mono">
                Generation ID: {actionData.generation.id}
              </p>
            </div>
          )}

          {actionData?.error && (
            <div className="rounded-3xl border border-rose-300/70 bg-rose-50 p-6 text-rose-700 shadow-lg shadow-rose-900/10 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              <h3 className="text-lg font-semibold">提交失败</h3>
              <p className="mt-2 text-sm">{actionData.error}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
