export type ObjectType = 'User' | 'Process' | 'Elementos';

export const fileMapping: Record<ObjectType, string> = {
  User: './data/users.json',
  Process: './data/products.json',
  Elementos: './data/elementos.json'
};