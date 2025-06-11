import { faker } from "@faker-js/faker";

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const generateRandomUsername = (): string => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};
