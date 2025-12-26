"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Code,
  Eye,
  Save,
  Loader2,
  Trash2,
  Plus,
  X,
} from "lucide-react";

// Types matching the expected JSON structure
interface Sentence {
  original: string;
}

interface ContentText {
  layout: "text";
  sentences: Sentence[];
}

interface ContentFlyer {
  layout: "flyer";
  title?: string;
  table?: unknown;
  conditions?: unknown;
}

type Content = ContentText | ContentFlyer;

interface Option {
  id: number;
  text: { jp: string };
}

interface Vocab {
  word: string;
  reading: string;
  meaning: { ko: string; en?: string };
}

interface ProblemInput {
  level: number;
  type: string;
  subType: string;
  content: Content;
  options: Option[];
  answerIndex: number;
  explanation: { ko: string; en?: string };
  vocab?: Vocab[];
  reasoning_for_level?: string;
}

// Valid enum values
const PROBLEM_TYPES = ["VOCAB", "GRAMMAR", "READING", "LISTENING"];
const PROBLEM_SUB_TYPES = [
  "KANJI_READING",
  "ORTHOGRAPHY",
  "WORD_FORMATION",
  "CONTEXT",
  "PARAPHRASE",
  "USAGE",
  "GRAMMAR_FORM",
  "GRAMMAR_ORDER",
  "TEXT_GRAMMAR",
  "SHORT_PASSAGE",
  "MID_PASSAGE",
  "LONG_PASSAGE",
  "INTEGRATED_PASSAGE",
  "THEMATIC_PASSAGE",
  "INFO_RETRIEVAL",
  "TASK_BASED",
  "POINT_COMPREHENSION",
  "SUMMARY",
  "QUICK_RESPONSE",
  "INTEGRATED_COMPREHENSION",
];

interface ValidationError {
  field: string;
  message: string;
}

function validateProblem(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== "object") {
    errors.push({ field: "root", message: "유효한 JSON 객체가 아닙니다." });
    return errors;
  }

  const problem = data as Record<string, unknown>;

  if (typeof problem.level !== "number" || problem.level < 1 || problem.level > 5) {
    errors.push({ field: "level", message: "level은 1~5 사이의 숫자여야 합니다." });
  }

  if (!PROBLEM_TYPES.includes(problem.type as string)) {
    errors.push({ field: "type", message: `type은 ${PROBLEM_TYPES.join(", ")} 중 하나여야 합니다.` });
  }

  if (!PROBLEM_SUB_TYPES.includes(problem.subType as string)) {
    errors.push({ field: "subType", message: `subType이 유효하지 않습니다.` });
  }

  if (!problem.content || typeof problem.content !== "object") {
    errors.push({ field: "content", message: "content 객체가 필요합니다." });
  } else {
    const content = problem.content as Record<string, unknown>;
    if (!["text", "flyer"].includes(content.layout as string)) {
      errors.push({ field: "content.layout", message: "layout은 'text' 또는 'flyer'여야 합니다." });
    }
    if (content.layout === "text" && !Array.isArray(content.sentences)) {
      errors.push({ field: "content.sentences", message: "text 레이아웃에는 sentences 배열이 필요합니다." });
    }
  }

  if (!Array.isArray(problem.options) || problem.options.length !== 4) {
    errors.push({ field: "options", message: "options는 4개의 항목이 있는 배열이어야 합니다." });
  } else {
    (problem.options as Option[]).forEach((opt, idx) => {
      if (!opt.id || !opt.text?.jp) {
        errors.push({ field: `options[${idx}]`, message: `옵션 ${idx + 1}에 id와 text.jp가 필요합니다.` });
      }
    });
  }

  if (typeof problem.answerIndex !== "number" || problem.answerIndex < 0 || problem.answerIndex > 3) {
    errors.push({ field: "answerIndex", message: "answerIndex는 0~3 사이의 숫자여야 합니다." });
  }

  if (!problem.explanation || typeof (problem.explanation as Record<string, unknown>).ko !== "string") {
    errors.push({ field: "explanation", message: "explanation.ko가 필요합니다." });
  }

  return errors;
}

const SAMPLE_JSON = `{
  "level": 1,
  "type": "VOCAB",
  "subType": "KANJI_READING",
  "content": {
    "layout": "text",
    "sentences": [
      { "original": "彼は<u>勤勉</u>な学生だ。" }
    ]
  },
  "options": [
    { "id": 1, "text": { "jp": "きんべん" } },
    { "id": 2, "text": { "jp": "きんめん" } },
    { "id": 3, "text": { "jp": "ごんべん" } },
    { "id": 4, "text": { "jp": "ごんめん" } }
  ],
  "answerIndex": 0,
  "explanation": {
    "ko": "勤勉(きんべん)은 '근면하다'라는 의미입니다.",
    "en": "勤勉 (kinben) means 'diligent'."
  },
  "vocab": [
    { "word": "勤勉", "reading": "きんべん", "meaning": { "ko": "근면", "en": "diligence" } }
  ],
  "reasoning_for_level": "N1 수준의 한자 읽기 문제입니다."
}`;

export default function NewProblemPage() {
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [parsedData, setParsedData] = useState<ProblemInput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"json" | "preview">("json");

  // Handle validation and auto-switch to preview
  const handleValidate = () => {
    setSaveError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      const validationErrors = validateProblem(parsed);
      setErrors(validationErrors);
      
      if (validationErrors.length === 0) {
        setIsValidated(true);
        setParsedData(parsed as ProblemInput);
        setViewMode("preview"); // Auto-switch to preview on success
      } else {
        setIsValidated(false);
        setParsedData(null);
      }
    } catch {
      setErrors([{ field: "root", message: "JSON 파싱 오류: 올바른 JSON 형식이 아닙니다." }]);
      setIsValidated(false);
      setParsedData(null);
    }
  };

  // Clear JSON input
  const handleClear = () => {
    setJsonInput("");
    setErrors([]);
    setIsValidated(false);
    setParsedData(null);
    setViewMode("json");
  };

  // Update parsed data (for editable preview)
  const updateParsedData = (updates: Partial<ProblemInput>) => {
    if (!parsedData) return;
    setParsedData({ ...parsedData, ...updates });
  };

  // Update content sentences
  const updateSentence = (index: number, value: string) => {
    if (!parsedData || parsedData.content.layout !== "text") return;
    const newSentences = [...(parsedData.content as ContentText).sentences];
    newSentences[index] = { original: value };
    updateParsedData({
      content: { ...parsedData.content, sentences: newSentences } as ContentText,
    });
  };

  // Update option
  const updateOption = (index: number, value: string) => {
    if (!parsedData) return;
    const newOptions = [...parsedData.options];
    newOptions[index] = { ...newOptions[index], text: { jp: value } };
    updateParsedData({ options: newOptions });
  };

  // Update vocab
  const updateVocab = (index: number, field: "word" | "reading" | "meaning_ko" | "meaning_en", value: string) => {
    if (!parsedData || !parsedData.vocab) return;
    const newVocab = [...parsedData.vocab];
    if (field === "meaning_ko") {
      newVocab[index] = { ...newVocab[index], meaning: { ...newVocab[index].meaning, ko: value } };
    } else if (field === "meaning_en") {
      newVocab[index] = { ...newVocab[index], meaning: { ...newVocab[index].meaning, en: value } };
    } else {
      newVocab[index] = { ...newVocab[index], [field]: value };
    }
    updateParsedData({ vocab: newVocab });
  };

  // Add new vocab
  const addVocab = () => {
    if (!parsedData) return;
    const newVocab = [...(parsedData.vocab || []), { word: "", reading: "", meaning: { ko: "", en: "" } }];
    updateParsedData({ vocab: newVocab });
  };

  // Remove vocab
  const removeVocab = (index: number) => {
    if (!parsedData || !parsedData.vocab) return;
    const newVocab = parsedData.vocab.filter((_, i) => i !== index);
    updateParsedData({ vocab: newVocab });
  };

  const handleSave = async () => {
    if (!parsedData) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "저장 실패");
      }

      router.push("/admin?saved=true");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "저장 중 오류 발생");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#D8D3C8] hover:border-[#C84B31] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#5D5548]" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#2C241B]">
              문제 추가
            </h1>
            <p className="text-[#5D5548] text-sm">JSON 형식으로 문제를 입력하세요.</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("json")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              viewMode === "json"
                ? "bg-[#2C241B] text-white"
                : "bg-white text-[#5D5548] border border-[#D8D3C8] hover:border-[#2C241B]"
            }`}
          >
            <Code className="w-4 h-4" /> JSON 입력
          </button>
          <button
            onClick={() => setViewMode("preview")}
            disabled={!parsedData}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-[#2C241B] text-white"
                : parsedData
                ? "bg-white text-[#5D5548] border border-[#D8D3C8] hover:border-[#2C241B]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Eye className="w-4 h-4" /> 미리보기 (편집)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* JSON Input / Editable Preview */}
          <div className="lg:col-span-2">
            {viewMode === "json" ? (
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] overflow-hidden">
                <div className="bg-[#2C241B] text-white px-4 py-2 text-sm font-medium flex justify-between items-center">
                  <span>JSON 입력</span>
                  <button
                    onClick={handleClear}
                    className="text-white/70 hover:text-white flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3 h-3" /> 초기화
                  </button>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    setIsValidated(false);
                    setErrors([]);
                  }}
                  className="w-full h-[600px] p-4 font-mono text-sm bg-[#FDFBF7] text-[#2C241B] focus:outline-none resize-none"
                  spellCheck={false}
                  placeholder="JSON 형식으로 문제를 입력하세요..."
                />
              </div>
            ) : (
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6 min-h-[600px]">
                <div className="text-sm text-[#5D5548] mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> 편집 가능한 미리보기
                </div>
                {parsedData ? (
                  <div className="space-y-6">
                    {/* Level & Type Selectors */}
                    <div className="flex flex-wrap gap-3">
                      <div>
                        <label className="text-xs text-[#5D5548] block mb-1">Level</label>
                        <select
                          value={parsedData.level}
                          onChange={(e) => updateParsedData({ level: parseInt(e.target.value) })}
                          className="px-3 py-2 bg-[#C84B31] text-white rounded-lg font-bold text-sm"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>N{n}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#5D5548] block mb-1">Type</label>
                        <select
                          value={parsedData.type}
                          onChange={(e) => updateParsedData({ type: e.target.value })}
                          className="px-3 py-2 bg-[#2C241B] text-white rounded-lg text-sm"
                        >
                          {PROBLEM_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#5D5548] block mb-1">SubType</label>
                        <select
                          value={parsedData.subType}
                          onChange={(e) => updateParsedData({ subType: e.target.value })}
                          className="px-3 py-2 bg-[#5D5548] text-white rounded-lg text-sm"
                        >
                          {PROBLEM_SUB_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Content Sentences */}
                    {parsedData.content.layout === "text" && (
                      <div>
                        <label className="text-sm font-bold text-[#2C241B] block mb-2">문제 지문</label>
                        {(parsedData.content as ContentText).sentences.map((s, i) => (
                          <textarea
                            key={i}
                            value={s.original}
                            onChange={(e) => updateSentence(i, e.target.value)}
                            className="w-full p-3 bg-white rounded-xl border border-[#D8D3C8] text-lg font-serif focus:outline-none focus:border-[#C84B31] resize-none"
                            rows={2}
                          />
                        ))}
                      </div>
                    )}

                    {/* Options */}
                    <div>
                      <label className="text-sm font-bold text-[#2C241B] block mb-2">보기 (정답 클릭하여 선택)</label>
                      <div className="space-y-2">
                        {parsedData.options.map((opt, idx) => (
                          <div
                            key={opt.id}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                              idx === parsedData.answerIndex
                                ? "border-green-500 bg-green-50"
                                : "border-[#D8D3C8] bg-white hover:border-[#5D5548]"
                            }`}
                            onClick={() => updateParsedData({ answerIndex: idx })}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === parsedData.answerIndex ? "bg-green-500 text-white" : "bg-[#EBE7DF] text-[#5D5548]"
                            }`}>
                              {opt.id}
                            </span>
                            <input
                              type="text"
                              value={opt.text.jp}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateOption(idx, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-transparent focus:outline-none text-lg"
                            />
                            {idx === parsedData.answerIndex && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="text-sm font-bold text-[#2C241B] block mb-2">해설</label>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-[#5D5548]">한국어</span>
                          <textarea
                            value={parsedData.explanation.ko}
                            onChange={(e) => updateParsedData({
                              explanation: { ...parsedData.explanation, ko: e.target.value }
                            })}
                            className="w-full p-3 bg-blue-50 rounded-xl border border-blue-200 focus:outline-none focus:border-blue-400 resize-none"
                            rows={3}
                          />
                        </div>
                        <div>
                          <span className="text-xs text-[#5D5548]">영어 (선택)</span>
                          <textarea
                            value={parsedData.explanation.en || ""}
                            onChange={(e) => updateParsedData({
                              explanation: { ...parsedData.explanation, en: e.target.value }
                            })}
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vocab */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-[#2C241B]">주요 단어</label>
                        <button
                          onClick={addVocab}
                          className="text-xs flex items-center gap-1 text-[#C84B31] hover:underline"
                        >
                          <Plus className="w-3 h-3" /> 추가
                        </button>
                      </div>
                      <div className="space-y-3">
                        {parsedData.vocab?.map((v, i) => (
                          <div key={i} className="bg-[#EBE7DF] rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-[#5D5548]">단어 #{i + 1}</span>
                              <button
                                onClick={() => removeVocab(i)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                placeholder="단어"
                                value={v.word}
                                onChange={(e) => updateVocab(i, "word", e.target.value)}
                                className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                              />
                              <input
                                placeholder="읽기"
                                value={v.reading}
                                onChange={(e) => updateVocab(i, "reading", e.target.value)}
                                className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                              />
                              <input
                                placeholder="뜻 (KO)"
                                value={v.meaning.ko}
                                onChange={(e) => updateVocab(i, "meaning_ko", e.target.value)}
                                className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                              />
                              <input
                                placeholder="뜻 (EN)"
                                value={v.meaning.en || ""}
                                onChange={(e) => updateVocab(i, "meaning_en", e.target.value)}
                                className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                        {(!parsedData.vocab || parsedData.vocab.length === 0) && (
                          <div className="text-center text-[#5D5548] text-sm py-4">
                            단어 없음. 위의 "추가" 버튼을 눌러 추가하세요.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div>
                      <label className="text-sm font-bold text-[#2C241B] block mb-2">급수 적합성 이유 (선택)</label>
                      <textarea
                        value={parsedData.reasoning_for_level || ""}
                        onChange={(e) => updateParsedData({ reasoning_for_level: e.target.value })}
                        className="w-full p-3 bg-white rounded-xl border border-[#D8D3C8] focus:outline-none focus:border-[#C84B31] resize-none"
                        rows={2}
                        placeholder="이 문제가 해당 급수에 적합한 이유..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[#5D5548] py-20">
                    JSON을 검증하면 편집 가능한 미리보기가 표시됩니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Validation Button */}
            <button
              onClick={handleValidate}
              className="w-full py-3 bg-[#2C241B] text-white rounded-xl font-bold hover:bg-[#5D5548] transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> 검증하기
            </button>

            {/* Validation Status */}
            {errors.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                  <AlertCircle className="w-5 h-5" /> 검증 실패
                </div>
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>
                      <strong>{err.field}:</strong> {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isValidated && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 text-green-700 font-bold">
                  <Check className="w-5 h-5" /> 검증 성공!
                </div>
                <p className="text-sm text-green-600 mt-1">
                  미리보기에서 수정 후 저장하세요.
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!parsedData || isSaving}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                parsedData && !isSaving
                  ? "bg-[#C84B31] text-white hover:bg-[#A63620]"
                  : "bg-[#D8D3C8] text-[#5D5548] cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 저장 중...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> DB에 저장
                </>
              )}
            </button>

            {saveError && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-red-600 text-sm">
                {saveError}
              </div>
            )}

            {/* Help */}
            <div className="bg-[#FDFBF7] rounded-xl p-4 border border-[#D8D3C8] text-sm text-[#5D5548]">
              <div className="font-bold mb-2">사용 방법</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>JSON 형식으로 문제 입력</li>
                <li>"검증하기" → 자동으로 미리보기로 전환</li>
                <li>미리보기에서 직접 수정</li>
                <li>"DB에 저장" 클릭</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
