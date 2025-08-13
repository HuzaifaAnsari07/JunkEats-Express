
'use server';

/**
 * @fileOverview An AI agent that suggests personalized junk food combos based on user's past order history.
 *
 * - suggestCombo - A function that suggests a personalized junk food combo.
 * - SuggestComboInput - The input type for the suggestCombo function.
 * - SuggestComboOutput - The return type for the suggestCombo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { products } from '@/lib/data';

const SuggestComboInputSchema = z.object({
  userOrderHistory: z.array(
    z.object({
      itemName: z.string(),
      category: z.string(),
    })
  ).describe('The user order history, containing list of item names and categories.'),
  preferences: z.string().optional().describe('The user preferences.'),
});
export type SuggestComboInput = z.infer<typeof SuggestComboInputSchema>;

const SuggestComboOutputSchema = z.object({
  comboSuggestion: z.array(
    z.object({
      itemName: z.string(),
      category: z.string(),
      description: z.string().optional(),
    })
  ).describe('The suggested junk food combo, containing list of item names and categories.'),
  reasoning: z.string().describe('The detailed reasoning behind the combo suggestion.'),
});
export type SuggestComboOutput = z.infer<typeof SuggestComboOutputSchema>;

export async function suggestCombo(input: SuggestComboInput): Promise<SuggestComboOutput> {
  return suggestComboFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComboPrompt',
  input: {schema: SuggestComboInputSchema},
  output: {schema: SuggestComboOutputSchema},
  prompt: `You are a personalized junk food combo suggestion expert. You will use the user's order history and preferences to create a combo suggestion from the available menu items.

Available Menu Items:
{{#each products}}
- {{this.name}} ({{this.category}})
{{/each}}

User Order History:
{{#each userOrderHistory}}
- {{this.itemName}} ({{this.category}})
{{/each}}

User Preferences: {{preferences}}

Based on the user's order history, preferences, and the available menu items, suggest a personalized and creative junk food combo. Avoid suggesting the most obvious pairings. Provide a detailed reasoning behind the suggestion. The combo should have items from different categories. Return the combo suggestion in JSON format. The combo suggestion should be an array of objects with itemName, category and description (optional) fields. Make sure that your response follows the schema description and only contains items from the menu. Ensure that the description is enticing and makes the user want to try it. Be creative and do not suggest the same combo every time.
`,
});

const suggestComboFlow = ai.defineFlow(
  {
    name: 'suggestComboFlow',
    inputSchema: SuggestComboInputSchema,
    outputSchema: SuggestComboOutputSchema,
  },
  async input => {
    const {output} = await prompt({...input, products});
    return output!;
  }
);
