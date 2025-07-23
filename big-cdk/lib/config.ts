enum ENVIRONMENT {
  DEV = "dev",
}

// Option 2: Type guard (safer)
function isValidEnvironment(env?: string): env is ENVIRONMENT {
  return env !== undefined && Object.keys(ENVIRONMENT).includes(env); // Adjust based on your ENVIRONMENT type
}

export const Environment: ENVIRONMENT = isValidEnvironment(
  process.env.ENVIRONMENT,
)
  ? process.env.ENVIRONMENT
  : ENVIRONMENT.DEV;

type CONFIG = {
  account: string;
  region: string;
  environment: string;
};

const configs: { [key in ENVIRONMENT]: CONFIG } = {
  [ENVIRONMENT.DEV]: {
    account: "142037127835",
    region: "us-east-1",
    environment: "dev",
  },
};

export default configs[Environment];
