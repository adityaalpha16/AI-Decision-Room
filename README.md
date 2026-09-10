# 🧠 AI Decision Room

> **Four Perspectives. One Smart Choice.**

AI Decision Room is a full-stack AI-powered decision-support platform that helps users make more informed decisions by combining multiple specialized AI perspectives into a single structured analysis.

Instead of relying on a single AI response, the platform sends a user's decision to multiple specialized AI agents. Each agent independently evaluates the decision from a different perspective, after which an AI Judge synthesizes the results into a final report containing a recommendation, confidence score, risks, opportunities, and supporting reasoning.

---

## 🚀 Why AI Decision Room?

Important decisions often involve multiple competing factors.

A single AI response can provide useful information, but it may not adequately represent different viewpoints.

AI Decision Room approaches the problem as a **multi-agent decision-support system**.

The platform:

1. Collects the user's decision and context.
2. Sends the decision to multiple specialized AI agents.
3. Generates independent perspectives.
4. Stores the analyses in PostgreSQL.
5. Synthesizes the perspectives into a final AI report.
6. Presents the result through an interactive dashboard.

The goal is not to replace human decision-making, but to provide structured perspectives that help users reason about their choices.

---

# ✨ Features

## 🤖 Multi-Agent AI Analysis

Every decision is evaluated by multiple specialized AI perspectives:

- **Analyst** — logical and data-driven analysis
- **Optimist** — opportunity and growth-focused analysis
- **Critic** — risk and failure analysis
- **Strategist** — long-term consequences and strategic analysis

Each agent produces an independent:

- Analysis
- Recommendation
- Confidence score
- Key risks
- Key opportunities

---

## ⚖️ AI Judge / Final Synthesis

After the individual analyses are generated, the system creates a final report that synthesizes the available perspectives.

The final report provides:

- Overall recommendation
- Confidence score
- Summary
- Key risks
- Key opportunities
- Reasoning based on the agent perspectives

This creates a structured decision-making workflow instead of returning an unstructured AI response.

---

## 📊 Decision Dashboard

The dashboard provides an overview of the user's decision activity.

It includes:

- Total decisions
- Completed decisions
- Processing decisions
- Pending decisions
- Failed decisions
- AI analysis count
- Generated report count
- Average AI confidence
- Recent decisions
- Latest AI recommendation

All dashboard data is filtered to the authenticated user.

---

## 📝 Decision Management

Users can:

- Create new decisions
- Provide detailed problem descriptions
- Add optional context
- Run AI analysis
- Generate final reports
- View previous decisions
- Open individual decision rooms
- Compare completed decisions

---

## 🔐 Authentication & User Accounts

The application includes user authentication using:

- Signup
- Login
- JWT authentication
- Protected routes
- Current-user endpoint
- Profile management
- Email updates
- Password changes
- Logout

Passwords are securely hashed before being stored.

Protected backend endpoints verify the user's JWT before accessing user-specific resources.

---

## 🔄 Decision Workflow

```text
                    ┌─────────────────────┐
                    │     User Decision   │
                    │ Problem + Context   │
                    └──────────┬──────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    Decision Created     │
                  │       PostgreSQL        │
                  └────────────┬────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │      Multi-Agent Analysis   │
                └─────────────┬───────────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
        ┌─────────┐      ┌─────────┐      ┌─────────┐
        │ Analyst │      │ Optimist│      │ Critic  │
        └────┬────┘      └────┬────┘      └────┬────┘
             │                │                │
             └────────────────┼────────────────┘
                              │
                         ┌────▼─────┐
                         │Strategist│
                         └────┬─────┘
                              │
                              ▼
                   ┌────────────────────┐
                   │    AI Judge        │
                   │ Final Synthesis    │
                   └─────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Final AI Report   │
                  │ Recommendation      │
                  │ Confidence          │
                  │ Risks               │
                  │ Opportunities       │
                  └─────────────────────┘