// PERFECT parser for transcripts saved as a single string
function parseTranscriptString(raw) {
  if (!raw || typeof raw !== "string") return [];

  const text = raw.replace(/\r/g, "").trim();

  // Split at each "Q:" but keep the delimiter
  const blocks = text.split(/(?=Q:\s*)/g).filter(Boolean);

  const result = [];

  blocks.forEach((block) => {
    const qMatch = block.match(/Q:\s*(.*?)(?=A:\s*)/s);
    const aMatch = block.match(/A:\s*(.*)/s);

    let question = qMatch ? qMatch[1].trim() : "";
    let answer = aMatch ? aMatch[1].trim() : "";

    // Clean weird spacing
    question = question.replace(/\s+/g, " ");
    answer = answer.replace(/\s+/g, " ");

    if (question || answer) {
      result.push({ question, answer });
    }
  });

  return result;
}


// COMPONENT: Nicely formatted Q/A transcript
export const TranscriptView = ({ transcript }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Interview Transcript
      </h2>

      {transcript.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No transcript available.
        </p>
      )}

      {transcript.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
        >
          {/* Question */}
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-purple-700 dark:text-purple-300 font-semibold">
              Question {idx + 1}
            </p>
            <p className="text-gray-900 dark:text-white mt-2">{item.question}</p>
          </div>

          {/* Answer */}
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Your Answer:
            </p>
            <p className="text-gray-900 dark:text-gray-200 whitespace-pre-line">
              {item.answer || "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
