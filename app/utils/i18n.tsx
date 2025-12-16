// utils/i18n.ts

/*
export function getLocalizedText(
  data: any, 
  lang: 'KO' | 'EN', 
  fallback = 'KO'
): string {
  if (!data) return "";
  
  // 1순위: 유저 언어 (예: en)
  if (data[lang]) return data[lang];
  
  // 2순위: 폴백 언어 (예: ko)
  if (data[fallback]) return data[fallback];
  
  // 3순위: 일본어 원문 (jp) 혹은 첫 번째 값
  return data['jp'] || Object.values(data)[0] || "";
}

// --- 컴포넌트 사용 ---
const ProblemCard = ({ problem, userLang }) => {
  // DB의 거대한 JSON에서 필요한 언어만 딱 뽑아옴
  const questionText = getLocalizedText(problem.question, userLang);
  const explanationText = getLocalizedText(problem.explanation, userLang);

  return (
    <div>
       <h1>{questionText}</h1>
       <p>{explanationText}</p>
    </div>
  )
}*/