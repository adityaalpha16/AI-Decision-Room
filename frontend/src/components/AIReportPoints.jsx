function parseReportPoints(text) {
  if (!text) {
    return [];
  }

  // Convert Windows line endings to normal line endings.
  const normalizedText = String(text)
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalizedText) {
    return [];
  }

  /*
    Expected AI format examples:

    **Focus Dilution:** Explanation here.

    **Procrastination:** Explanation here.

    Or:

    - **Focus Dilution:** Explanation here.
    - **Procrastination:** Explanation here.

    We support both formats.
  */

  const lines = normalizedText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const points = [];

  for (const line of lines) {
    // Remove bullet markers.
    const cleanedLine = line.replace(/^[-*•]\s*/, "").trim();

    /*
      Match:

      **Title:** Description
      Title: Description
    */
    const match = cleanedLine.match(
      /^\*{0,2}(.+?)\*{0,2}\s*:\s*(.+)$/
    );

    if (match) {
      const title = match[1]
        .replace(/\*\*/g, "")
        .trim();

      const description = match[2]
        .replace(/\*\*/g, "")
        .trim();

      points.push({
        title,
        description,
      });

      continue;
    }

    /*
      If the AI gives a paragraph without a title,
      keep it instead of throwing the information away.
    */
    points.push({
      title: null,
      description: cleanedLine.replace(/\*\*/g, "").trim(),
    });
  }

  return points;
}

function AIReportPoints({
  text,
  type = "risk",
}) {
  const points = parseReportPoints(text);

  if (points.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-slate-500">
        No information available.
      </p>
    );
  }

  const isRisk = type === "risk";

  return (
    <div className="space-y-3">
      {points.map((point, index) => (
        <div
          key={`${type}-${index}`}
          className={`rounded-xl border p-4 transition-all duration-300 ${
            isRisk
              ? "border-red-400/10 bg-red-500/[0.025] hover:border-red-400/20 hover:bg-red-500/[0.04]"
              : "border-emerald-400/10 bg-emerald-500/[0.025] hover:border-emerald-400/20 hover:bg-emerald-500/[0.04]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                isRisk
                  ? "bg-red-500/10 text-red-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <span className="text-xs font-bold">
                {isRisk ? "!" : "✦"}
              </span>
            </div>

            <div className="min-w-0">
              {point.title && (
                <h4
                  className={`text-sm font-semibold ${
                    isRisk
                      ? "text-red-200"
                      : "text-emerald-200"
                  }`}
                >
                  {point.title}
                </h4>
              )}

              <p
                className={`text-sm leading-6 text-gray-400 ${
                  point.title ? "mt-1.5" : ""
                }`}
              >
                {point.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AIReportPoints;