// src/lib/parsers/action-plans.parser.ts

export type ActionPlan = {
    id: string;
    title: string;
    description: string | null;
    status: string;
  };
  
  export type ActionPlansResponse = {
    data: ActionPlan[];
    meta?: {
      total?: number;
    };
  };
  
  function isActionPlan(v: unknown): v is ActionPlan {
    if (typeof v !== "object" || v === null) return false;
  
    const c = v as Record<string, unknown>;
  
    return (
      typeof c.id === "string" &&
      typeof c.title === "string" &&
      (typeof c.description === "string" || c.description === null) &&
      typeof c.status === "string"
    );
  }
  
  export function parseActionPlans(value: unknown): ActionPlansResponse {
    if (Array.isArray(value)) {
      return {
        data: value.filter(isActionPlan),
        meta: { total: value.length },
      };
    }
  
    if (
      typeof value === "object" &&
      value !== null &&
      Array.isArray((value as { data?: unknown }).data)
    ) {
      const raw = value as {
        data: unknown[];
        meta?: { total?: unknown };
      };
  
      return {
        data: raw.data.filter(isActionPlan),
        meta: {
          total:
            typeof raw.meta?.total === "number"
              ? raw.meta.total
              : raw.data.length,
        },
      };
    }
  
    return { data: [], meta: { total: 0 } };
  }