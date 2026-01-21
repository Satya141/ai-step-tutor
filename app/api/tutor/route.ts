import { NextResponse } from "next/server";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problem, studentStep, stepNumber, mode } = body;

    let prompt = "";

    // 🟢 PHASE 1: CONCEPT EXPLANATION
    if (mode === "concept") {
      prompt = `
You are a friendly math tutor for students in grades 6–12.

Problem:
${problem}

Explain the CORE CONCEPT needed to solve this problem.
- Keep it simple
- Do NOT solve the problem
- Do NOT mention steps or answers

End by asking:
"What should be the first step?"
`;
    }

    // 🟢 PHASE 2: STEP VALIDATION
    else {
      prompt = `
You are a friendly math tutor.

Problem:
${problem}

Student's step:
${studentStep}

Rules:
- First clearly say if the step is correct or not.
- If correct:
  • Give a SHORT explanation (1–2 sentences).
  • Show ONLY the next step (not the final answer).
  • Ask one simple follow-up question.
- If incorrect:
  • Give a small hint.
  • Encourage the student to try again.

Constraints:
- Keep responses under 5 lines.
- Do NOT repeat the student’s sentence.
- Do NOT solve the entire problem.



Be concise.
Do NOT solve the entire problem.
`;
    }

    const result = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    return NextResponse.json({
      reply: result.text,
    });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { reply: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
