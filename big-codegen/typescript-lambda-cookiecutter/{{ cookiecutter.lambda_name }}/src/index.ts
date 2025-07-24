/**
 * {{ cookiecutter.lambda_description }}
 *
 * This Lambda function is generated from the TypeScript Lambda cookiecutter template.
 * Customize this handler function for your specific use case.
 */

/**
 * Main Lambda handler function
 */
export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World!" }),
  };
};
