export function checkPlan(planId: string) {
  if (!planId) {
    throw new Error("Plan id not found");
  }

  let amount: number;
  let credits: number;

  switch (planId) {
    case "1":
      amount = 50;
      credits = 100;
      break;
    case "2":
      amount = 100;
      credits = 200;
      break;
    case "3":
      amount = 150;
      credits = 300;
      break;
    case "4":
      amount = 200;
      credits = 450;
      break;
    case "5":
      amount = 250;
      credits = 550;
      break;
    case "6":
      amount = 300;
      credits = 700;
      break;
    default:
      throw new Error("Invalid plan id");
  }

  return { amount, credits };
}

export function findPlanWithAmount(amount: number) {
  const plan = plans.find((plan) => plan.amount === amount);

  if (!plan) throw new Error(`Plan not found for the amount: ${amount}`);

  return plan;
}

const plans: { amount: number; credits: number }[] = [
  { amount: 50, credits: 100 },
  { amount: 100, credits: 200 },
  { amount: 150, credits: 300 },
  { amount: 200, credits: 450 },
  { amount: 250, credits: 550 },
  { amount: 300, credits: 700 },
];
